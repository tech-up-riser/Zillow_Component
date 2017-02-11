import {
  USER_SAVESEARCH_UI_TOGGLE
} from '../../actions/user/saveSearch'

export const DEFAULT_STATE = {
  isOpen: false
}

export default function saveSearch(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case USER_SAVESEARCH_UI_TOGGLE:
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}
