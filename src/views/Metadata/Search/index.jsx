import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Input, Button, Table, Switch } from 'antd'
import { Link } from 'react-router-dom'
import Ellipsis from 'components/Ellipsis'

import './index.less'

const { Column } = Table

const mapStateToProps = state => ({
  tableHeightNum: state.tableHeight.tableHeightNum
})
class MetadataSearch extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      tableName: '',
      fieldName: '',
      tableComment: '',
      fieldComment: '',
      isUat: true,
      loading: false,
      isSearched: false
    }
  }
  search = () => {
    const { tableName, fieldName, tableComment, fieldComment, isUat } = this.state
    console.log(isUat)
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
  // 过滤数据拿到不同类别的数据
  setData = (bool, data) => {
    let arr = data || this.state.data
    arr = arr.map(item => item.bool === bool)
    // if (bool) {
    //   arr = data.map(item => item.bool)
    // } else {
    //   arr = data.map(item => !item.bool)
    // }
    this.setData({ data: arr })
  }
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据源搜索'>
          <div className='searchForm'>
            <div style={{ display: 'inline-block', width: '55px', marginRight: '10px' }}>
              <Switch checkedChildren='UAT' unCheckedChildren='PRO' defaultChecked onChange={e => this.setState({ isUat: e })} />
            </div>
            <Input addonBefore='表名' size='large' value={this.state.tableName} onPressEnter={this.search} onChange={(e) => this.setState({ tableName: e.target.value })} placeholder='请输入数据表名' />
            <Input addonBefore='表注释' size='large' value={this.state.tableComment} onPressEnter={this.search} onChange={(e) => this.setState({ tableComment: e.target.value })} placeholder='请输入数据表注释' />
            <Input addonBefore='字段名' size='large' value={this.state.fieldName} onPressEnter={this.search} onChange={(e) => this.setState({ fieldName: e.target.value })} placeholder='请输入字段名' />
            <Input addonBefore='字段注释' size='large' value={this.state.fieldComment} onPressEnter={this.search} onChange={(e) => this.setState({ fieldComment: e.target.value })} placeholder='请输入字段注释' />
            <Button type='primary' size='large' icon='search' onClick={this.search} loading={this.state.loading}>搜索</Button>
          </div>
          {this.state.isSearched ? <div className='searchResult'>
            <Table
              dataSource={this.state.data}
              pagination={false}
              size='small'
              className='smallSizeTable'
              scroll={{ y: this.props.tableHeightNum - 300 }}
              rowKey={(record) => `${record.targetTableId}-${record.targetFieldId || ''}`} loading={this.state.loading}>
              <Column
                title='数据源名'
                dataIndex='dataSourceName'
                key='dataSourceName'
                width={170}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 155 }} />
                )}
              />
              <Column
                title='数据表名'
                dataIndex='targetTableName'
                key='targetTableName'
                width={155}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 135 }} />
                )}
              />
              <Column
                title='数据表注释'
                dataIndex='targetTableComment'
                key='targetTableComment'
                width={200}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 185 }} />
                )}
              />
              <Column
                title='数据字段名'
                dataIndex='targetFieldName'
                key='targetFieldName'
                width={145}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 120 }} />
                )}
              />
              <Column
                title='数据字段注释'
                dataIndex='targetFieldComment'
                key='targetFieldComment'
              />
              <Column
                title='操作'
                key='action'
                width={50}
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
MetadataSearch.propTypes = {
  tableHeightNum: PropTypes.number
}
export default connect(
  mapStateToProps
)(MetadataSearch)
