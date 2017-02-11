import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { Motion, spring } from 'react-motion'
import numeral from 'numeral'
import { Listing } from '../../containers'

const markerAnimations = {
  initialScale: 0.3,
  defaultScale: 0.8,
  hoveredScale: 0.9,
  hovered: false,
  stiffness: 320,
  damping: 7,
  precision: 0.001
}

function mapStateToProps({ content: { listings: { listings, activeListing } }, }, { id }) {
  const { price } = listings[id]
  const hovered = activeListing === id
  return { hovered, price }
}

@connect(mapStateToProps)
export default class Marker extends PureComponent {
  static propTypes = {
    price: PropTypes.number.isRequired,
    hovered: PropTypes.bool,
    id: PropTypes.string.isRequired
  }

  static defaultProps = {
    hovered: false
  }

  state = {
    style: this.getMotionStyle(false),
    defaultStyle: { scale: markerAnimations.initialScale },
    popoverOpen: false
  }

  get shortPrice() {
    const { price } = this.props
    return numeral(price).format('$0.0a')
  }

  componentDidMount() {
    this.mounted = true
    document.addEventListener('click', this.handleDocumentClick, { passive: true })
    document.addEventListener('touchend', this.handleDocumentClick, { passive: true })
  }

  componentWillUnmount() {
    this.mounted = false
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('touchend', this.handleDocumentClick)
  }

  handleDocumentClick = ({ target }) => {
    if (this.mounted && !findDOMNode(this).contains(target) && this.state.popoverOpen) {
      this.setState({ popoverOpen: false, style: this.getMotionStyle(false) })
    }
  }

  getMotionStyle(hovered) {
    const { hoveredScale, defaultScale, stiffness, damping, precision } = markerAnimations
    return {
      scale: spring(hovered ? hoveredScale : defaultScale, { stiffness, damping, precision })
    }
  }

  componentDidUpdate({ hovered }) {
    if (hovered !== this.props.hovered) {
      this.setState({
        style: this.getMotionStyle(this.state.popoverOpen || this.props.hovered)
      })
    }
  }

  togglePopover = () => this.setState({ popoverOpen: !this.state.popoverOpen })

  render() {
    const { state: { popoverOpen, ...state }, props: { id }, shortPrice, togglePopover } = this
    return (
      <Motion {...state}>
        {
          ({scale}) => (
            <div>
              <div onClick={togglePopover} className='marker' style={{transform: `translate3D(0,0,0) scale(${scale}, ${scale})`}}>
                <span className='short-price'>{shortPrice}</span>
              </div>
              {popoverOpen ? (
                <div className='popover'>
                  <Listing id={id} />
                </div>
              ) : null}
            </div>
          )
        }
      </Motion>
    )
  }
}
