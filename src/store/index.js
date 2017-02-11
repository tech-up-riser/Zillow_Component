import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import clientPromiseMiddleware from './middleware/clientPromiseMiddleware'
import reducer from '../reducers'

export default function createStore(data) {
  const middleware = [clientPromiseMiddleware()]

  let finalCreateStore
  if (__DEVELOPMENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools')
    const DevTools = require('containers/DevTools')
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      !__SERVER__  && window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      !__SERVER__ ? persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)) : _ => _
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const store = finalCreateStore(reducer, data)

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'))
    })
  }

  return store
}
