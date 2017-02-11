import { without } from 'lodash'
import {
  USER_FAVOURITES_TOGGLE,
  USER_FAVOURITES_LOAD,
  USER_FAVOURITES_LOAD_SUCCESS,
  USER_FAVOURITES_LOAD_FAIL
} from '../../actions/user/favourites'

export const DEFAULT_STATE = {
  isLoading: false,
  hasLoaded: false,
  favs: []
}

export default function favourites(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case USER_FAVOURITES_LOAD:
      return {...state, isLoading: true }
    case USER_FAVOURITES_LOAD_SUCCESS:
      return {...state, favs: payload, isLoading: false, hasLoaded: true }
    case USER_FAVOURITES_LOAD_FAIL:
      return {...state, isLoading: false, hasLoaded: true, favs: [] }

    case USER_FAVOURITES_TOGGLE:
      return payload.state ? {...state, favs: [...state.favs, payload.id] } : {...state, favs: without(state.favs, payload.id) }
    default:
      return state
  }
}
