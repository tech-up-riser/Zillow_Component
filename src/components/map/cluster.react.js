import React, { PureComponent, PropTypes } from 'react'
import { Motion, spring } from 'react-motion'

export default class Cluster extends PureComponent {

  static propTypes = {
    initialScale: PropTypes.number,
    defaultScale: PropTypes.number,
    hoveredScale: PropTypes.number,
    stiffness: PropTypes.number,
    damping: PropTypes.number,
    precision: PropTypes.number,
    hovered: PropTypes.bool,
    text: PropTypes.number
  }

  static defaultProps = {
    initialScale: 0.6,
    defaultScale: 1,
    hoveredScale: 1.15,
    hovered: false,
    stiffness: 320,
    damping: 7,
    precision: 0.001,
    text: 0
  }

  state = {
    style: this.motionStyle,
    defaultStyle: { scale: this.props.initialScale }
  }

  get motionStyle() {
    const { hoveredScale, defaultScale, stiffness, damping, precision } = this.props
    return {
      scale: spring(this.props.hovered ? hoveredScale : defaultScale, { stiffness, damping, precision })
    }
  }

  componentDidUpdate({ hovered }) {
    if (hovered !== this.props.hovered) {
      this.setState({ style: this.motionStyle }) // eslint-disable-line react/no-did-update-set-state
    }
  }

  render() {
    return (
      <Motion {...this.state}>
        {
          ({ scale }) => (
            <div className='cluster' style={{transform: `translate3D(0,0,0) scale(${scale}, ${scale})`}}>
              <div className='text'>
                {this.props.text}
              </div>
            </div>
          )
        }
      </Motion>
    )
  }
}
