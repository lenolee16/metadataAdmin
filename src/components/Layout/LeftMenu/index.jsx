import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import { hasChildren } from 'utils/matchRoute'
import menuData from './data.json'

const isActive = (path, location) => {
  return location.pathname.indexOf(path) === 0
}
class LeftMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectKey: '/metadataManage',
      openKey: null
    }
  }
  click = (a, b) => {
    if (!a || !b) return
    let path = b
    let name = null
    console.log('点击了路由', a, b)
    console.log(menuData[a - 1].children.forEach(item => {
      if (item.path === b) name = item.name
    }))
    console.log(path, name)
  }
  render () {
    let { selectKey, openKey } = this.state
    let renderMenu = (list, subkey) => {
      return list.map(item => {
        if (!item.inMenu) return false
        if (item.path && isActive(item.path, this.props.location)) {
          selectKey = item.path
          openKey = subkey
        }
        return (item.children && Array.isArray(item.children) && hasChildren(item.children)) ? <Menu.SubMenu key={item.id} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>} >
          {renderMenu(item.children, item.id)}
        </Menu.SubMenu> : <Menu.Item key={item.path}>
          <Link to={item.path} replace={this.props.location.pathname === item.path}>
            {item.icon && <Icon type={item.icon} />}
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
        onClick={this.click(openKey, selectKey)}
        theme='dark'
        inlineCollapsed={this.props.collapsed}
      >
        {menu}
      </Menu>
    )
  }
}

LeftMenu.propTypes = {
  location: PropTypes.object,
  collapsed: PropTypes.bool
}

export default LeftMenu
