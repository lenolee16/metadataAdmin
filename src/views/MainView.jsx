import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Layout, Spin } from 'antd'
import { routes } from 'routes'
import LeftMenu from 'components/Layout/LeftMenu/index'
import Headers from 'components/Layout/Header/index'
import { tableHeight } from '$redux/actions'
import './MainView.less'

const { Sider, Content, Header } = Layout

const mapStateToProps = state => ({
  loading: state.loading.globalLoading,
  tableHeightNum: state.tableHeight.tableHeightNum
})

const mapDispatchToProps = dispatch => ({
  tableHeight: bindActionCreators(tableHeight, dispatch)
})

class MainView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      userName: 'admin'
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.handleResize.bind(this))
    // let tableHeight = window.document.body.clientHeight - 263
    // console.log(tableHeight)
    // this.props.tableHeight(window.document.body.clientHeight)
    // console.log(window.document.body.clientHeight)
    // console.log(this.props.tableHeightNum)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }
  // 浏览器窗口大小改变事件
  handleResize = e => {
    console.log('改变开始')
    // let tableHeight = e.target.innerHeight - 223
    // console.log(tableHeight)
    this.props.tableHeight(e.target.innerHeight)
    console.log(e.target.innerHeight)
    setTimeout(() => {
      console.log('----')
      console.log(this.props.tableHeightNum)
    }, 0)
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
          <Spin spinning={this.props.loading}>
            <Content className='app-content'>
              {renderRoutes(routes)}
            </Content>
          </Spin>
        </Layout>
      </Layout>
    )
  }
}

MainView.propTypes = {
  location: PropTypes.object,
  loading: PropTypes.bool,
  tableHeightNum: PropTypes.number,
  tableHeight: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView)
