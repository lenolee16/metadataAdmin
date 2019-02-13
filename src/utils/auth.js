import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import utils from './index'

import { Redirect } from 'react-router'

const isValidate = function (history) {
  const isLoggedIn = utils.getLoggedIn()
  return isLoggedIn || history.location.pathname === '/login'
}

/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default function authHOC (BaseComponent) {
  class Restricted extends Component {
    render () {
      if (isValidate(this.props.history)) {
        return <BaseComponent {...this.props} />
      } else {
        return <Redirect to='/login' />
      }
    }
  }

  Restricted.propTypes = {
    history: PropTypes.object
  }

  return withRouter(Restricted)
}
