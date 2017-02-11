import React, { PureComponent, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { forEach } from 'lodash'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Filter, Search, SavedSearches, MoreFilters } from '../components/header'
import { toggleMoreFilters } from '../actions/user/header'

function mapStateToProps({ settings: { filters }, user: { header: { moreFiltersShown } } }) {
  const nonMoreFilters = []
  forEach(filters, ({ more }, filter) => !more && nonMoreFilters.push(filter))
  return { filters: nonMoreFilters, moreFiltersShown }
}

@connect(mapStateToProps, { toggleMoreFilters })
export default class Header extends PureComponent {
  static propTypes = {
    filters: PropTypes.array.isRequired,
    toggleMoreFilters: PropTypes.func.isRequired
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, { passive: true })
    document.addEventListener('touchend', this.handleDocumentClick, { passive: true })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('touchend', this.handleDocumentClick)
  }

  handleDocumentClick = ({ target }) => {
    const { moreFiltersShown, toggleMoreFilters } = this.props
    if (moreFiltersShown && !findDOMNode(this).contains(target)) {
      toggleMoreFilters(false)
    }
  }

  render() {
    const { filters, moreFilters, moreFiltersShown, toggleMoreFilters } = this.props
    return (
      <div className='ss-filters-container'>
        <div className='ss-filters'>
          <Search />
          <div className='section'>
            <span onClick={toggleMoreFilters} className='trigger-dropout'>More</span>
          </div>
          {filters.map(filter => <Filter key={filter} filter={filter} />)}
          <div className='section flex'>
            <SavedSearches />
          </div>
        </div>
        <MoreFilters />
      </div>
    )
  }
}
