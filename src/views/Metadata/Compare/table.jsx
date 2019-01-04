import React, { PureComponent } from 'react'
import { Card, Table, Button, Input } from 'antd'
import { Link } from 'react-router-dom'
const { Column } = Table
const { Search } = Input

class MetadataTableList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      dataSourceId: '1',
      loading: false,
      formData: null
    }
  }
  componentDidMount () {
    this.data = [{
      targetTableId: '1',
      tableName: 'John Brown',
      targetComment: '目标注释',
      targetStatus: '目标状态',
      currentComment: '当前注释',
      currentStatus: '当前状态',
      compareComment: '对比注释',
      compareStatus: '对比状态'
    }, {
      targetTableId: '2',
      tableName: 'ssssss',
      targetComment: '目标注释',
      targetStatus: '目标状态',
      currentComment: '当前注释',
      currentStatus: '当前状态',
      compareComment: '对比注释',
      compareStatus: '对比状态'
    }]
    this.setState({ data: this.data })
  // this.initData()
  // this.wrappedForm.current.focusTextInput()
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.tableName.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
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
    window._http.post('/metadata/dataSource/syne', { dataSourceId: data.dataSourceId }).then(res => {
      if (res.data.code === 0) {
        window._message.success('同步成功')
      } else {
        window._message.error('同步失败')
      }
    }).catch(err => {
      console.log(err)
      window._message.error(err)
    })
  }
  // 修改
  amend = () => {
    console.log('我在修改')
  }
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据表'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Search
              className='fr'
              placeholder='数据表名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table rowKey='targetTableId' dataSource={this.state.data} loading={this.state.loading}>
            <Column
              title='数据表名称'
              dataIndex='tableName'
              key='tableName'
            />
            <Column
              title='目标注释'
              dataIndex='targetComment'
              key='targetComment'
            />
            <Column
              title='目标状态'
              dataIndex='targetStatus'
              key='targetStatus'
            />
            <Column
              title='当前注释'
              dataIndex='currentComment'
              key='currentComment'
            />
            <Column
              title='当前状态'
              dataIndex='currentStatus'
              key='currentStatus'
            />
            <Column
              title='对比注释'
              dataIndex='compareComment'
              key='compareComment'
            />
            <Column
              title='对比状态'
              dataIndex='compareStatus'
              key='compareStatus'
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                  <>
                    <Link to={`/metadataList/${this.dataSourceId}/${record.targetTableId}`}><Button type='primary' ghost icon='search' style={{ marginRight: '10px' }} >查看</Button></Link>
                    <Button type='primary' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '10px' }}>修改</Button>
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

export default MetadataTableList
