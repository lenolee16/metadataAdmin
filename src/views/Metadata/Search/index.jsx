import React, { PureComponent } from 'react'
import { Card, Input, Button, Table } from 'antd'
import { Link } from 'react-router-dom'

import './index.less'

const { Column } = Table

class MetadataSearch extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      tableName: '',
      fieldName: '',
      tableComment: '',
      fieldComment: '',
      loading: false,
      isSearched: false
    }
  }
  search = () => {
    const { tableName, fieldName, tableComment, fieldComment } = this.state
    if (!tableName && !fieldName && !fieldComment && !tableComment) {
      return window._message.error('请输入至少一项搜索条件')
    }
    this.setState({ loading: true })
    window._http.post('/metadata/targetField/searchField', { tableName, fieldName, tableComment, fieldComment }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          data: res.data.data,
          isSearched: true,
          loading: false
        })
      } else {
        this.setState({ loading: false })
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据源搜索'>
          <div className='searchForm'>
            <Input addonBefore='表名' size='large' value={this.state.tableName} onPressEnter={this.search} onChange={(e) => this.setState({ tableName: e.target.value })} placeholder='请输入数据表名' />
            <Input addonBefore='表注释' size='large' value={this.state.tableComment} onPressEnter={this.search} onChange={(e) => this.setState({ tableComment: e.target.value })} placeholder='请输入数据表注释' />
            <Input addonBefore='字段名' size='large' value={this.state.fieldName} onPressEnter={this.search} onChange={(e) => this.setState({ fieldName: e.target.value })} placeholder='请输入字段名' />
            <Input addonBefore='字段注释' size='large' value={this.state.fieldComment} onPressEnter={this.search} onChange={(e) => this.setState({ fieldComment: e.target.value })} placeholder='请输入字段注释' />
            <Button type='primary' size='large' icon='search' onClick={this.search} loading={this.state.loading}>搜索</Button>
          </div>
          {this.state.isSearched ? <div className='searchResult'>
            <Table dataSource={this.state.data} rowKey={(record) => `${record.targetTableId}-${record.targetFieldId || ''}`} loading={this.state.loading}>
              <Column
                title='数据源名'
                dataIndex='dataSourceName'
                key='dataSourceName'
              />
              <Column
                title='数据表名'
                dataIndex='targetTableName'
                key='targetTableName'
              />
              <Column
                title='数据表注释'
                dataIndex='targetTableComment'
                key='targetTableComment'
              />
              <Column
                title='数据字段名'
                dataIndex='targetFieldName'
                key='targetFieldName'
              />
              <Column
                title='数据字段注释'
                dataIndex='targetFieldComment'
                key='targetFieldComment'
              />
              <Column
                title='操作'
                key='action'
                render={(text, record) => (
                  <span>
                    <Link to={`/metadataList/${record.dataSourceId}/${record.targetTableId}`}>查看</Link>
                  </span>
                )}
              />
            </Table>
          </div> : ''}
        </Card>
      </div>
    )
  }
}

export default MetadataSearch
