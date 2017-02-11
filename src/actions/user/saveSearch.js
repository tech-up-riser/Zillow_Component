import rmApi from 'rm-gus-api'
import { omitBy, omit, isNil } from 'lodash'
import { stringify as qsStringify } from 'qs'
import { USER_SAVEDSEARCHES_ADD } from './savedSearches'

export const USER_SAVESEARCH_UI_TOGGLE = 'USER_SAVESEARCH_UI_TOGGLE'

export function toggleSaveSearchUI() {
  return { type: USER_SAVESEARCH_UI_TOGGLE }
}

export function saveSearch(name) {
  return async(dispatch, getState) => {
    const { settings: { api }, user: { map: { polygon, center, zoom }, filters } } = getState()
    const parms = omitBy({
      ...omit({...filters, ...filters.price, from: filters.page }, ['page', 'price']),
      pre_indexed_shape: polygon
    }, isNil)

    const options = {
      parms: qsStringify(parms, {
        skipNulls: true,
        allowDots: true
      }),
      body: { map: { center, zoom } }
    }

    const { id } = await rmApi.user.savedSearches.save(name, options, api)
    dispatch({ type: USER_SAVEDSEARCHES_ADD, payload: { id, name, timestamp: +new Date() } })
    dispatch(toggleSaveSearchUI())
  }
}
