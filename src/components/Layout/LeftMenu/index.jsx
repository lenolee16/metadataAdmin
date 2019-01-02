import React from 'react'
import PropTypes from 'prop-types'
import { matchPath } from 'react-router'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menuData from './data.json'

const isActive = (path, location) => {
  return matchPath(path, {
    path: location.pathname,
    exact: true,
    strict: false
  })
}
class LeftMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectKey: '1',
      openKey: null
    }
  }
  render () {
    let { selectKey, openKey } = this.state
    let renderMenu = (list, subkey) => {
      return list.map(item => {
        if (item.path && isActive(item.path, this.props.location)) {
          selectKey = item.id
          openKey = subkey
        }
        return (item.children && Array.isArray(item.children) && item.children.length) ? <Menu.SubMenu key={item.id} title={<><Icon type={item.icon} />{item.name}</>} >
          {renderMenu(item.children, item.id)}
        </Menu.SubMenu> : <Menu.Item key={item.id}>
          <Link to={item.path} replace={this.props.location.pathname === item.path}>
            <Icon type={item.icon} />
            <span>{item.name}</span>
          </Link>
        </Menu.Item>
      })
    }
    const menu = renderMenu(menuData)
    return (
      <Menu
        defaultSelectedKeys={[selectKey]}
        defaultOpenKeys={[openKey]}
        mode='inline'
        theme='dark'
      >
        {menu}
      </Menu>
    )
  }
}

LeftMenu.propTypes = {
  location: PropTypes.object
}

export default LeftMenu
