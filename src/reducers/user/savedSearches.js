import {
  USER_SAVEDSEARCHES_LOAD,
  USER_SAVEDSEARCHES_LOAD_SUCCESS,
  USER_SAVEDSEARCHES_LOAD_FAIL,

  USER_SAVEDSEARCHES_ADD,
  USER_SAVEDSEARCHES_SELECT,
  USER_SAVEDSEARCHES_SET_CURRENT_ENCODED
} from '../../actions/user/savedSearches'

export const DEFAULT_STATE = {
  searches: [],
  selected: null,
  currentSearchEncoded: null,
  isLoaded: false,
  isLoading: false
}

export default function savedSearches(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case USER_SAVEDSEARCHES_LOAD:
      return {...state, isLoading: true, isLoaded: false }
    case USER_SAVEDSEARCHES_LOAD_SUCCESS:
      return {...state, isLoading: false, isLoaded: true, searches: payload }
    case USER_SAVEDSEARCHES_LOAD_FAIL:
      return {...state, isLoading: false, isLoaded: false }

    case USER_SAVEDSEARCHES_ADD:
      return {...state, searches: [...state.searches, payload] }
    case USER_SAVEDSEARCHES_SELECT:
      return {...state, selected: payload }
    case USER_SAVEDSEARCHES_SET_CURRENT_ENCODED:
      return {...state, currentSearchEncoded: payload }
    default:
      return state
  }
}
