import { connect } from 'react-redux'
import format from 'string-format'
import { saveSearch, toggleSaveSearchUI } from '../actions/user/saveSearch'
import SaveSearch from '../components/saveSearch.react'

function mapStateToProps({
  user: { saveSearch: { isOpen } },
  settings: { loggedIn, redirectNonUserOnProfileActions, urlTemplates: { redirectNonUserUrl, variables } }
}) {
  const redirectURL = !loggedIn && format(redirectNonUserUrl, variables)
  return { isOpen, loggedIn, redirectURL }
}

export default connect(mapStateToProps, { saveSearch, toggleSaveSearchUI })(SaveSearch)
