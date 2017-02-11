import {
  USER_SEARCH_AUTOCOMPLETE_LOAD,
  USER_SEARCH_AUTOCOMPLETE_SUCCESS,
  USER_SEARCH_AUTOCOMPLETE_FAIL,
  USER_SEARCH_AUTOCOMPLETE_CLEAR,

  USER_SEARCH_LOAD,
  USER_SEARCH_LOAD_SUCCESS,
  USER_SEARCH_LOAD_FAIL
} from '../../actions/user/search'

export const DEFAULT_STATE = {
  suggestions: [],
  suggestionsLoading: false,
  isLoading: false,
  isLoaded: false
}

export default function search(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case USER_SEARCH_AUTOCOMPLETE_LOAD:
      return { ...state, suggestionsLoading: true }
    case USER_SEARCH_AUTOCOMPLETE_SUCCESS:
      return { ...state, suggestionsLoading: false, suggestions: payload }
    case USER_SEARCH_AUTOCOMPLETE_FAIL:
      return { ...state, suggestionsLoading: false, suggestions: [] }
    case USER_SEARCH_AUTOCOMPLETE_CLEAR:
      return { ...state, suggestions: [] }
    default:
      return state
  }
}
