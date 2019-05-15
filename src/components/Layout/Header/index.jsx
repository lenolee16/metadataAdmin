import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Avatar, Icon } from 'antd'
import { toggleMenu } from '$redux/actions'

import './index.less'

// const TabPane = Tabs.TabPane

const state = {
  userName: 'admin'
}

const mapStateToProps = state => ({
  collapsed: state.common.collapsed,
  tabsPage: state.tabsPage.tabs
})

const mapDispatchToProps = dispatch => ({
  toggle: bindActionCreators(toggleMenu, dispatch)
})
// class Header extends PureComponent {
//   constructor (props) {
//     super(props)
//     // this.wrappedForm = React.createRef()
//     this.state = {
//       activeKey: '/',
//       panes: []
//     }
//   }
//   componentDidMount () {
//     this.getPanes()
//   }
//   getPanes () {
//     const panes = [
//       <TabPane tab='首页' key='/' />
//     ]
//     console.log(this.props.tabsPage)
//     this.props.tabsPage.forEach(v => {
//       panes.push(<TabPane tab={v.name} key={v.path} />)
//     })
//     this.setState({ panes })
//   }
//   onEdit = (targetKey, action) => {
//     this[action](targetKey)
//   }
//   add (key, name) {
//     const panes = this.state.panes
//     panes.push(<TabPane tab={name} key={key} />)
//     this.setState({ panes, activeKey: key })
//   }
//   remove (targetKey) {
//     let activeKey = this.state.activeKey
//     let lastIndex
//     this.state.panes.forEach((pane, i) => {
//       if (pane.key === targetKey) {
//         lastIndex = i - 1
//       }
//     })
//     const panes = this.state.panes.filter(pane => pane.key !== targetKey)
//     if (lastIndex >= 0 && activeKey === targetKey) {
//       activeKey = panes[lastIndex].key
//     }
//     this.setState({ panes, activeKey })
//   }
//   onChange = (activeKey) => {
//     this.setState({ activeKey })
//     // console.log(this.props)
//     this.props.history.push(activeKey)
//   }
//   render () {
//     return (
//       <>
//         <div style={{ height: '64px', width: '100%', lineHeight: '64px', padding: '0 10px' }}>
//           <div className='toggle-menu'>
//             <Icon
//               className='trigger'
//               type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
//               onClick={this.props.toggle}
//               style={{ float: 'left' }}
//             />
//           </div>
//           <div className='header-user'>
//             <Avatar icon='user' />
//             <span className='userName'>{state.userName}</span>
//           </div>
//         </div>
//         <div style={{ height: '30px', width: '100%', background: '#E8E8E8', lineHeight: '30px' }}>
//           <Tabs
//             hideAdd
//             type='editable-card'
//             onEdit={this.onEdit}
//             onChange={this.onChange}
//             activeKey={this.state.activeKey}>
//             <TabPane tab='首页' key='/' />
//             {this.props.tabsPage.map(pane => (
//               <TabPane tab={pane.name} key={pane.path} />
//             ))}
//           </Tabs>
//         </div>
//       </>
//     )
//   }
// }
const Header = (props) => (
  <>
    <div style={{ height: '64px', width: '100%', lineHeight: '64px' }}>
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
    </div>
  </>

)

Header.propTypes = {
  collapsed: PropTypes.any,
  tabsPage: PropTypes.array,
  toggle: PropTypes.func,
  history: PropTypes.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
