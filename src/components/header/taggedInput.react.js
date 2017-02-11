import React, { PureComponent, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { MultiSelect } from 'react-selectize'
import { connect } from 'react-redux'
import { forEach, get, omit, defer } from 'lodash'
import { changeFilter } from '../../actions/user/filters'

function mapStateToProps({ settings: { filters }, user }, { filter }) {
  const { formatter, parser } = filters[filter]
  let values = []
  if (user.filters[filter] !== null) {
    values = parser(user.filters[filter])
  }
  return { formatter, parser, values }
}

@connect(mapStateToProps, { changeFilter })
export default class TaggedInput extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    formatter: PropTypes.func,
    values: PropTypes.array,
    changeFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    placeholder: 'Select an option',
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

  createFromSearch(options, values, search) {
    const labels = values.map(({label}) => label)
    if (search.trim().length === 0 || labels.indexOf(search.trim()) !== -1) {
      return null
    }
    return {label: search.trim(), value: search.trim()}
  }

  render() {
    const { values, title } = this.props
    return (
      <div>
        {title && <p>{title}</p>}
        <MultiSelect
          renderNoResultsFound={() => null}
          onValuesChange={::this.onValuesChange}
          createFromSearch={::this.createFromSearch}
          values={this.state.values}
        />
      </div>
    )
  }
}
