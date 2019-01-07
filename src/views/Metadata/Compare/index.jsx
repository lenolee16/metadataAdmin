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
      amendVisible: false,
      isEdit: false,
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
  this.setState({ data: this.state.data.filter(item => item.title.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
}
// 初始化table
initData = () => {
  this.setState({ loading: true })
  window._http.post('/metadata/dataSource/list').then(res => {
    if (res.data.code === 0) {
      this.setState({
        data: res.data.data,
        loading: false
      })
    } else {
      this.setState({ loading: false })
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
        <Table rowKey='dataSourceId' dataSource={this.state.data} loading={this.state.loading}>
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
