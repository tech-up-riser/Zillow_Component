import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'

export default class Dropdown extends Component {
  static propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func
  }

  state = {
    selected: this.props.value || {
      label: this.props.placeholder,
      value: ''
    },
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

  componentWillReceiveProps({ value, placeholder }) {
    if (value && value !== this.state.selected) {
      this.setState({ selected: value })
    } else if (!value && placeholder) {
      this.setState({ selected: { label: placeholder, value: '' } })
    }
  }

  handleDocumentClick = ({ target }) => {
    if (this.mounted && !findDOMNode(this).contains(target) && this.state.isOpen) {
      this.setState({ isOpen: false })
    }
  }

  setValue(value, label) {
    const newState = {
      selected: { value, label },
      isOpen: false
    }
    this.fireChangeEvent(newState)
    this.setState(newState)
  }

  fireChangeEvent({ selected }) {
    if (this.props.onChange && selected !== this.state.selected) {
      this.props.onChange(selected)
    }
  }

  renderOption({ value, label }) {
    const { selected } = this.state
    const optionClass = classNames({
      'dropdown-option': true,
      'is-selected': value === selected.value
    })

    return (
      <div
        key={value}
        className={optionClass}
        onMouseDown={() => this.setValue(value, label)}
        onClick={() => this.setValue(value, label)}>
        {label}
      </div>
    )
  }

  buildMenu() {
    const ops = this.props.options.map(({ type, items, name, label, value }) => {
      if (type === 'group') {
        return (
          <div className='dropdown-group' key={name}>
            <div className='dropdown-title'>{name}</div>
            {items.map(item => this.renderOption(item))}
          </div>
        )
      } else {
        return this.renderOption({ label, value })
      }
    })
    return ops.length ? ops : <div className='dropdown-noresults'>No options found</div>
  }

  handleDropdownToggle = () => this.setState({ isOpen: !this.state.isOpen })

  render() {
    const { title, priceInput } = this.props
    const { selected, isOpen } = this.state
    const dropdownClass = classNames('dropdown', { 'is-open': isOpen, 'dropdown-price': priceInput })

    return (
      <div className={dropdownClass}>
        {title && <p className='title'>{title}</p>}
        <div className='dropdown-control' onClick={this.handleDropdownToggle}>
          <div className='dropdown-placeholder'>{selected.label}</div>
          <span className='dropdown-arrow'>
            <i className='ion-chevron-down' />
          </span>
        </div>
        {isOpen ? (
          <div className='dropdown-menu'>
            {this.props.children}
            {::this.buildMenu()}
          </div>
        ) : null}
      </div>
    )
  }
}
