import React, { PureComponent, PropTypes } from 'react'
import { MultiSelect } from 'react-selectize'
import { forEach } from 'lodash'
import { connect } from 'react-redux'
import { changeFilter } from '../../actions/user/filters'

function mapStateToProps({ settings: { filters }, user }, { filter }) {
  const { options, parser, formatter } = filters[filter]
  let values = []
  if (user.filters[filter] !== null) {
    values = parser(user.filters[filter])
  }
  return { options, formatter, values }
}

@connect(mapStateToProps, { changeFilter })
export default class MultiSelectFilter extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    values: PropTypes.array,
    title: PropTypes.string,
    changeFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    options: [],
    values: []
  }

  state = {
    values: this.props.values
  }

  onValuesChange(values) {
    let tags = []
    forEach(values, ({value}) => tags.push(value))
    const { formatter, changeFilter, filter } = this.props
    if(!tags || !tags.length) tags = null
    else if (formatter) tags = formatter(tags)
    changeFilter({ page: 0, [filter]: tags })
    this.setState({values})
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
    const { options, title } = this.props
    return (
      <div>
        {title && <p>{title}</p>}
        <MultiSelect onValuesChange={::this.onValuesChange} values={this.state.values} options={options} />
      </div>
    )
  }
}
