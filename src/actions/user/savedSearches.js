import rmApi from 'rm-gus-api'
import { changeFilter } from './filters'
import { panMap, zoomMap, loadPolygon } from './map'
import { overwriteListings } from '../content/listings'
import { omitBy, omit, pickBy, mapKeys, get, isEqual } from 'lodash'

export const USER_SAVEDSEARCHES_LOAD = 'USER_SAVEDSEARCHES_LOAD'
export const USER_SAVEDSEARCHES_LOAD_SUCCESS = 'USER_SAVEDSEARCHES_LOAD_SUCCESS'
export const USER_SAVEDSEARCHES_LOAD_FAIL = 'USER_SAVEDSEARCHES_LOAD_FAIL'

export const USER_SAVEDSEARCHES_ADD = 'SAVEDSEARCHES_ADD'
export const USER_SAVEDSEARCHES_SELECT = 'SAVEDSEARCHES_SELECT'
export const USER_SAVEDSEARCHES_SET_CURRENT_ENCODED = 'SAVEDSEARCHES_SET_CURRENT_ENCODED'

export function loadSavedSearches() {
  return {
    types: [USER_SAVEDSEARCHES_LOAD, USER_SAVEDSEARCHES_LOAD_SUCCESS, USER_SAVEDSEARCHES_LOAD_FAIL],
    promise: (dispatch, getState) => new Promise(async(resolve, reject) => {
      const { settings: { api } } = getState()
      try {
        const searches = await rmApi.user.savedSearches.list(api)
        resolve(searches.sort((x, y) => x.timestamp - y.timestamp))
      } catch (err) {
        reject(err)
      }
    })
  }
}

export function loadSavedSearchFilters(id) {
  return async(dispatch, getState) => {
    const { settings: { api }, user: { map } } = getState()
    const { body, high_price, low_price, from: page, ...data } = await rmApi.user.savedSearches.filters(id, api)
    const parsedData = omitBy({ price: { high_price, low_price }, page, ...omit(data, ['secure']) },
      (_, key) => key.includes('bounding_box') || key.includes('pre_indexed_shape')
    )
    let pre_indexed_shape = pickBy(data, (value, key) => key.includes('pre_indexed_shape'))

    if (get(body, 'map')) {
      if (body.map.center && !isEqual(body.map.center, map.center)) {
        dispatch(panMap(body.map.center, false))
      }
      if (body.map.zoom && body.map.zoom !== map.zoom) {
        dispatch(zoomMap(body.map.zoom))
      }
    }

    dispatch(changeFilter(parsedData, false))

    if (Object.keys(pre_indexed_shape).length) {
      pre_indexed_shape = mapKeys(pre_indexed_shape, (_, key) => {
        const [a, keyVal] = key.split('.')
        return keyVal
      })
      try {
        const polygon = await rmApi.map.polygon.get(pre_indexed_shape.id, api)
        let coordinates = get(polygon, 'coordinates[0]')
        if (coordinates && coordinates.length) {
          dispatch(loadPolygon(coordinates.map(([lng, lat]) => ({ lat, lng })), pre_indexed_shape))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export function loadSavedSearchListings(id) {
  return async(dispatch, getState) => {
    const { user: { filters: { page } }, settings: { api, listings: { size } } } = getState()
    const { listings, total } = await rmApi.user.savedSearches.listings({ id, page, size }, api)
    dispatch(overwriteListings(listings, total))
  }
}

export function selectSavedSearch(id, refresh = true) {
  return (dispatch, getState) => {
    dispatch({ type: USER_SAVEDSEARCHES_SELECT, payload: id })
    if (refresh) {
      dispatch(loadSavedSearchFilters(id))
      dispatch(loadSavedSearchListings(id))
    }
  }
}

export function updateCurrentEncodedState(encodedSearchState) {
  return { type: USER_SAVEDSEARCHES_SET_CURRENT_ENCODED, payload: encodedSearchState }
}
