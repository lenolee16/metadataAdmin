import React, { PureComponent } from 'react'
import { Card, Table, Button, Input } from 'antd'
import { Link } from 'react-router-dom'
import utils from 'utils'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Ellipsis from 'components/Ellipsis'
const { Column } = Table
const { Search } = Input

const mapStateToProps = state => ({
  tableHeightNum: state.tableHeight.tableHeightNum
})

class MetadataList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      loading: false
    }
  }
  componentDidMount () {
    this.initData()
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.title.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  // 初始化table
  initData = () => {
    this.setState({ loading: true })
    window._http.post('/metadata/dataSource/list').then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        this.data = res.data.data.filter(item => item.status === 1)
        this.setState({ data: this.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  // 同步 /metadata/dataSource/sync
  sync = (data) => {
    utils.loading.show()
    window._http.post('/metadata/dataSource/sync', { dataSourceId: data.dataSourceId }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        this.initData()
        window._message.success(res.data.msg)
      } else {
        window._message.error(res.data.msg)
      }
    }).catch(() => {
      utils.loading.hide()
    })
  }
  // 导出数据源
  export = (data) => {
    utils.loading.show()
    const a = window.open('about:blank')
    window._http.post('/metadata/sqoop/exportDB', { dataSourceId: data.dataSourceId }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success(res.data.msg)
        a.location.href = res.data.data
      } else {
        window._message.error(res.data.msg)
      }
    }).catch(res => {
      utils.loading.hide()
    })
  }
  // 导出exportExcel表
  exportExcel = (data) => {
    utils.loading.show()
    const a = window.open('about:blank')
    window._http.post('/metadata/datasource/exportSchema', { dataSourceId: data.dataSourceId }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success(res.data.msg)
        a.location.href = res.data.data
      } else {
        window._message.error(res.data.msg)
      }
    }).catch(res => {
      utils.loading.hide()
    })
  }

  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据源列表'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Search
              className='fr'
              placeholder='源数源标题'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table
            rowKey='dataSourceId'
            size='small'
            pagination={false}
            className='smallSizeTable'
            scroll={{ y: this.props.tableHeightNum - 270 }}
            dataSource={this.state.data}
            loading={this.state.loading}>
            <Column
              title='标题'
              dataIndex='title'
              key='title'
              width={125}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 90 }} />
              )}
            />
            <Column
              title='库名'
              dataIndex='dbName'
              key='dbName'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='hive库名'
              dataIndex='hiveDbName'
              key='hiveDbName'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='描述'
              dataIndex='description'
              key='description'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='数据库类型'
              dataIndex='dbType'
              key='dbType'
              width={100}
              render={(v) => {
                if (v === 1) {
                  return 'mysql'
                } else if (v === 2) {
                  return 'sqlserver'
                }
              }}
            />
            <Column
              title='IP端口'
              dataIndex='jdbcUrl'
              key='jdbcUrl'
              width={150}
              render={(text) => (
                text.split('//')[1] ? text.split('//')[1].split(/[/|;]/)[0] : ''
              )}
            />
            <Column
              title='用户名'
              dataIndex='user'
              key='user'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='状态'
              dataIndex='status'
              key='status'
              align='center'
              width={60}
              render={(v) => v ? '启用' : '禁用'}
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                  <>
                    <Link to={`/metadataList/${record.dataSourceId}`}><Button type='primary' size='small' ghost icon='search' style={{ marginRight: '10px', marginBottom: '5px' }} >查看</Button></Link>
                    <Button type='danger' size='small' ghost icon='sync' onClick={() => this.sync(record)} style={{ marginRight: '10px', marginBottom: '5px' }} >同步</Button>
                    <Button type='primary' size='small' ghost icon='export' onClick={() => this.export(record)} style={{ marginRight: '10px', marginBottom: '5px' }}>脚本</Button>
                    <Button type='primary' size='small' ghost icon='export' onClick={() => this.exportExcel(record)}>Excel</Button>
                  </>
              )}
            />
          </Table>
        </Card>
      </div>
    )
  }
}

MetadataList.propTypes = {
  tableHeightNum: PropTypes.number
}

export default connect(
  mapStateToProps
)(MetadataList)
