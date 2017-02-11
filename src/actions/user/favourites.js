import { user as gusUserApi } from 'rm-gus-api'

export const USER_FAVOURITES_TOGGLE = 'USER_FAVOURITES_TOGGLE'
export const USER_FAVOURITES_LOAD = 'USER_FAVOURITES_LOAD'
export const USER_FAVOURITES_LOAD_SUCCESS = 'USER_FAVOURITES_LOAD_SUCCESS'
export const USER_FAVOURITES_LOAD_FAIL = 'USER_FAVOURITES_LOAD_FAIL'

export function fetchFavourites() {
  return {
    types: [USER_FAVOURITES_LOAD, USER_FAVOURITES_LOAD_SUCCESS, USER_FAVOURITES_LOAD_FAIL],
    promise: (dispatch, getState) => new Promise(async(resolve, reject) => {
      const { settings: { api } } = getState()
      try {
        const favs = await gusUserApi.favourites.fetch(api)
        resolve(favs)
      } catch (e) {
        console.error(e)
        reject({})
      }
    })
  }
}

export function toggleFavorite(id) {
  return (dispatch, getState) => {
    const { user: { favourites: { favs } }, api } = getState()
    dispatch({ type: USER_FAVOURITES_TOGGLE, payload: { id, state: !favs.includes(id) } })
    gusUserApi.favourites.toggle(id, api)
  }
}
