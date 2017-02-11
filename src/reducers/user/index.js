import { combineReducers } from 'redux'
import favourites from './favourites'
import map from './map'
import filters from './filters'
import savedSearches from './savedSearches'
import saveSearch from './saveSearch'
import header from './header'
import search from './search'

export default combineReducers({
  savedSearches,
  saveSearch,
  favourites,
  filters,
  map,
  header,
  search
})
