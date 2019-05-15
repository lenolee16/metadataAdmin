import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { hasChildren } from 'utils/matchRoute'
import menuData from './data.json'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { TABS_PAGE } from '$redux/actions'

const isActive = (path, location) => {
  return location.pathname.indexOf(path) === 0
}

const mapStateToProps = state => ({
  tabsPage: state.tabsPage.tabs
})

const mapDispatchToProps = dispatch => ({
  toggle: bindActionCreators(TABS_PAGE, dispatch)
})

class LeftMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectKey: '/metadataManage',
      openKey: null
    }
  }
  click = (obj) => {
    // const { children, eventKey } = obj.item.props
    const { eventKey } = obj.item.props
    // const arr = this.props.tabsPage
    // if (arr.some(e => e.path === eventKey)) return
    // arr.push({ name: children, path: eventKey })
    // this.props.toggle(arr)
    this.props.history.push(eventKey)
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
        return (item.children && Array.isArray(item.children) && hasChildren(item.children)) ? <Menu.SubMenu key={item.id} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>
        }>{renderMenu(item.children, item.id)}</Menu.SubMenu>
          : <Menu.Item onClick={this.click} key={item.path}>
            {item.name}
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
        inlineCollapsed={this.props.collapsed}
      >
        {menu}
      </Menu>
    )
  }
}

LeftMenu.propTypes = {
  location: PropTypes.object,
  collapsed: PropTypes.bool,
  history: PropTypes.object
  // tabsPage: PropTypes.array,
  // toggle: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu)
