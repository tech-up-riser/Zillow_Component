import { USER_FILTER_CHANGE } from '../../actions/user/filters'

export default function filters(state = {}, { type, payload }) {
  switch (type) {
    case USER_FILTER_CHANGE:
      return { ...state, ...payload }
    default:
      return state
  }
}
