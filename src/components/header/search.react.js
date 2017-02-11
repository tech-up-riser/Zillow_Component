import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import * as SearchActions from '../../actions/user/search'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'

@connect(({ user: { search } }) => search, SearchActions)
export default class Search extends Component {
  static propTypes = {
    selectSuggestion: PropTypes.func.isRequired,
    loadSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.array.isRequired,
    clearSearch: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired
  }

  state = {
    searchText: ''
  }

  getSuggestionValue({ name, ...data }) {
    const { searchText } = this.state
    this.props.selectSuggestion(data, searchText.trim())
    return (get(data, 'type[0]') === 'mls' ? get(data, 'details.address') : name) || searchText
  }

  onSuggestionsUpdateRequested({ value }) {
    if (value && value.length >= 3) {
      this.props.loadSuggestions(value)
    }
  }

  renderSuggestion({ name, details, type: [type] }, { value, valueBeforeUpDown }) {
    return <div className='suggestion'>{type === 'mls' ? details.address : name}</div>
  }

  handleSearchButtonClick() {
    const { searchText } = this.state
    if (searchText) {
      this.props.clearSearch()
      this.setState({ searchText: '' })
    }
  }

  render() {
    const { searchText } = this.state
    const { suggestions, listings, clearSuggestions } = this.props
    return (
      <div className='section flex input-container-search'>
        <Autosuggest
          suggestions={suggestions}
          inputProps={{
            placeholder: 'Search...',
            value: this.state.searchText,
            onChange: (event, { newValue }) => this.setState({ searchText: newValue })
          }}
          onSuggestionsFetchRequested={::this.onSuggestionsUpdateRequested}
          onSuggestionsClearRequested={clearSuggestions}
          getSuggestionValue={::this.getSuggestionValue}
          onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
          renderSuggestion={::this.renderSuggestion} />
        <i onClick={::this.handleSearchButtonClick} className={(searchText ? 'ion-android-close' : 'ion-android-search') + ' icon-search'}  />
      </div>
    )
  }
}
