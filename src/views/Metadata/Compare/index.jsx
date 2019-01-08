import React, { PureComponent } from 'react'
import { Card, Table, Button, Input } from 'antd'
import { Link } from 'react-router-dom'
import utils from 'utils'
const { Column } = Table
const { Search } = Input
class MetadataList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      pagination: {
        pageSize: 10,
        current: 1
      },
      loading: false,
      formData: null
    }
  }
  componentDidMount () {
    this.initData()
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.state.data })
    }
    const data = this.data.filter(item => item.title.toLocaleLowerCase().includes(val.toLocaleLowerCase()))
    const pager = this.state.pagination
    pager.total = data.length
    this.setState({ data: data, pagination: pager })
  }
  // 初始化table
  initData = () => {
    this.setState({ loading: true })
    window._http.post('/metadata/dataSource/list').then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        this.data = res.data.data
        const pager = this.state.pagination
        pager.total = this.data.length
        this.setState({ pagination: pager })
        this.partPage(pager.current)
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  // 修改分页
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.partPage(pager.current)
  }
  partPage = (current) => {
    this.setState({ data: this.data.slice((current - 1) * this.state.pagination.pageSize, current * this.state.pagination.pageSize) })
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
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据源列表'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Search
              className='fr'
              placeholder='源数据库名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table rowKey='dataSourceId' pagination={this.state.pagination} dataSource={this.state.data} loading={this.state.loading} onChange={this.handleTableChange}>
            <Column
              title='标题'
              dataIndex='title'
              key='title'
            />
            <Column
              title='描述'
              dataIndex='description'
              key='description'
            />
            <Column
              title='数据库类型'
              dataIndex='dbType'
              key='dbType'
              render={(v) => {
                if (v === 1) {
                  return 'mysql'
                } else if (v === 2) {
                  return 'sqlserver'
                }
              }}
            />
            <Column
              title='链接地址'
              dataIndex='jdbcUrl'
              key='jdbcUrl'
              width='150px'
            />
            <Column
              title='用户名'
              dataIndex='user'
              key='user'
            />
            <Column
              title='密码'
              dataIndex='password'
              key='password'
              render={() => '*****'}
            />
            <Column
              title='状态'
              dataIndex='status'
              key='status'
              render={(v) => v ? '启用' : '禁用'}
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                <>
                  <Link to={`/metadataList/${record.dataSourceId}`}><Button type='primary' ghost icon='search' style={{ marginRight: '10px' }} >查看</Button></Link>
                  <Button type='danger' ghost icon='sync' onClick={() => this.sync(record)}>同步</Button>
                </>
              )}
            />
          </Table>
        </Card>
      </div>
    )
  }
}

export default MetadataList
