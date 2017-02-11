import Listing from 'redman-listing'
import { toggleFavorite } from '../actions/user/favourites'
import { connect } from 'react-redux'
import { changeActiveListing } from '../actions/content/listings'
import { createListingURL } from '../helpers/listing'

function sanitizeListing({ _id: id, images, ...data }) {
  return { id, images, data }
}

function mapStateToProps({
  content: { listings: { listings, focused }, ribbons: { ribbons } },
  user: { favourites: { favs }, loggedIn },
  settings: { listings: { fieldDefinitions, buttonDefinitions, carouselEnabled }, urlTemplates }
}, { id, focused: isFocused }) {
  const sanitizedData = sanitizeListing(isFocused ? focused : listings[id])
  return {
    loggedIn,
    listingsURL: createListingURL(sanitizedData, urlTemplates),
    ribbons: ribbons[id] || [],
    isFavourite: favs.includes(id),
    fieldDefinitions,
    buttonDefinitions,
    carouselEnabled,
    internalStyles: false,
    ...sanitizedData
  }
}

export default connect(mapStateToProps, { toggleFavorite, changeActiveListing })(Listing)
