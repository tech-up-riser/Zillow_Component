import { forEach, omit, get, set, find, omitBy } from 'lodash'
import { initiallySetFilters } from './filters'
import { DEFAULT_STATE as DEFAULT_USER_MAP_STATE } from '../reducers/user/map'
import { DEFAULT_STATE as DEFAULT_CONTENT_LISTINGS_STATE } from '../reducers/content/listings'
import { sanitizeHits } from '../actions/content/listings'
import dynamicFilterFunctions from './dynamic-filter-functions'

function sanitizeFilters(filters) {
  const sanitizedFilters = {}
  forEach(filters, (filter, name) => {
    var _filter = omit(filter, 'selected')
    if (dynamicFilterFunctions[name]) {
      forEach(dynamicFilterFunctions[name], (func, funcName) => _filter[funcName] = func )
    }
    sanitizedFilters[name] = _filter
  })
  return sanitizedFilters
}

export function extractdynamicFilters({ filters }) {
  return omitBy(filters, ({ remoteOptionsFieldName }) => !remoteOptionsFieldName)
}

export function extractInitialStateFromProps(props, dispatch) {
  const {
    listings,
    map: { enabled: mapEnabled, ...map },
    listingsSettings: { page, sortBy: sort, ...listingsSettings, },
    urlTemplates,
    api,
    touchEnabled,
    filters,
    userLoggedIn,
    redirectNonUserOnProfileActions
  } = props

  const initialState = {
    settings: {
      map,
      listings: listingsSettings,
      urlTemplates,
      api,
      touchEnabled,
      filters: sanitizeFilters(filters),
      loggedIn: userLoggedIn,
      redirectNonUserOnProfileActions
    },
    user: {
      map: {...DEFAULT_USER_MAP_STATE, isEnabled: mapEnabled },
      filters: { page, sort, ...initiallySetFilters(filters, dispatch) }
    }
  }

  if (get(listings, 'hits') && get(listings, 'total')) {
    const { hits, total } = listings
    set(initialState, 'content.listings', {
      ...DEFAULT_CONTENT_LISTINGS_STATE,
      listings: sanitizeHits(hits),
      total,
      hasLoaded: true
    })
  }
  return initialState
}
