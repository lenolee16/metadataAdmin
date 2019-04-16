import React, { Component } from 'react'
import { Card, Row, Col, Menu, Tree, Table, Input, Button, Icon, Tabs, Drawer, Empty, Tooltip, Tag, Popover } from 'antd'
import Highlighter from 'react-highlight-words'
import { deepClone, debounce } from 'utils/utils'
import utils from 'utils/'
import Ellipsis from 'components/Ellipsis'

import './index.less'

const SubMenu = Menu.SubMenu
const { TreeNode } = Tree
const { TabPane } = Tabs
const { Search } = Input

class BusinessMeta extends Component {
  constructor (props) {
    super(props)
    this.treeRef = React.createRef()
    this.handleFilter = debounce(this.onDrawerFilterChange.bind(this), 300)
    this.state = {
      data: [],
      menu: [],
      useTable: [],
      allTable: [],
      selectedKeys: [],
      currentSelectedKeys: [],
      expandedKeys: [],
      menuId: '',
      menuName: '',
      selectTable: '',
      selectTableInfo: {},
      selectTableFields: [],
      visible: false,
      loading: false,
      fieldLoading: false,
      submitLoading: false,
      menuLoading: false,
      drawerVisible: false
    }
  }
  componentDidMount () {
    this.queryMenu()
    this.queryAllTables()
  }
  queryAllTables () {
    window._http.post('/metadata/ods/tableList').then(res => {
      if (res.data.code === 0) {
        this._allTable = res.data.data
        this.setState({ allTable: res.data.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    })
  }
  queryMenu () {
    window._http.post('/metadata/ods/menuList').then(res => {
      this.setState({ menuLoading: false })
      if (res.data.code === 0) {
        this.menuData = res.data.data
        this.setState({ menu: res.data.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ menuLoading: false })
    })
  }
  renderMenu (data) {
    const _renderMenu = (list, subkey) => {
      return list.map(item => {
        return (item.childrenMenuResources && Array.isArray(item.childrenMenuResources) && item.childrenMenuResources.length > 0) ? <SubMenu key={item.id} title={<span><span>{item.name}{item.level === 1 && '系统'}</span></span>} >
          {_renderMenu(item.childrenMenuResources, item.id)}
        </SubMenu> : <Menu.Item key={item.id} title={item.name} >
          <span>{item.name}</span>
        </Menu.Item>
      })
    }
    return _renderMenu(data)
  }
  menuClick = (item) => {
    // 点击业务菜单，获取关联数据表，并设置当前选中的menuId,以及名称
    if (this.state.menuId !== item.key) {
      this.setState({
        menuId: item.key,
        menuName: item.item.props.title,
        selectTable: '',
        selectTableFields: [],
        selectTableInfo: {},
        selectedKeys: []
      })
      this.queryMenuUsed(item.key)
    }
  }
  queryMenuUsed (menuId) {
    // 根据menuId获取关联数据表
    window._http.post('/metadata/ods/bindedTable', { menuId: menuId }).then(res => {
      if (res.data.code === 0) {
        let SelectedKeys = res.data.data.map(item => `${item.dataSourceId}|${item.tableName}`)
        this.setState({ useTable: res.data.data, currentSelectedKeys: SelectedKeys, selectedKeys: SelectedKeys })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    })
  }
  renderMenuUsed () {
    // 生成关联数据表
    return this.state.useTable.map(item => <TreeNode
      title={<div className={`treeItem ${item.masterFlag ? 'treeItemPrimary' : ''}`}>{`${item.tableName}（`}<Ellipsis style={{ maxWidth: '80px' }} content={item.comment} />）{this.renderPrimaryButton(item)}</div>}
      key={`${item.dataSourceId}|${item.tableName}`} />
    )
  }
  renderPrimaryButton (node) {
    const hasPrimary = this.state.useTable.some(item => item.masterFlag)
    if (!hasPrimary) {
      return <Tooltip placement='top' title='设为主表'><Button size='small' type='dashed' shape='circle' icon='cluster' onClick={($event) => this.setTablePrimary($event, node)} /></Tooltip>
    }
    if (hasPrimary && node.masterFlag) {
      return <Tooltip placement='top' title='取消主表'><Button size='small' type='dashed' shape='circle' icon='disconnect' onClick={($event) => this.cancelTablePrimary($event, node)} /></Tooltip>
    }
    return ''
  }
  setTablePrimary = (e, node) => {
    e.stopPropagation()
    const formData = {
      'dataSourceId': node.dataSourceId,
      'menuId': this.state.menuId,
      'tableName': node.tableName
    }
    utils.loading.show()
    window._http.post('/metadata/ods/setMainTable', formData).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success('设置成功！')
        this.queryMenuUsed(this.state.menuId)
      } else {
        window._message.error(res.data.msg || '设置失败')
      }
    }).catch(() => utils.loading.hide())
  }
  cancelTablePrimary = (e, node) => {
    e.stopPropagation()
    const formData = {
      'dataSourceId': node.dataSourceId,
      'menuId': this.state.menuId,
      'tableName': node.tableName
    }
    utils.loading.show()
    window._http.post('/metadata/ods/unsetMainTable', formData).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success('取消成功！')
        this.queryMenuUsed(this.state.menuId)
      } else {
        window._message.error(res.data.msg || '取消失败')
      }
    }).catch(() => utils.loading.hide())
  }
  selectTable = (selectedKeys) => {
    // 选择关联数据表
    console.log(selectedKeys)
    if (selectedKeys.length > 0 && selectedKeys[0] !== this.state.selectTable) {
      this.setState({ selectTable: selectedKeys[0] })
      const [dataSourceId, tableName] = selectedKeys[0].split('|')
      this.dataSourceId = dataSourceId
      this.tableName = tableName
      this.queryTableInfo(dataSourceId, tableName)
      this.queryTableFields(dataSourceId, tableName)
    }
  }
  queryTableInfo (dataSourceId, tableName) {
    window._http.post('/metadata/ods/tableMeta', { dataSourceId, tableName }).then(res => {
      if (res.data.code === 0) {
        this.setState({ selectTableInfo: res.data.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    })
  }
  queryTableFields (dataSourceId, tableName) {
    this.setState({ fieldLoading: true })
    window._http.post('/metadata/targetField/compareFieldByName', { dataSourceId, tableName, menuId: this.state.menuId }).then(res => {
      this.setState({ fieldLoading: false })
      if (res.data.code === 0) {
        this.setState({ selectTableFields: res.data.data.dataList })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(() => this.setState({ fieldLoading: false }))
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { this.searchInput = node }}
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type='primary'
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon='search'
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type='search' style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => this.findKeys(record, dataIndex).toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: (text, record) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    )
  })
  findKeys = (obj, keys) => keys.split('.').reduce((sum, now) => sum ? sum[now] : {}, obj)
  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  renderColor = (status) => {
    const tagMap = {
      0: '',
      3: 'green',
      4: 'red'
    }
    return tagMap[status]
  }

  onClose = () => {
    this.setState({
      drawerVisible: false,
      selectedKeys: this.state.currentSelectedKeys
    })
  }

  submit = () => {
    // 提交关联
    // 深拷贝选中的字段列表
    let data = deepClone(this.state.selectedKeys)
    data = data.map(item => {
      const [ dataSourceId, tableName ] = item.split('|')
      return {
        dataSourceId,
        tableName
      }
    })
    this.setState({ submitLoading: true })
    window._http.post('/metadata/ods/menuBind', { menuId: this.state.menuId, reqs: data }).then(res => {
      this.setState({ submitLoading: false })
      if (res.data.code === 0) {
        window._message.success('保存成功')
        this.queryMenuUsed(this.state.menuId)
        this.setState({
          drawerVisible: false,
          submitLoading: false
        })
      } else {
        window._message.error(res.data.msg || '保存失败')
      }
    }).catch(() => this.setState({ submitLoading: false }))
  }

  addTable = () => {
    this.setState({
      drawerVisible: true
    })
  }

  onLoadData = treeNode => new Promise((resolve) => {
    // 点击数据表获取数据表的字段列表
    if (treeNode.props.children) {
      resolve()
      return
    }
    const { dataSourceId, tableName } = treeNode.props.dataRef
    window._http.post('/metadata/ods/tableFieldMeta', { dataSourceId, tableName }).then(res => {
      if (res.data.code === 0) {
        treeNode.props.dataRef.children = res.data.data
        this.setState({
          allTable: [...this.state.allTable]
        })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
      resolve()
    }).catch(res => {
      resolve()
    })
  })

  renderTreeNodes = data => data.map((item) => {
    // 生成数据库列表
    // if (item.children) {
    //   return (
    //     <TreeNode title={`${item.tableName}（${item.dbName}）`} key={`${item.dataSourceId}|${item.tableName}`} dataRef={item}>
    //       {this.renderFieldTreeNodes(item.children, item)}
    //     </TreeNode>
    //   )
    // }
    return <TreeNode title={`${item.tableName}（${item.dbName}）`} key={`${item.dataSourceId}|${item.tableName}`} dataRef={item} />
  })

  renderFieldTreeNodes = (data, parent) => data.map((item) => {
    // 生成数据列类别
    return <TreeNode title={item.name} key={`${parent.dataSourceId}|${parent.tableName}|${item.name}|${item.id}`} dataRef={item} isLeaf />
  })

  selectField = (selectedKeys) => {
    console.log(selectedKeys)
    this.setState({ selectedKeys })
  }

  handleOnSearch = e => {
    const value = e.target.value
    this.handleFilter(value)
  }

  onDrawerFilterChange = value => {
    const treeData = this._allTable.filter(item => item.tableName.includes(value))
    this.setState({ allTable: treeData })
  }

  unbindField = (record) => {
    const data = {
      fieldName: record.name,
      menuId: this.state.menuId,
      tableName: this.tableName,
      dataSourceId: this.dataSourceId
    }
    utils.loading.show()
    window._http.post('/metadata/ods/menuUnBind', data).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success('移除成功')
        this.queryTableFields(data.dataSourceId, data.tableName)
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      utils.loading.hide()
    })
  }

  renderTargetPopover = (data) => {
    return (
      <div className='Popover'>
        <p>字段类型：{data.targetFieldType}</p>
        <p>是否主键：{data.targetFieldPri ? '是' : '否'}</p>
        <p>值是否为空：{data.targetFieldNullable ? '是' : '否'}</p>
        <p>字段注释：{data.targetFieldComment}</p>
        <p>字段长度：{data.targetFieldSize}</p>
        <p>字段小数位：{data.targetDecimalDigits}</p>
        <p>默认值：{data.targetDefaultValue}</p>
      </div>
    )
  }

  render () {
    const columns = [{
      title: '字段名称',
      dataIndex: 'targetFieldName',
      key: 'targetFieldName',
      width: '20%',
      ...this.getColumnSearchProps('targetFieldName')
    }, {
      title: '注释',
      dataIndex: 'targetField.targetFieldComment',
      key: 'targetField.targetFieldComment',
      width: '20%',
      ...this.getColumnSearchProps('targetField.targetFieldComment')
    }, {
      title: '类型（长度,小数位）',
      dataIndex: 'targetField.targetFieldType',
      key: 'targetField.targetFieldType',
      ...this.getColumnSearchProps('targetField.targetFieldType'),
      render: (text, record) => {
        return record.targetField ? `${record.targetField.targetFieldType}(${record.targetField.targetFieldSize}, ${record.targetField.targetDecimalDigits})` : '--'
      }
    }, {
      title: '其他信息',
      dataIndex: 'targetField',
      key: 'targetField',
      render: (text) => (
        <>
          {
            text ? <Popover content={this.renderTargetPopover(text)} title='详情'>
              详情<Icon type='exclamation-circle' style={{ marginLeft: '5px', color: '#1890ff' }} />
            </Popover> : '--'
          }
        </>
      )
    }, {
      title: '当前状态',
      dataIndex: 'currentToTarget',
      key: 'currentToTarget',
      render: (text, record) => <Tag color={this.renderColor(text)}>{record.currentToTargetTxt}</Tag>
    }]
    return (
      <div className='BusinessMeta'>
        <Row gutter={8} style={{ height: '100%' }}>
          <Col span={4} style={{ height: '100%' }}>
            <Card
              type='inner'
              title='业务模块'
              className='BusinessMetaMenu'
              loading={this.state.menuLoading}
            >
              <Menu
                className='sub-menu'
                mode='inline'
                inlineIndent={12}
                onClick={this.menuClick}
              >
                {this.renderMenu(this.state.menu)}
              </Menu>
            </Card>
          </Col>
          <Col span={20} style={{ height: '100%' }}>
            <Card
              type='inner'
              className='BusinessMetaMenu'
              title={`业务源数据${this.state.menuName && ('(' + this.state.menuName + ')')}`}
              extra={this.state.menuId && <a onClick={this.addTable}><Icon type='plus' />关联表</a>}
            >
              {
                this.state.useTable.length ? <Row>
                  <Col span={7}>
                    {
                      <Tree
                        className='useTable'
                        showLine
                        onSelect={this.selectTable}
                      >
                        {this.renderMenuUsed()}
                      </Tree>
                    }
                  </Col>
                  <Col span={17}>
                    {
                      this.state.selectTable ? <Tabs type='card'>
                        <TabPane tab='表字段' key='1'>
                          <Table rowKey='targetFieldName' pagination={{ pageSize: 10 }} columns={columns} dataSource={this.state.selectTableFields} size='small' loading={this.state.fieldLoading} />
                        </TabPane>
                        <TabPane tab='表信息' key='2'>
                          <div>
                            <p>数据库名：<span>{this.state.selectTableInfo.dbName}</span></p>
                            <p>数据表名：<span>{this.state.selectTableInfo.tableName}</span></p>
                            <p>注释：<span>{this.state.selectTableInfo.comment}</span></p>
                          </div>
                        </TabPane>
                      </Tabs> : <Empty description='请选择数据表' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                  </Col>
                </Row> : <Empty description='暂无关联数据表' image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }

            </Card>
          </Col>
        </Row>
        <Drawer
          title='新增表'
          width={400}
          onClose={this.onClose}
          visible={this.state.drawerVisible}
        >
          <h2 style={{ fontSize: '14px', color: '#666' }}>选择数据字段</h2>
          <Search style={{ marginBottom: 8 }} placeholder='搜索表名' onChange={this.handleOnSearch} />
          {
            this.state.allTable.length > 0 ? <Tree
              checkable
              checkedKeys={this.state.selectedKeys}
              onCheck={this.selectField}
              // expandedKeys={this.state.expandedKeys}
              selectedKeys={this.state.selectedKeys}
              ref={this.treeRef}
            // loadData={this.onLoadData}
            >
              {this.renderTreeNodes(this.state.allTable)}
            </Tree> : <Empty description='暂无数据' image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }

          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right'
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.submit} loading={this.state.submitLoading} type='primary'>
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default BusinessMeta
