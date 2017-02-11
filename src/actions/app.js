import { forEach } from 'lodash'
import { loadListings, hasLoaded as listingsHasLoaded } from './content/listings'
import { loadFilterOptions } from './user/filters'
import { loadSavedSearches } from './user/savedSearches'
import { fetchFavourites } from './user/favourites'


export function appLoad({ dynamicFilters }) {
  return (dispatch, getState) => {
    const {
      user: { map: { isEnabled: mapIsEnabled } },
      settings: { loggedIn },
      ...state
    } = getState()

    if (!listingsHasLoaded(state) && !mapIsEnabled) dispatch(loadListings())
    if(loggedIn) {
      dispatch(loadSavedSearches())
      dispatch(fetchFavourites())
    }
    if (Object.keys(dynamicFilters).length) {
      const { settings: { api } } = getState()
      forEach(dynamicFilters, ({ remoteOptionsFieldName, apiFormatter }, filter) =>
        dispatch(loadFilterOptions(filter, { formatter: apiFormatter, remoteOptionsFieldName }, api))
      )
    }
  }
}
