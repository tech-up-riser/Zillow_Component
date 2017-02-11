import { isArray } from 'lodash'
import rmApi from 'rm-gus-api'
import { loadRibbons } from './ribbons'

export const LISTINGS_LOAD = 'LISTINGS_LOAD'
export const LISTINGS_LOAD_SUCCESS = 'LISTINGS_LOAD_SUCCESS'
export const LISTINGS_LOAD_FAIL = 'LISTINGS_LOAD_FAIL'

export const LISTINGS_ACTIVE_CHANGE = 'LISTINGS_ACTIVE_CHANGE'
export const LISTINGS_FOCUS = 'LISTINGS_FOCUS'
export const LISTINGS_FOCUS_CLEAR = 'LISTINGS_FOCUS_CLEAR'

/**
 * Method for remiving extra unused data from elastic search query
 * @property {array} hits         Raw listings from elastic search
 * @return {array}                Sanitized listings
 */
export const sanitizeHits = hits => hits.map(({ _id, _source, ...junk }) => ({ _id, ..._source }))

export function loadListings() {
  return {
    types: [LISTINGS_LOAD, LISTINGS_LOAD_SUCCESS, LISTINGS_LOAD_FAIL],
    promise: (dispatch, getState) => new Promise(async(resolve, reject) => {
      const {
        user: { filters, map: { isEnabled: mapIsEnabled, ...map } },
        settings: { api }
      } = getState()
      const { hits, total, encodedSearchState } = await rmApi.content.listings.fetch(filters, mapIsEnabled ? map : null, api)
      const listings = sanitizeHits(hits)
      var currentPath = rmApi.formatQuery({
        page: filters.page,
        sort: filters.sort,
        size: filters.size,
        filters: filters,
        map: mapIsEnabled ? map : null
      })

      let listingsDict = {}
      listings.forEach(
        ({ _id, ...listing }) => (listingsDict[_id] = { _id, ...listing })
      )

      resolve({ listings: listingsDict, total, currentPath })
      dispatch(loadRibbons(listingsDict))
    })
  }
}

export function focusListing(listing) {
  return { type: LISTINGS_FOCUS, payload: listing }
}

export function clearFocusedListing() {
  return { type: LISTINGS_FOCUS_CLEAR }
}

export function overwriteListings(listings, total) {
  return { type: LISTINGS_LOAD_SUCCESS, payload: { listings, total } }
}

export function changeActiveListing(payload = null) {
  return { type: LISTINGS_ACTIVE_CHANGE, payload }
}

export function hasLoaded({ content: { listings: { hasLoaded } } }) {
  return hasLoaded
}
