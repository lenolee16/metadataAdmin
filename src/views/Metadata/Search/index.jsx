import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, Input, Button, Table, Switch } from 'antd'
import { Link } from 'react-router-dom'
import Ellipsis from 'components/Ellipsis'
import { TABS_PAGE } from '$redux/actions'

import './index.less'

const { Column } = Table

const mapStateToProps = state => ({
  tableHeightNum: state.tableHeight.tableHeightNum,
  tabsPage: state.tabsPage.tabs
})

const mapDispatchToProps = dispatch => ({
  toggle: bindActionCreators(TABS_PAGE, dispatch)
})

class MetadataSearch extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      table: '',
      field: '',
      tableName: '',
      fieldName: '',
      tableComment: '',
      fieldComment: '',
      displayFlag: 1,
      loading: false,
      isSearched: false
    }
  }
  search = () => {
    const { tableName, fieldName, tableComment, fieldComment, table, field } = this.state
    if (!tableName && !fieldName && !tableComment && !fieldComment && !field && !table) {
      return window._message.error('请输入至少一项搜索条件')
    }
    this.setState({ loading: true })
    window._http.post('/metadata/targetField/searchField', { table, field }).then(res => {
      if (res.data.code === 0) {
        this.data = res.data.data
        this.setState({
          // data: this.data,
          isSearched: true,
          loading: false
        })
        this.setData(this.state.displayFlag)
      } else {
        this.setState({ loading: false })
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  // 过滤数据拿到不同类别的数据
  setData = (bool) => {
    if (bool) {
      this.setState({ data: this.data, displayFlag: bool })
    } else {
      this.setState({ data: this.data.filter(item => item.displayFlag === 1), displayFlag: bool })
    }
  }
  setFilter = (bool) => {
    if (bool) {
      this.setState({ data: this.data, displayFlag: bool })
    } else {
      this.setState({ data: this.data.filter(item => item.targetTable === null || item.targetTable.displayFlag === 1), displayFlag: bool })
    }
  }
  // toPath = (url) => {
  //   const arr = this.props.tabsPage
  //   if (arr.some(e => e.path === url)) return
  //   console.log(arr)
  //   arr.push({ name: '数据源同步', path: url })
  //   this.props.toggle(arr)
  //   this.props.history.push(url)
  // }
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据源搜索'>
          <div className='searchForm'>
            <div style={{ display: 'inline-block', width: '70px', marginRight: '10px' }}>
              <Switch checkedChildren='显示' unCheckedChildren='隐藏' defaultChecked onChange={e => this.setData(e)} />
            </div>
            <Input addonBefore='表名/表注释' size='large' value={this.state.table} onPressEnter={this.search} onChange={(e) => this.setState({ table: e.target.value })} placeholder='请输入表名/表注释' />
            <Input addonBefore='字段名/字段注释' size='large' value={this.state.field} onPressEnter={this.search} onChange={(e) => this.setState({ field: e.target.value })} placeholder='请输入字段名/字段注释' />
            {/* <Input addonBefore='表名' size='large' value={this.state.tableName} onPressEnter={this.search} onChange={(e) => this.setState({ tableName: e.target.value })} placeholder='请输入数据表名' />
            <Input addonBefore='表注释' size='large' value={this.state.tableComment} onPressEnter={this.search} onChange={(e) => this.setState({ tableComment: e.target.value })} placeholder='请输入数据表注释' />
            <Input addonBefore='字段名' size='large' value={this.state.fieldName} onPressEnter={this.search} onChange={(e) => this.setState({ fieldName: e.target.value })} placeholder='请输入字段名' />
            <Input addonBefore='字段注释' size='large' value={this.state.fieldComment} onPressEnter={this.search} onChange={(e) => this.setState({ fieldComment: e.target.value })} placeholder='请输入字段注释' /> */}
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
                  // <span style={{ color: '#7f76fa', cursor: 'pointer' }} onClick={() => this.toPath(`/metadataList/${record.dataSourceId}/${record.targetTableId}`)}>
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
  // history: PropTypes.object,
  // tabsPage: PropTypes.array,
  // toggle: PropTypes.func
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MetadataSearch)
