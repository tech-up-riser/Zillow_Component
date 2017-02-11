import React from 'react'
import { render } from 'react-dom'
import Perf from 'react-addons-perf'
import SavedSearch from './src/savedSearch.js'

export default function (elem, props) {
  render(
    <SavedSearch {...props} />,
    elem
  )
}
