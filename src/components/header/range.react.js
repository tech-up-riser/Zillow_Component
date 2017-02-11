import React, { PureComponent, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { changeFilter } from '../../actions/user/filters'
import { connect } from 'react-redux'
import { debounce, get } from 'lodash'
import { manualPriceFilterChange } from '../../actions/user/header'

function mapStateToProps({ form, user: { filters } }, { formID, destroyOnUnmount = true, normalize }) {
  let initialValues = null

  if(formID === 'headerPrice') {
    let { low_price, high_price } = filters
    if(high_price === null) high_price = 'Infinity'
    else high_price = normalize(high_price.toString())
    initialValues = { low_price: normalize(low_price.toString()), high_price }
  }

  return {
    form: formID,
    destroyOnUnmount,
    initialValues,
    formValues: get(form, `${formID}.values`, {})
  }
}

@connect(mapStateToProps, { changeFilter })
@reduxForm({ destroyOnUnmount: false, enableReinitialize: true })
export default class Range extends PureComponent {
  static propTypes = {
    changeFilter: PropTypes.func.isRequired,
    title: PropTypes.string,
    normalize: PropTypes.func,
    onChange: PropTypes.func,
    placeholders: PropTypes.array,
    filters: PropTypes.array,
    formValues: PropTypes.object
  }

  static defaultProps = {
    placeholders: [],
    normalize: null
  }

  _filterOnChange(field, event) {
    const { onChange, changeFilter, formValues } = this.props
    if (onChange) return onChange()
    changeFilter({
      page: 0,
      [field]: formValues[field] && formValues[field].length ? formValues[field] : null
    })
  }

  render() {
    const { manualPriceFilterChange, placeholders, normalize, filters, title } = this.props
    return (
      <div className='priceInput'>
        {title && <p className='title'>{title}</p>}
        <Field
          name={filters[0]}
          placeholder={placeholders[0]}
          component={renderField}
          normalize={normalize}
          className='low-price'
          onChangeAction={debounce(::this._filterOnChange, 300)}/>
        <span>to</span>
        <Field
          name={filters[1]}
          placeholder={placeholders[1]}
          className='high-price'
          component={renderField}
          normalize={normalize}
          onChangeAction={debounce(::this._filterOnChange, 300)}/>
      </div>
    )
  }
}

function onChangeField(event, field) {
  field.input.onChange(event)
  field.onChangeAction(field.name, event)
}

const renderField = shit => {
  const { className, placeholder, ...field } = shit
  return <input {...field.input} type='text' placeholder={placeholder} onChange={event =>  onChangeField(event, field)} className={className} />
}
