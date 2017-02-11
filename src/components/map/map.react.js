import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { changeActiveListing } from '../../actions/content/listings'
import { mapChanged, didPan, setNewPolygon, clearPolygon, didZoom, loadedPolygon } from '../../actions/user/map'
import GoogleMap from 'google-map-react'
import { isEqual, pick, debounce } from 'lodash'

function mapStateToProps({ settings: { map: mapSettings, touchEnabled }, user: { map } }) {
  return {
    ...pick(mapSettings, ['center', 'zoom', 'minZoom', 'maxZoom', 'hoverDistance']),
    ...pick(map, ['isDrawing', 'panTo', 'zoomTo', 'polygonLoad']),
    touchEnabled
  }
}

@connect(mapStateToProps,
  ({ changeActiveListing, mapChanged, didPan, setNewPolygon, clearPolygon, didZoom, loadedPolygon })
)
export default class Map extends Component {
  static propTypes = {
    center: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    hoverDistance: PropTypes.number.isRequired,
    changeActiveListing: PropTypes.func.isRequired,
    mapChanged: PropTypes.func.isRequired,
    touchEnabled: PropTypes.bool,
    isDrawing: PropTypes.bool.isRequired,
    panTo: PropTypes.object,
    zoomTo: PropTypes.number,
    setNewPolygon: PropTypes.func.isRequired,
    clearPolygon: PropTypes.func.isRequired,
    polygonLoad: PropTypes.array,
    didZoom: PropTypes.func.isRequired,
    didPan: PropTypes.func.isRequired,
    loadedPolygon: PropTypes.func.isRequired
  }

  componentWillMount() {
    if (this.props.touchEnabled) {
      navigator.msMaxTouchPoints = 2
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.checkShouldDrawPolygon(prevProps)) {
      this.checkDrawing(prevProps)
    }
    this.checkShouldPan(prevProps)
    this.checkShouldZoom(prevProps)
  }

  checkShouldDrawPolygon({ polygonLoad }) {
    const { polygonLoad: currentPolygonLoad } = this.props
    if (currentPolygonLoad && currentPolygonLoad !== polygonLoad) {
      if (this.loadedPolygon) this.loadedPolygon.setMap(null)
      this.loadedPolygon = new this.google.maps.Polygon({
        paths: currentPolygonLoad,
        fillColor: 'rgba(77, 77, 77, 0.57)',
        fillOpacity: 1,
        strokeWeight: 3,
        clickable: false,
        editable: false,
        zIndex: 1
      })
      this.loadedPolygon.setMap(this.google.map)
      this.props.loadedPolygon()
      return true
    }
    return false
  }

  checkShouldZoom({ zoomTo }) {
    const { zoomTo: currentZoomTo } = this.props
    if (currentZoomTo && zoomTo !== currentZoomTo) {
      this.google.map.setZoom(currentZoomTo)
    }
  }

  checkShouldPan({ panTo }) {
    const { panTo: currentPanTo } = this.props
    if (currentPanTo && panTo !== currentPanTo) {
      this.google.map.panTo(currentPanTo)
    }
  }

  checkDrawing({ isDrawing }) {
    if (!isDrawing && this.props.isDrawing) {
      if (this.loadedPolygon) {
        this.loadedPolygon.setMap(null)
        this.loadedPolygon = null
        this.props.clearPolygon(true)
      }
      this.drawingManager.setDrawingMode(this.google.maps.drawing.OverlayType.POLYGON)
    } else if (isDrawing && !this.props.isDrawing) {
      this.drawingManager.setDrawingMode(null)
      if (this.drawingManager._currentShape) {
        this.drawingManager._currentShape.overlay.setMap(null)
      }
      if (this.loadedPolygon || this.drawingManager._currentShape) {
        this.loadedPolygon = this.drawingManager._currentShape = null
        this.props.clearPolygon(true)
      }
    }
  }

  handleMapChange({ center, bounds, zoom }) {
    let { panTo, zoomTo, mapChanged, didPan, didZoom } = this.props
    if(center && panTo){
      const distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(center), new google.maps.LatLng(panTo))
      if (distanceBetween < 10) {
        didPan()
        panTo = false
      }
    }
    if (zoomTo === zoom) {
      didZoom()
      zoomTo = false
    }
    if (panTo || zoomTo) return
    mapChanged(center, bounds, zoom)
  }

  handleMapHover(hoveredMarkerId) {
    this.props.changeActiveListing(hoveredMarkerId)
  }

  addCustomMapEvents() {
    this.google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (shape) => {
      this.drawingManager._currentShape = shape
      this.drawingManager.setDrawingMode(null)
    })

    this.google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon) => {

      let points = []
      for (let i = 0; i < polygon.getPath().getLength(); i++) {
        points.push(polygon.getPath().getAt(i).toUrlValue())
      }

      let [firstPoint, ...otherPoints] = points
      points = [firstPoint, ...otherPoints, firstPoint].map(cord => cord.split(',').reverse().map(Number))
      this.props.setNewPolygon(points, true)
    })
  }

  handleMapLoaded(google) {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      circleOptions: {
        fillColor: 'rgba(77, 77, 77, 0.57)',
        fillOpacity: 1,
        strokeWeight: 3,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    })

    this.drawingManager.setMap(google.map)
    this.drawingManager._currentShape = null
    this.google = google

    this.addCustomMapEvents()
  }

  render() {
    const { minZoom, maxZoom, hoverDistance, center: defaultCenter, zoom: defaultZoom, clearActiveListing, children } = this.props

    return (
      <GoogleMap
        bootstrapURLKeys={{language: 'en', libraries: ['drawing', 'geometry'], key: 'AIzaSyCCc8awNd7v-9a99Xl4jG8_Y9UtdMDXbG8'}}
        onChange={::this.handleMapChange}
        yesIWantToUseGoogleMapApiInternals
        options={{minZoom, maxZoom}}
        onGoogleApiLoaded={::this.handleMapLoaded}
        {...{hoverDistance, defaultZoom, defaultCenter}}
        onChildMouseEnter={::this.handleMapHover}
        onChildMouseLeave={clearActiveListing}
      >
        {children}
      </GoogleMap>
    )
  }
}
