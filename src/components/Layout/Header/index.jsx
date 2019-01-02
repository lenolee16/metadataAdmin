import React from 'react'
import { Avatar } from 'antd'

import './index.less'

const state = {
  userName: 'admin'
}

const Header = () => (
  <div className='header-user'>
    <Avatar icon='user' />
    <span className='userName'>{state.userName}</span>
  </div>
)

export default Header
