import { changeFilter } from './filters'
import { isNumber, isNaN } from 'lodash'

export const USER_HEADER_TOGGLE_MORE_FILTERS = 'USER_HEADER_TOGGLE_MORE_FILTERS'

export function toggleMoreFilters(payload) {
  if (typeof payload === 'boolean') return { type: USER_HEADER_TOGGLE_MORE_FILTERS, payload }
  return (dispatch, getState) => {
    const { user: { header: { moreFiltersShown } } } = getState()
    dispatch({ type: USER_HEADER_TOGGLE_MORE_FILTERS, payload: !moreFiltersShown })
  }
}

const stringToNumber = str => parseInt(str.replace(/[^\d]/g, ''))

export function manualPriceFilterChange() {
  return (dispatch, getState) => {
    let { form: { headerPrice: { values: { low_price, high_price } = {} } } } = getState()
    if (low_price && high_price) {
      low_price = stringToNumber(low_price)
      high_price = stringToNumber(high_price)
      if (!isNumber(high_price) || isNaN(high_price) || !isNumber(low_price) || isNaN(low_price)) return
      dispatch(changeFilter({ page: 0, price: { high_price, low_price } }))
    }
  }
}
