import {
  RIBBONS_LOAD,
  RIBBONS_LOAD_SUCCESS,
  RIBBONS_LOAD_FAIL,
} from '../../actions/content/ribbons'

const DEFAULT_STATE = {
  checked: [],
  ribbons: {},
  isLoading: false
}

export default function ribbons(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case RIBBONS_LOAD:
      return {...state, isLoading: true }
    case RIBBONS_LOAD_SUCCESS:
      return {...state, checked: [...state.checked, ...(payload.checked || [])], ribbons: { ...state.ribbons, ...(payload.ribbons || {})}, isLoading: false }
    case RIBBONS_LOAD_FAIL:
      return {...state, isLoading: false }
    default:
      return state
  }
}
