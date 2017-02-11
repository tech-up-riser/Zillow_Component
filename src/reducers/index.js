import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import content from './content'
import user from './user'
import settings from './settings'

export default combineReducers({
  form,
  content,
  user,
  settings
})
