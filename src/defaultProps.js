let defaultProps = {
  api: {
    base: 'https://widgets.redmantech.com/gus-api/',
    src: 'idx-edm-v5',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmaW5nZXJwcmludCI6IjExMTQyOTh-Y2lqM2U1emFzMDAwYTBpb2N5bnRjczVpeX4yODFmM2UxYTA3N2M4NzgzOWE2ZDY0Y2U1ZWZlZDhkZSIsImFwcCI6ImhvbWVwYWdlIiwic3BhY2UiOiJyd3AtMTA1MCIsInNldHRpbmdzX2lkIjoicndwLTEwNTAiLCJpYXQiOjE0NjkyMTgwNzgsImV4cCI6MTUwMDc1NDA3OH0.BrA3fObRS2-cXWXgw9-Psyn-7mwYxzU6mLpVeO62sc4'
  },
  map: {
    enabled: true,
    toggleable: true,
    center: { lat: 53.5444, lng: -113.4909 },
    zoom: 13,
    clustersEnabled: false,
    clusterRadius: 20,
    hoverDistance: 30,
    minZoom: 4,
    maxZoom: 25
  },
  listings: {},
  urlTemplates: {
    redirectNonUserUrl: '{_SITEURL_}login_form.php?redirect={__WINDOW_PATHNAME__}{__WINDOW_SEARCH__}',
    contact: '{_SITEURL_}contact',
    detail: '{_SITEURL_}go.to.listing/{_ID_}',
    variables: {
      _SITEURL_: 'http://redmantest.com/',
      __WINDOW_PATHNAME__: 'window.location.pathname',
      __WINDOW_SEARCH__: 'window.location.search'
    }
  },
  listingsSettings: {
    sortOptions: ['price_asc', 'price_des', 'list_date_asc', 'list_date_des', 'geo_centre'],
    sortBy: 'list_date_des',
    carouselEnabled: true,
    page: 0,
    size: 20,
    fieldDefinitions: [
      { path: 'price', label: 'price', format: '$%s', registeredOnly: false },
      { path: 'bedrooms', label: 'bedrooms', format: '%d bd', registeredOnly: false },
      { path: 'bathrooms', label: 'bathrooms', format: '%d ba', registeredOnly: false },
      { path: 'address', label: 'address', format: '%s', registeredOnly: false }
    ],
    buttonDefinitions: [{
      label: 'Contact',
      onClick: (event, listingData) => {
        console.log(`Contact clicked on listing: ${JSON.stringify(listingData)}`)
      }
    }]
  },
  filters: {
    price: {
      type: 'dropdown',
      options: [
        [0, Infinity],
        [100000, 200000],
        [200000, 300000],
        [300000, 400000],
        [400000, 500000],
        [500000, 600000],
        [600000, 700000],
        [700000, 800000],
        [800000, 900000],
        [900000, 1000000],
        [1000000, Infinity]
      ],
      format: '$ %s',
      selected: [0, Infinity],
      more: false
    },
    bedrooms: { selectedFormat: '%dp', type: 'dropdown', format: '%d+ Beds', options: [1, 2, 3, 4, 5], selected: 2, more: false },
    bathrooms: { type: 'dropdown', selectedFormat: '%dp', format: '%d+ baths', options: [1, 2, 3, 4, 5], selected: 2, more: false },

    /* MORE FILTERS */

    interior_size: {
      type: 'dropdown',
      title: 'Min sqft',
      selectedFormat: '%sp',
      format: '%s sqft',
      options: [0, 500, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
      selected: 0,
      more: true
    },

    lot_size: {
      type: 'dropdown',
      title: 'Min lot sqft',
      selectedFormat: '%sp',
      format: '%s sqft',
      options: [0, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
      selected: 0,
      more: true
    },

    keywords: {
      title: 'Keywords to include',
      type: 'input-tags',
      selected: null,
      more: true
    },


    built_range: {
      type: 'range',
      title: 'Year Built',
      rangeTypes: ['low_constructed_date', 'high_contructed_date'],
      selected: [null, null],
      placeholders: ['Min Year', 'Max Year'],
      selectedFormat: ['%s', '%s'],
      more: true
    },

    property_types: {
      title: 'Property types',
      type: 'dropdown-checkable',
      remoteOptionsFieldName: 'LM_char5_8',
      selected: null,
      options: [],
      more: true
    },

    keywords_excluded: {
      title: 'Keywords to excluded',
      type: 'input-tags',
      selected: null,
      more: true
    }

  },
  styles: '',
  touchEnabled: false,
  device: 'desktop',
  savedSearchID: null,
  updateURL: false,
  userLoggedIn: false,
  redirectNonUserOnProfileActions: true
}

if(__DEVELOPMENT__) {
  const { merge } = require('lodash')
  defaultProps = merge(defaultProps, {
    filters: require('./helpers/dynamic-filter-functions')
  })
}

export default defaultProps
