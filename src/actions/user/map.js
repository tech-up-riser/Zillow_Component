import { loadListings } from '../content/listings'
import rmApi from 'rm-gus-api'
import { polygon as turfPolygon } from 'turf'
import { paginate } from './filters'

export const USER_MAP_TOGGLE = 'USER_MAP_TOGGLE'
export const USER_MAP_CHANGED = 'USER_MAP_CHANGED'
export const USER_MAP_DRAWING_TOGGLE = 'USER_MAP_DRAWING_TOGGLE'

export const USER_MAP_PAN = 'USER_MAP_PAN'
export const USER_MAP_PAN_FINNISH = 'USER_MAP_PAN_FINNISH'
export const USER_MAP_PRESEARCH_CENTER = 'USER_MAP_PRESEARCH_CENTER'

export const USER_MAP_ZOOM = 'USER_MAP_ZOOM'
export const USER_MAP_ZOOM_FINNISH = 'USER_MAP_ZOOM_FINNISH'
export const USER_MAP_PRESEARCH_ZOOM = 'USER_MAP_PRESEARCH_ZOOM'

export const USER_MAP_POLYGON_LOAD = 'USER_MAP_POLYGON_LOAD'
export const USER_MAP_POLYGON_LOADED = 'USER_MAP_POLYGON_LOADED'
export const USER_MAP_POLYGON_SAVE = 'USER_MAP_POLYGON_SAVE'
export const USER_MAP_POLYGON_CLEAR = 'USER_MAP_POLYGON_CLEAR'

export function loadPolygon(coordinates, meta) {
  return { type: USER_MAP_POLYGON_LOAD, payload: { coordinates, meta } }
}

export function loadedPolygon() {
  return { type: USER_MAP_POLYGON_LOADED }
}

export function setNewPolygon(coordinates, refresh = false) {
  return async(dispatch, getState) => {
    const { settings: { api } } = getState()
    const polygon = await rmApi.map.polygon.save(turfPolygon([coordinates]).geometry, api)
    dispatch({ type: USER_MAP_POLYGON_SAVE, payload: polygon })
    refresh && dispatch(loadListings())
  }
}

export function clearPolygon(refresh = false) {
  return dispatch => {
    dispatch({ type: USER_MAP_POLYGON_CLEAR })
    refresh && dispatch(loadListings())
  }
}

export function toggleMap(state, refreshListings = true) {
  return (dispatch, getState) => {
    if (typeof state === 'boolean') {
      dispatch({ type: USER_MAP_TOGGLE, payload: state })
    } else {
      const { user: { map: { isEnabled } } } = getState()
      dispatch({ type: USER_MAP_TOGGLE, payload: !isEnabled })
    }
    refreshListings && dispatch(loadListings())
  }
}

export function toggleDrawing(state) {
  if (typeof state === 'boolean') return { type: USER_MAP_DRAWING_TOGGLE, payload: state }
  return (dispatch, getState) => {
    const { user: { map: { isDrawing } } } = getState()
    dispatch({ type: USER_MAP_DRAWING_TOGGLE, payload: !isDrawing })
  }
}

export function mapChanged(center, bounds, zoom) {
  return (dispatch, getState) => {
    if (!center || !bounds || !zoom) return
    dispatch(paginate(0, false))
    dispatch({ type: USER_MAP_CHANGED, payload: { center, bounds, zoom } })
    const { user: { map: isEnabled } } = getState()
    if (isEnabled) {
      dispatch(loadListings())
    }
  }
}


/* START PAN */

export function panMap(panCenter, savePreSearchCenter = true) {
  return (dispatch, getState) => {
    if (savePreSearchCenter) {
      const { user: { map: { center, preSearchCenter } } } = getState()
      if (!preSearchCenter) dispatch(setPresearchCenter(center))
    }
    dispatch({ type: USER_MAP_PAN, payload: panCenter })
  }
}

export function setPresearchCenter(center) {
  return { type: USER_MAP_PRESEARCH_CENTER, payload: center }
}

export function didPan() {
  return { type: USER_MAP_PAN_FINNISH }
}

export function restorePreSearchCenter() {
  return (dispatch, getState) => {
    const { user: { map: { preSearchCenter } } } = getState()
    if (preSearchCenter) {
      dispatch(setPresearchCenter(null))
      dispatch(panMap(preSearchCenter, false))
    }
  }
}

/* END PAN */

/* START ZOOM */

export function zoomMap(newZoom, savePreSearchZoom = true) {
  return (dispatch, getState) => {
    if (savePreSearchZoom) {
      const { user: { map: { zoom, preSearchZoom } } } = getState()
      if (!preSearchZoom) dispatch(setPresearchZoom(zoom))
    }
    dispatch({ type: USER_MAP_ZOOM, payload: newZoom })
  }
}

export function setPresearchZoom(zoom) {
  return { type: USER_MAP_PRESEARCH_ZOOM, payload: zoom }
}

export function didZoom() {
  return { type: USER_MAP_ZOOM_FINNISH }
}

export function restorePreSearchZoom() {
  return (dispatch, getState) => {
    const { user: { map: { preSearchZoom } } } = getState()
    if (preSearchZoom) {
      dispatch(setPresearchZoom(null))
      dispatch(zoomMap(preSearchZoom, false))
    }
  }
}

/* END ZOOM */
