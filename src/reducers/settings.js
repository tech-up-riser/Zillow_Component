import {set } from 'lodash'
import { USER_FILTER_OPTIONS_LOADED } from '../actions/user/filters'
import { USER_FAVOURITES_LOAD_FAIL } from '../actions/content/ribbons'
import { USER_SAVEDSEARCHES_LOAD_FAIL } from '../actions/user/savedSearches'

export default function settings(state = {}, { type, payload }) {
  switch (type) {
    case USER_FILTER_OPTIONS_LOADED:
      return {...state,
        filters: {...state.filters,
          [payload.filter]: set({...state.filters[payload.filter] }, 'options', payload.options)
        }
      }
    case USER_SAVEDSEARCHES_LOAD_FAIL:
    case USER_FAVOURITES_LOAD_FAIL:
      return { ...state, loggedIn: false }
    default:
      return state
  }
}
