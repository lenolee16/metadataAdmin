import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
import { routes } from 'routes'
import LeftMenu from 'components/Layout/LeftMenu/index'
import Headers from 'components/Layout/Header/index'
import './MainView.less'

const { Sider, Content, Header } = Layout
class MainView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      userName: 'admin'
    }
  }
  render () {
    return (
      <Layout className='app'>
        <Sider>
          <div className='logo'>元数据管理平台</div>
          <LeftMenu location={this.props.location} />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: '#fff' }} >
            <Headers />
          </Header>
          <Content className='app-content'>
            {renderRoutes(routes)}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

MainView.propTypes = {
  location: PropTypes.object
}

export default MainView
