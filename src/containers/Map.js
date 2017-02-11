import React, { Component, PropTypes } from 'react'
import { compact } from 'lodash'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Map, { Marker, DrawingManager } from '../components/map'

function mapStateToProps({ user: { map: { isEnabled } }, content: { listings: { listings, focused } } }) {
  return {
    isEnabled,
    listings: focused ? {
      [focused.id]: focused
    } : listings
  }
}

const extractMarkerPos = listings => compact(Object.keys(listings).map(id => {
  const { location: { lat, lon: lng } = {} } = listings[id]
  return lng && lat && { id, lng, lat }
}))

@connect(mapStateToProps)
export default class MapContainer extends Component {
  static propTypes = {
    listings: PropTypes.object,
    isEnabled: PropTypes.bool.isRequired,
    store: PropTypes.any
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    const { isEnabled, listings } = this.props
    const { store } = this.context
    return (
      <div className={classnames('map-container', {hidden: !isEnabled})} >
        <DrawingManager />
        <Map>
          {extractMarkerPos(listings).map(
            marker => <Marker store={store} key={marker.id} {...marker} />
          )}
        </Map>
      </div>
    )
  }
}
