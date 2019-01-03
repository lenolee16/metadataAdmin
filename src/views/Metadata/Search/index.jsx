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
      isSearched: false
    }
  }
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据源搜索'>
          <div className='searchForm'>
            <Input addonBefore='表名' size='large' placeholder='请输入数据表名' />
            <Input addonBefore='字段名' size='large' placeholder='请输入字段名' />
            <Button type='primary' size='large' icon='search'>搜索</Button>
          </div>
          {this.state.isSearched ? <div className='searchResult'>
            <Table dataSource={this.state.data}>
              <Column
                title='数据源名'
                dataIndex='title'
                key='title'
              />
              <Column
                title='数据库名'
                dataIndex='name'
                key='name'
              />
              <Column
                title='数据表名'
                dataIndex='des'
                key='des'
              />
              <Column
                title='操作'
                key='action'
                render={(text, record) => (
                  <span>
                    <Link to={`/metadataList/${record.id}/${record.id}/${record.id}`}>查看</Link>
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
