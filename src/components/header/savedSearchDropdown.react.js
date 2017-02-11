import React, { Component, PureComponent, PropTypes } from 'react'
import format from 'string-format'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { pick } from 'lodash'
import { selectSavedSearch } from '../../actions/user/savedSearches'
import { toggleSaveSearchUI } from '../../actions/user/saveSearch'

function mapSavedSearchStateToProps({
  settings: { loggedIn, redirectNonUserOnProfileActions, urlTemplates: { redirectNonUserUrl, variables } }
}){
  if (!__SERVER__) {
    variables['__WINDOW_PATHNAME__'] = window.location.pathname
    variables['__WINDOW_SEARCH__'] = window.location.search
  }
  const redirectURL = !loggedIn && format(redirectNonUserUrl, variables)
  return { loggedIn, redirectURL, redirectNonUserOnProfileActions }
}

@connect(mapSavedSearchStateToProps, { toggleSaveSearchUI })
export default class SavedSearch extends Component {
  static propTypes = {
    toggleSaveSearchUI: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    redirectURL: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    redirectNonUserOnProfileActions: PropTypes.bool
  }

  state = {
    isOpen: false
  }

  componentDidMount() {
    this.mounted = true
    document.addEventListener('click', this.handleDocumentClick, { passive: true })
    document.addEventListener('touchend', this.handleDocumentClick, { passive: true })
  }

  componentWillUnmount() {
    this.mounted = false
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('touchend', this.handleDocumentClick)
  }

  handleDocumentClick = ({ target }) => {
    if (this.mounted && !findDOMNode(this).contains(target) && this.state.isOpen) {
      this.setState({ isOpen: false })
    }
  }

  handleSavedSearchesToggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  _handleSaveSearchClick(event) {
    const { redirectNonUserOnProfileActions, toggleSaveSearchUI, loggedIn } = this.props
    if(!loggedIn && redirectNonUserOnProfileActions) {
      return
    }
    event.preventDefault()
    toggleSaveSearchUI()
  }

  render() {
    const { isOpen } = this.state
    const { toggleSaveSearchUI, loggedIn, redirectURL, redirectNonUserOnProfileActions } = this.props
    return (
      <div className='savedSearchList'>
        {loggedIn && (
          <i
            onClick={::this.handleSavedSearchesToggle}
            className={classnames('ion-chevron-down', 'searchesDropDown-toggle', { open: isOpen })}
          />
        )}
        <a
          href={!loggedIn && redirectNonUserOnProfileActions && redirectURL}
          className='button button-attention'
          onClick={::this._handleSaveSearchClick}
        >
          save search
        </a>
        {loggedIn && <Dropdown isOpen={isOpen} />}
      </div>
    )
  }
}


function mapStateToProps({ user: { savedSearches } }) {
  return pick(savedSearches, ['searches', 'selected', 'isLoading', 'isLoaded'])
}

@connect(mapStateToProps, { selectSavedSearch })
class Dropdown extends PureComponent {
  static propTypes = {
    searches: PropTypes.array.isRequired,
    selected: PropTypes.string,
    selectSavedSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired
  }

  selectSavedSearch(id) {
    const { selected, selectSavedSearch } = this.props
    if (id !== selected) selectSavedSearch(id)
  }

  render() {
    const { searches, selected, isLoading, isLoaded, isOpen: open } = this.props
    return (
      <ul className={classnames('searchesDropDown', {open})}>
        <li className='dropDownTitle'>Your saved searches</li>
        {searches.map(({id, name}) => (
          <li key={id} onClick={this.selectSavedSearch.bind(this, id)} className={classnames({'is-selected': selected === id})}>
            {name}
          </li>
        ))}
      </ul>
    )
  }
}
