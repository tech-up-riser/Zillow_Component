import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleDrawing } from '../../actions/user/map'

@connect(({ user: { map: { isDrawing } } }) => ({ isDrawing }), { toggleDrawing })
export default class DrawingManager extends PureComponent {
  static propTypes = {
    isDrawing: PropTypes.bool.isRequired,
    toggleDrawing: PropTypes.func.isRequired
  }

  render() {
    const { toggleDrawing, isDrawing } = this.props
    return (
      <div className='drawingmanager-ui'>
        <i onClick={toggleDrawing} className={isDrawing ? 'ion-android-close draw-remove' : 'ion-edit draw'} />
      </div>
    )
  }
}
