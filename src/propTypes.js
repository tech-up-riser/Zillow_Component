import { PropTypes } from 'react'

/**
 * propTypes
 * @property {object} api                                       Api parms object (Required)
 * @property {string} api.base                                  base used for api calls i.e. "http://widgets.redmantech.com/gus-api/" (Required)
 * @property {string} api.src                                   the datasource to query i.e. "idx-edm-v5" (Required)
 * @property {string} [api.token='']                            Token used for api calls
 * @property {object} [filters={}]                              Available filters for render, see defaultProps for exsample
 * @property {object} map                                       Map display parms
 * @property {number} map.zoom                                  Map zoom level (Required)
 * @property {boolean} [map.clustersEnabled=false]              enable toggle for map clusters
 * @property {number} map.clusterRadius                         Radius in pixels for when two or more makers should become a cluster
 * @property {number} map.hoverDistance                         Radius in pixels for a marker or cluster to be marked as 'hovered' (Required)
 * @property {number} map.minZoom                               farthest out map can zoom (Required)
 * @property {number} map.maxZoom                               closest in map can zoom (Required)
 * @property {object} map.center                                The initial Map center (Required)
 * @property {number} map.center.lat                            Initial map latitude (Required)
 * @property {number} map.center.lng                            Initial map longitude (Required)
 * @property {boolean} [map.enabled=true]                       Map enabled enabled
 * @property {boolean} [map.toggleable=true]                    Map is toggleable
 * @property {object} listingsSettings                          Parms for listings rendering
 * @property {array} listingsSettings.fieldDefinitions          Fields to be rendered on listings, see defaultProps for exsamples (Required)
 * @property {array} listingsSettings.buttonDefinitions         Buttons to be rendered on listings, see defaultProps for exsamples (Required)
 * @property {string} [listingsSettings.sortBy=list_date_asc]   Initial listing sorting method
 * @property {array} listingsSettings.sortOptions               Array of available methods for sorting (Required)
 * @property {number} [listingsSettings.page=0]                 Initial listings page number
 * @property {number} [listingsSettings.size=20]                How many listings to request per page
 * @property {object} listings                                  Inital listings to be rendered, forces component to *not* re-load on mount
 * @property {string} styles                                    Optional styling overrides, see styles directory
 * @property {boolean} [touchEnabled=true]                      Forcibly disable touch support
 * @property {object} urlTemplates                              URL templates for use throughout the component
 * @property {string} urlTemplates.detail                       URL Template used for listing onClick (Required)
 * @property {object} urlTemplates.variables                    Re-usable variables for use within urlTemplates i.e. __SITE_URL__ (Required)
 * @property {string} [device=desktop]                          Device being rendered on, valid options: desktop|mobile|tablet
 */

export default {
  ssr: PropTypes.shape({
    listings: PropTypes.object
  }),
  api: PropTypes.shape({
    base: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    token: PropTypes.string
  }),
  filters: PropTypes.object,
  mapSettings: PropTypes.shape({
    zoom: PropTypes.number.Required,
    clusterRadius: PropTypes.number,
    hoverDistance: PropTypes.number.Required,
    clustersEnabled: PropTypes.bool,
    minZoom: PropTypes.number.Required,
    maxZoom: PropTypes.number.Required,
    center: PropTypes.shape({ lat: PropTypes.number.Required, lng: PropTypes.number.Required }),
    enabled: PropTypes.bool,
    toggleable: PropTypes.bool
  }),
  listingsSettings: PropTypes.shape({
    fieldDefinitions: PropTypes.array.isRequired,
    buttonDefinitions: PropTypes.array.isRequired,
    sortBy: PropTypes.string,
    sortOptions: PropTypes.array.isRequired,
    page: PropTypes.number,
    size: PropTypes.number
  }),
  listings: PropTypes.object,
  styles: PropTypes.string,
  touchEnabled: PropTypes.bool,
  urlTemplates: PropTypes.shape({ detail: PropTypes.string.isRequired, variables: PropTypes.object.isRequired }),
  device: PropTypes.string,
  updateURL: PropTypes.bool,
  userLoggedIn: PropTypes.bool,
  redirectNonUserOnProfileActions: PropTypes.bool
}
