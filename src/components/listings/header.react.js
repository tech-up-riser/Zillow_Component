import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { changeSort } from '../../actions/user/filters'
import { toggleMap } from '../../actions/user/map'
import Dropdown from '../dropdown.react'
import { pick } from 'lodash'

function mapStateToProps({
  user: { filters: { page, sort }, map: { isEnabled: mapEnabled } },
  settings: { map: { toggleable: mapTogglable }, listings: { size, sortOptions } },
  content: { listings: { total } }
}) {
  const listingsPos = [(page * size) + 1, ((page + 1) * size > total) ? total : (page + 1) * size]
  return { sort, sortOptions, mapTogglable, mapEnabled, total, listingsPos }
}

@connect(mapStateToProps, { toggleMap, changeSort })
export default class ListingsHeader extends PureComponent {
  static propTypes = {
    total: PropTypes.number.isRequired,
    sort: PropTypes.string.isRequired,
    sortOptions: PropTypes.array.isRequired,
    mapTogglable: PropTypes.bool.isRequired,
    mapEnabled: PropTypes.bool.isRequired,
    listingsPos: PropTypes.array.isRequired,
    toggleMap: PropTypes.func.isRequired
  }

  handleSortChange({ value }) {
    this.props.changeSort(value)
  }

  render() {
    const { listingsPos, total, mapEnabled, mapTogglable, toggleMap, sortOptions, sort } = this.props
    return (
      <header className='header'>
        <div className='search-context'>
          <h1 className='search-location match-header'>
            {listingsPos[0]} - {listingsPos[1]} of {total} listings
          </h1>
        </div>
        <div className='controls'>
          {
            mapTogglable ? (
              <label className='input-type-switch match-header map'>
                <span className='switch-label'>Map</span>
                <input checked={mapEnabled} onChange={toggleMap} type='checkbox' name='map' />
                <div className='switch-toggle' />
              </label>
            ) : null
          }
          <Dropdown {...createDropdownSort(mapEnabled, sortOptions, sort)} onChange={::this.handleSortChange} placeholder='Sort by' />
        </div>
      </header>
    )
  }
}

function createDropdownSort(mapEnabled, sortOptions, sort) {
  if (!mapEnabled) sortOptions = sortOptions.filter(opt => opt !== 'geo_centre')

  return {
    options: sortOptions.map(value => ({ label: valueToLabel(value), value })),
    value: { label: valueToLabel(sort), value: sort }
  }
}

function valueToLabel(val) {
  return val.replace(/_/g, ' ')
    .replace('asc', 'ascending').replace('des', 'decending')
    .replace('list', 'listing')
}
