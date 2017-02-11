import {
  LISTINGS_LOAD,
  LISTINGS_LOAD_SUCCESS,
  LISTINGS_LOAD_FAIL,

  LISTINGS_ACTIVE_CHANGE,
  LISTINGS_FOCUS,
  LISTINGS_FOCUS_CLEAR
} from '../../actions/content/listings'

export const DEFAULT_STATE = {
  total: 0,
  activeListing: null,
  focused: null,
  listings: {},
  hasLoaded: false,
  isLoading: false
}

export default function listings(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case LISTINGS_LOAD:
      return {...state, isLoading: true }
    case LISTINGS_LOAD_SUCCESS:
      return {...state, ...payload, isLoading: false, hasLoaded: true }
    case LISTINGS_LOAD_FAIL:
      return {...state, isLoading: false, error: payload, hasLoaded: false }
    case LISTINGS_ACTIVE_CHANGE:
      return {...state, activeListing: payload }
    case LISTINGS_FOCUS:
      return {...state, focused: payload }
    case LISTINGS_FOCUS_CLEAR:
      return {...state, focused: null }
    default:
      return state
  }
}
