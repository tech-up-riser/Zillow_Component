import { forEach, findIndex } from 'lodash'
import { loadFilterOptions } from '../actions/user/filters'
import util from 'util'

function rangeToString(range, separator = ' - ') {
  return range.join(separator)
}

/**
 * Creates <Dropdown /> compatable props from provided filter; @see {@link SavedSearch} and {@link Dropdown}
 * @property {object} filterParms               "filters" prop of savedSearch, @see {@link SavedSearch} for further information
 * @property {object} setFilters                already set filters
 * @return {object} filters
 */

export function filterRenderData({ options: filterOptions, format, type, selected, selectedFilters, selectedFormat, title, ...filterData }, filter) {
  switch (type) {
    case 'input-tags':
    case 'dropdown-checkable':
      return { type, title }
    case 'range':
      const { rangeTypes, placeholders } = filterData
      let value = []
      rangeTypes.forEach((range, index) =>
        value[index] = selectedFilters[index] && util.format(selectedFormat[index], selectedFilters[index])
      )
      return { type, rangeTypes, placeholders, value, title }
    default:
      if (filter === 'price') {
        const options = filterOptions.map(range =>
          ({ label: util.format(format, rangeToString(range)), value: range.join(' - ') })
        )
        let setPrice = null
        let { low_price: setLow, high_price: setHigh = 'Infinity' } = selected || selectedFilters
        if(setHigh === null) setHigh = 'Infinity'
        if (setLow != null && setHigh != null) setPrice = [setLow, setHigh].join(' - ')
        let _index = findIndex(options, ['value', setPrice || selected.join(' - ')])
        let valueObj = null

        if (_index == -1) {
          let str = setPrice || selected.join(' - ')
          valueObj = { label: '$ ' + str, value: str }
        } else {
          // it has value
          valueObj = options[_index]
        }

        return { options, value: valueObj, type, title }
      }

      const options = filterOptions.map(option =>
        ({ label: util.format(format, option), value: util.format(selectedFormat, option) })
      )
      return {
        options,
        value: options[findIndex(options, ['value', selected || util.format(selectedFormat, selected)])],
        type,
        title
      }
  }
}


/**
 * Extracts initially set filters from filters prop of savedSearch class, @see {@link SavedSearch} for further information
 * @property {object} filterParms               "filters" prop of savedSearch, @see {@link SavedSearch} for further information
 * @return {object} filters
 */
export function initiallySetFilters(filterParms, dispatch) {
  const filters = {}
  forEach(filterParms, ({ options, selected, selectedFormat, type, ...rest }, filter) => {
    switch (type) {
      case 'input-tags':
        filters[filter] = selected
        break
      case 'dropdown-checkable':
        filters[filter] = options
        break
      case 'range':
        const { rangeTypes } = rest
        rangeTypes.forEach((range, index) =>
          filters[range] = selected[index] && util.format(selectedFormat[index], selected[index])
        )
        break
      default:
        if (filter === 'price') {
          const [low_price, high_price] = selected // eslint-disable-line camelcase
          filters[filter] = { low_price, high_price }
        } else {
          if(selected === null) {
            filters[filter] = null
          } else {
            filters[filter] = util.format(selectedFormat, selected)
          }
        }
    }
  })
  return filters
}

/**
 * formats price
 * @property {string} value       price
 * @return {object} formatted price
 */
export function formatPriceChange(value) {
  let formattedValue

  const [low_price, high_price] = value.split('-').map(val => parseInt(val)) // eslint-disable-line camelcase
  if (isNaN(low_price) || isNaN(high_price)) {
    if (isNaN(low_price) && isNaN(high_price)) formattedValue = {}
    else {
      formattedValue = {
        [!isNaN(parseFloat(low_price)) && isFinite(low_price) ? 'low_price' : 'high_price']: low_price || high_price, // eslint-disable-line camelcase
        [isNaN(parseFloat(low_price)) && !isFinite(low_price) ? 'low_price' : 'high_price']: null
      }
    }
  } else {
    formattedValue = { low_price, high_price } // eslint-disable-line camelcase
  }

  return formattedValue
}
