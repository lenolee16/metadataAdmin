import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Avatar, Icon } from 'antd'
import { toggleMenu } from '$redux/actions'

import './index.less'

const state = {
  userName: 'admin'
}

const mapStateToProps = state => ({
  collapsed: state.common.collapsed
})

const mapDispatchToProps = dispatch => ({
  toggle: bindActionCreators(toggleMenu, dispatch)
})

const Header = (props) => (
  <>
    <div className='toggle-menu'>
      <Icon
        className='trigger'
        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={props.toggle}
        style={{ float: 'left' }}
      />
    </div>
    <div className='header-user'>
      <Avatar icon='user' />
      <span className='userName'>{state.userName}</span>
    </div>
  </>

)

Header.propTypes = {
  collapsed: PropTypes.any,
  toggle: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
