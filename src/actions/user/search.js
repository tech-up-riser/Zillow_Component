import { isArray } from 'lodash'
import rmApi from 'rm-gus-api'
import { panMap, restorePreSearchCenter } from './map'
import { changeFilter } from './filters'
import { focusListing, clearFocusedListing } from '../content/listings'

export const USER_SEARCH_LOAD = 'USER_SEARCH_LOAD'
export const USER_SEARCH_LOAD_SUCCESS = 'USER_SEARCH_LOAD_SUCCESS'
export const USER_SEARCH_LOAD_FAIL = 'USER_SEARCH_LOAD_FAIL'

export const USER_SEARCH_AUTOCOMPLETE_LOAD = 'USER_SEARCH_AUTOCOMPLETE_LOAD'
export const USER_SEARCH_AUTOCOMPLETE_SUCCESS = 'USER_SEARCH_AUTOCOMPLETE_SUCCESS'
export const USER_SEARCH_AUTOCOMPLETE_FAIL = 'USER_SEARCH_AUTOCOMPLETE_FAIL'
export const USER_SEARCH_AUTOCOMPLETE_CLEAR = 'USER_SEARCH_AUTOCOMPLETE_CLEAR'

export function loadSuggestions(str) {
  return {
    types: [USER_SEARCH_AUTOCOMPLETE_LOAD, USER_SEARCH_AUTOCOMPLETE_SUCCESS, USER_SEARCH_AUTOCOMPLETE_FAIL],
    promise: (dispatch, getState) => new Promise(async(resolve, reject) => {
      const { settings: { api } } = getState()
      try {
        const results = await rmApi.user.search.autocomplete(str, api)
        resolve(results)
      } catch (err) {
        console.error(err)
        reject()
      }
    })
  }
}

export function clearSuggestions() {
  return { type: USER_SEARCH_AUTOCOMPLETE_CLEAR }
}

export function selectSuggestion({ location: { location }, type: [type], details }, searchText) {
  return dispatch => {
    if (type === 'mls') dispatch(focusListing({ id: searchText, ...details }))
    dispatch(changeFilter({ page: 0 }, false))
    dispatch(panMap(location))
  }
}

export function clearSearch() {
  return dispatch => {
    dispatch(changeFilter({ page: 0 }, false))
    dispatch(clearFocusedListing())
    dispatch(restorePreSearchCenter())
    dispatch(clearSuggestions())
  }
}
