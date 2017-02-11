import { USER_HEADER_TOGGLE_MORE_FILTERS } from '../../actions/user/header'

const DEFAULT_STATE = {
  moreFiltersShown: false
}

export default function header(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case USER_HEADER_TOGGLE_MORE_FILTERS:
      return { ...state, moreFiltersShown: payload }
    default:
      return state
  }
}
