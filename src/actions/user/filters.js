import { loadListings } from '../content/listings'
import rmApi from 'rm-gus-api'

export const USER_FILTER_CHANGE = 'USER_FILTER_CHANGE'
export const USER_FILTER_OPTIONS_LOADED = 'USER_FILTER_OPTIONS_LOADED'

export function changeFilter(filters, refreshListings = true) {
  return dispatch => {
    dispatch({ type: USER_FILTER_CHANGE, payload: filters })
    refreshListings && dispatch(loadListings())
  }
}

export function paginate(page, refreshListings) {
  return changeFilter({ page }, refreshListings)
}

export function changeSort(sort, refreshListings) {
  return changeFilter({ sort }, refreshListings)
}

export function loadFilterOptions(filter, { formatter, remoteOptionsFieldName }, apiState) {
  return async(dispatch) => dispatch({
    type: USER_FILTER_OPTIONS_LOADED,
    payload: {
      filter,
      options: await rmApi.content.filters.fields({ formatter, name: remoteOptionsFieldName }, apiState)
    }
  })
}
