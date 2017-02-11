import {
  USER_MAP_TOGGLE,
  USER_MAP_DRAWING_TOGGLE,
  USER_MAP_CHANGED,

  USER_MAP_PAN,
  USER_MAP_PAN_FINNISH,

  USER_MAP_ZOOM,
  USER_MAP_ZOOM_FINNISH,

  USER_MAP_PRESEARCH_CENTER,
  USER_MAP_POLYGON_SAVE,
  USER_MAP_POLYGON_CLEAR,

  USER_MAP_POLYGON_LOAD,
  USER_MAP_POLYGON_LOADED
} from '../../actions/user/map'

export const DEFAULT_STATE = {
  panTo: null,
  zoomTo: null,
  preSearchCenter: null,
  polygonLoad: null,
  polygon: null,
  center: null,
  bounds: null,
  zoom: null,
  isEnabled: true,
  isDrawing: false
}

export default function map(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case USER_MAP_CHANGED:
      return { ...state, ...payload }
    case USER_MAP_TOGGLE:
      return { ...state, isEnabled: payload }
    case USER_MAP_DRAWING_TOGGLE:
      return { ...state, isDrawing: payload }

    case USER_MAP_PAN:
      return { ...state, panTo: payload }
    case USER_MAP_PAN_FINNISH:
      return { ...state, panTo: null }

    case USER_MAP_ZOOM:
      return { ...state, zoomTo: payload }
    case USER_MAP_ZOOM_FINNISH:
      return { ...state, zoomTo: null }

    case USER_MAP_PRESEARCH_CENTER:
      return { ...state, preSearchCenter: payload }
    case USER_MAP_POLYGON_SAVE:
      return { ...state, polygon: payload }
    case USER_MAP_POLYGON_CLEAR:
      return { ...state, polygon: null, polygonLoad: null }

    case USER_MAP_POLYGON_LOAD:
      return { ...state, polygonLoad: payload.coordinates, polygon: payload.meta }
    case USER_MAP_POLYGON_LOADED:
      return { ...state, polygonLoad: null }
    default:
      return state
  }
}
