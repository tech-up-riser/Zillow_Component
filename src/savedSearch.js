import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'
import classnames from 'classnames'
import redmanStyles from 'redman-styles'
import { get } from 'lodash'
import createStore from './store'
import propTypes from './propTypes'
import defaultProps from './defaultProps'
import { extractInitialStateFromProps, extractdynamicFilters } from './helpers/store'
import { Map, Listings, Header, SaveSearch } from './containers'
import { appLoad } from './actions/app'

let styles = null

if (__SERVER__) {
  styles = require('fs').readFileSync('dist/ss-v2/styles.css').toString()
} else {
  styles = require('./styles/entry.scss')
}

@redmanStyles(styles, 'saved-search')
export default class SavedSearch extends Component {
  static propTypes = propTypes
  static defaultProps = defaultProps

  state = this.computeInitialStateFromProps()

  computeInitialStateFromProps() {
    const store = createStore(extractInitialStateFromProps(this.props))
    return { store }
  }

  componentWillMount() {
    const dynamicFilters = extractdynamicFilters(this.props)
    this.state.store.dispatch(appLoad({ dynamicFilters }))
  }

  componentDidMount() {
    let currentValue
    var store = this.state.store
    if (this.props.updateURL) {
      store.subscribe(() => {
        let previousValue = currentValue
        let state = store.getState()
        currentValue = get(state, 'content.listings.currentPath')
        if (previousValue !== currentValue) {
          // get out the url, from the querystring, and add it to our full url
          if (window.location.search && window.location.search.length > 1) {
            window.location.search.substring(1).split('&').forEach((part) => {
              var keyval = part.split('=')
              if (keyval[0] === 'url') currentValue = part + '&' + currentValue
            })
          }
          // zoom
          var zoom = get(state, 'user.map.zoom')
          var full = window.location.origin + window.location.pathname + '?' + currentValue + '&zoom=' + zoom
          window.history.replaceState({}, '', full)
        }
      })
    }
  }

  shouldComponentUpdate() {
    return false
  }

  get helmetLinks() {
    return [
      { rel: 'stylesheet', media: 'all', type: 'text/css', href: '//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css' },
      { rel: 'stylesheet', media: 'all', type: 'text/css', href: '//cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css' },
      { rel: 'stylesheet', media: 'all', type: 'text/css', href: '//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,400italic,600italic,700italic' },
    ]
  }

  render() {
    const { props: { touchEnabled, device }, state: { store } } = this
    return (
      <div className={classnames('app', 'device', {touch: touchEnabled})}>
        <Helmet link={this.helmetLinks} />
        <Provider store={store}>
          <div>
            <Header />
            {!__SERVER__ && <Map />}
            <Listings />
            <SaveSearch />
          </div>
        </Provider>
      </div>
    )
  }
}
