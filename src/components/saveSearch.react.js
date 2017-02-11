import React, { PureComponent, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import classnames from 'classnames'

export default class SaveSearch extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    saveSearch: PropTypes.func.isRequired,
    toggleSaveSearchUI: PropTypes.func.isRequired,
    redirectURL: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  }

  handleSubmit(event) {
    event.preventDefault()
    const { refs: { name: { value: name } } } = this
    if (name.length < 1) return
    this.props.saveSearch(name)
  }

  cancelClose(event) {
    event.stopPropagation()
  }

  render() {
    const { isOpen, toggleSaveSearchUI, loggedIn, redirectURL } = this.props
    if (!isOpen) return null
    return (
      <div className='save-search-modal-wrap' onClick={toggleSaveSearchUI}>
        <center onClick={this.cancelClose}>
          <h1>Save Search</h1>
          {loggedIn ? (
            <form onSubmit={::this.handleSubmit}>
              <label><input type='text' ref='name' />Name</label>
              <button type='submit'>Save</button>
            </form>
            ) : (
            <div>
              user must be logged in to save a search.
              {redirectURL && <a href={redirectURL}>login</a>}
            </div>
          )}
        </center>
      </div>
    )
  }
}
