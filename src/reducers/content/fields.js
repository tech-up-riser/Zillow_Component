import {
  FILTER_FIELDS_LOAD,
  FILTER_FIELDS_LOAD_SUCCESS,
  FILTER_FIELDS_LOAD_FAIL,
} from '../../actions/content/fields'

export default function fields(state = {}, { type, payload }) {
  switch (type) {
    case FILTER_FIELDS_LOAD:
    case FILTER_FIELDS_LOAD_FAIL:
      return { ...state, [payload]: [] }
    case FILTER_FIELDS_LOAD_SUCCESS:
      return { ...state, [payload.id]: payload.fields }
    default:
      return state
  }
}
