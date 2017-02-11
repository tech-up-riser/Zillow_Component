import React, { PureComponent, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import Listing from './Listing'
import { Footer, Header } from '../components/listings'

function mapStateToProps({
  content: { listings: { listings, focused, total } },
  settings: { listings: { size } },
  user: { filters: { page }, map: { isEnabled: mapIsEnabled } }
}) {
  return { listings: Object.keys(listings), focused, total, page, pages: Math.floor(total / size), mapIsEnabled }
}

@connect(mapStateToProps)
export default class Listings extends PureComponent {
  static propTypes = {
    listings: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    mapIsEnabled: PropTypes.bool.isRequired,
    focused: PropTypes.any
  }

  renderListings() {
    const { listings, focused } = this.props
    if (focused) return <Listing key={focused.id} id={focused.id} focused={true} />
    return listings.map(id => <Listing key={id} id={id} />)
  }

  render() {
    const { mapIsEnabled, listings, focused } = this.props
    return (
      <div className={classnames('listings-container', {'withoutMap': !mapIsEnabled})}>
        <Header />
        <div className='scroller'>
          {::this.renderListings()}
          <Footer />
        </div>
      </div>
    )
  }
}
