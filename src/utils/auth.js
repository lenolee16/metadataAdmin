import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import utils from './index'

const validate = function (history) {
  const isLoggedIn = utils.getLoggedIn()
  if (!isLoggedIn && history.location.pathname !== '/login') {
    history.replace('/login')
  }
}

/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default function authHOC (BaseComponent) {
  class Restricted extends Component {
    componentWillMount () {
      this.checkAuthentication(this.props)
    }
    componentWillReceiveProps (nextProps) {
      if (nextProps.location !== this.props.location) {
        this.checkAuthentication(nextProps)
      }
    }
    checkAuthentication (params) {
      const { history } = params
      validate(history)
    }
    render () {
      return <BaseComponent {...this.props} />
    }
  }
  Restricted.propTypes = {
    location: PropTypes.object
  }
  return withRouter(Restricted)
}
