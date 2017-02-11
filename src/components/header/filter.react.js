import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropdown from '../../components/dropdown.react'
import { filterRenderData } from '../../helpers/filters'
import { changeFilter } from '../../actions/user/filters'
import { manualPriceFilterChange } from '../../actions/user/header'
import Range from './range.react'
import MultiSelect from './mutliSelect.react'
import TaggedInput from './taggedInput.react'
import { formatPrice } from './helpers'

function mapStateToProps({ settings: { filters }, user: { filters: selectedFilters } }, { filter }) {
  return filterRenderData({ selectedFilters, selected: selectedFilters[filter], ...filters[filter] }, filter)
}

@connect(mapStateToProps, { changeFilter, manualPriceFilterChange })
export default class Filter extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    type: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    changeFilter: PropTypes.func.isRequired,
    manualPriceFilterChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    placeholder: 'Select an option'
  }

  handleOnChange({ value }) {
    const { changeFilter, filter } = this.props

    if (filter === 'price') {
      const [low_price, high_price] = value.split(' - ')
      value = { low_price, high_price }
    }

    changeFilter({ page: 0, [filter]: value })
  }

  renderFilter() {
    const { type, filter, title, manualPriceFilterChange, ...props } = this.props

    switch (type) {
      case 'input-tags':
        return <TaggedInput title={title} filter={filter} />
      case 'dropdown-checkable':
        return <MultiSelect title={title} filter={filter} />
      case 'dropdown':
        if (filter === 'price')
          return (
            <Dropdown title={title} {...props} onChange={::this.handleOnChange} priceInput={true}>
              <Range
                normalize={formatPrice}
                onChange={manualPriceFilterChange}
                placeholders={['Min price', 'Max Price']}
                filters={['low_price', 'high_price']}
                formID='headerPrice'
                destroyOnUnmount={false}
              />
            </Dropdown>
          )
        return <Dropdown title={title} {...props} onChange={::this.handleOnChange} />
      case 'range':
        const { rangeTypes, placeholders, changeFilter } = this.props
        return (
          <Range
            title={title}
            placeholders={placeholders}
            filters={rangeTypes}
            formID={filter}
            destroyOnUnmount={false}
          />
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div ref='filter' className='section'>
        {::this.renderFilter()}
      </div>
    )
  }
}
