import { isArray, without, get } from 'lodash'
import rmGusAPI from 'rm-gus-api'

export const RIBBONS_LOAD = 'RIBBONS_LOAD'
export const RIBBONS_LOAD_SUCCESS = 'RIBBONS_LOAD_SUCCESS'
export const RIBBONS_LOAD_FAIL = 'RIBBONS_LOAD_FAIL'

export function loadRibbons(listingsDict) {
  return {
    types: [RIBBONS_LOAD, RIBBONS_LOAD_SUCCESS, RIBBONS_LOAD_FAIL],
    promise: (dispatch, getState) => new Promise(async(resolve, reject) => {
      const state = getState()
      let listings = Object.keys(listingsDict || get(state, 'listings.listings'))
      const { content: { ribbons: { checked } }, settings: { api } } = state
      listings = without(listings, checked)

      if (listings.length) {
        try {
          const ribbons = await rmGusAPI.content.ribbons.fetch(listings, api)
          resolve({ checked: listings, ribbons })
        } catch (e) {
          resolve({})
        }
        return
      }

      resolve({ checked: listings })
    })
  }
}
