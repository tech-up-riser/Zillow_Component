import React from 'react'
import { render } from 'react-dom'
import Perf from 'react-addons-perf'
import SavedSearch from './src/savedSearch.js'

render(
  <SavedSearch />,
  document.getElementById('redman-devserver')
)

if (!__SERVER__) {
  window.Perf = Perf
  window.React = React
}
