import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { forEach, chunk } from 'lodash'
import Filter from './filter.react'
import classnames from 'classnames'

function mapStateToProps({ settings: { filters }, user: { header: { moreFiltersShown } } }) {
  let moreFilters = []
  forEach(filters, ({ more }, filter) => {
    if (more) moreFilters.push(filter)
  })
  return { filters: moreFilters.length >= 3 ? chunk(moreFilters, 3) : [moreFilters], open: moreFiltersShown }
}

@connect(mapStateToProps)
export default class MoreFilters extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    filters: PropTypes.array
  }

  render() {
    const { open, filters } = this.props
    return (
      <div className={classnames('dropout', { open })}>
        {filters.map((section, idx) => {
          const [first, second, third] = section
          return (
            <div key={idx+1} className='more-section'>
              <div className='more-secondarys'>
                {first && <div><Filter filter={first} /></div>}
                {second && <div><Filter filter={second} /></div>}
              </div>
              <div className='more-primary'>
                {third && <Filter filter={third} />}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
