import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import utils from 'utils'

import './index.less'

class Login extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      userActive: 0,
      pwdActive: 0,
      user: '',
      password: ''
    }
  }
  login = () => {
    if (!this.state.user) {
      return window._message.error('请输入用户名！')
    }
    if (!this.state.password) {
      return window._message.error('请输入密码！')
    }
    if (this.state.user === 'admin' && this.state.password === 'admin') {
      this.loginSuccess()
      window._message.success('登录成功！')
    } else {
      window._message.error('用户名或者密码错误！')
    }
  }
  loginSuccess = () => {
    utils.setLoggedIn(true)
    this.props.history.push('/')
  }
  renderClass = (status, value) => {
    if (status === 1 || value) {
      return 'isActive'
    }
    if (status === 2) {
      return 'isLeave'
    }
    return ''
  }
  render () {
    return (
      <div className='Login'>
        <div className='LoginForm'>
          <h1>登录</h1>
          <p>元数据管理平台</p>
          <div className='LoginInput'>
            <label htmlFor='user' className={this.renderClass(this.state.userActive, this.state.user)}>用户名</label>
            <input id='user' type='text' onFocus={() => this.setState({ userActive: 1 })} onBlur={() => this.setState({ userActive: 2 })} onChange={(e) => this.setState({ user: e.target.value })} />
          </div>
          <div className='LoginInput'>
            <label htmlFor='password' className={this.renderClass(this.state.pwdActive, this.state.password)}>密码</label>
            <input id='password' type='password' onFocus={() => this.setState({ pwdActive: 1 })} onBlur={() => this.setState({ pwdActive: 2 })} onChange={(e) => this.setState({ password: e.target.value })} />
          </div>
          <Button type='primary' size='large' block onClick={this.login}>登录</Button>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object
}

export default Login
