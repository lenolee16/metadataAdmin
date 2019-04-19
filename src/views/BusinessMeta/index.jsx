import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Col, Menu, Tree, Table, Input, Button, Icon, Tabs, Drawer, Empty, Tag, Popover, Dropdown, Modal, Divider, Select, AutoComplete, Tooltip } from 'antd'
import Highlighter from 'react-highlight-words'
import { deepClone, debounce, platChildrenTree, getAllPath } from 'utils/utils'
import utils from 'utils/'
import Ellipsis from 'components/Ellipsis'

import './index.less'

const SubMenu = Menu.SubMenu
const { TreeNode } = Tree
const { TabPane } = Tabs
const { Search } = Input

class LinkNode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      sourceList: [],
      targetList: []
    }
  }
  getList (source, target, data) {
    if (!source) {
      return
    }
    const sourceData = {
      dataSourceId: source.dataSourceId,
      menuId: this.props.menuId,
      tableName: source.tableName
    }
    const targetData = {
      dataSourceId: target.dataSourceId,
      menuId: this.props.menuId,
      tableName: target.tableName
    }
    if (data) {
      this.setState({
        data: data.map(item => {
          return {
            sourceFieldName: item.fieldName,
            targetFieldName: item.foreignfieldName,
            id: item.id
          }
        })
      })
    } else {
      this.setState({ data: [{ sourceFieldName: '', targetFieldName: '', _edit: true }] })
    }
    window._http.post('/metadata/ods/tableFieldMeta', sourceData).then(res => {
      if (res.data.code === 0) {
        this.setState({ sourceList: res.data.data })
      }
    })
    window._http.post('/metadata/ods/tableFieldMeta', targetData).then(res => {
      if (res.data.code === 0) {
        this.setState({ targetList: res.data.data })
      }
    })
  }
  handleChange = (value, index, key) => {
    let data = [...this.state.data]
    data[index][key] = value
    this.setState({ data: data })
  }
  addRow = () => {
    this.setState((prevState) => ({
      data: prevState.data.concat({ sourceFieldName: '', targetFieldName: '', _edit: true })
    }))
  }
  edit = (index) => {
    let data = [...this.state.data]
    data[index]._edit = true
    this.setState({ data: data })
  }
  save = (record, index) => {
    if (!record.sourceFieldName) {
      return window._message.error('请选择从表字段')
    }
    if (!record.targetFieldName) {
      return window._message.error('请选择主表字段')
    }
    const formData = {
      dataSourceId: this.props.source.dataSourceId,
      fieldName: record.sourceFieldName,
      id: record.id,
      menuId: this.props.menuId,
      tableName: this.props.source.tableName,
      foreignTableName: this.props.target.tableName,
      foreignfieldName: record.targetFieldName
    }
    window._http.post(`${record.id ? '/metadata/ods/updateForegeinkey' : '/metadata/ods/setForegeinkey'}`, formData).then(res => {
      if (res.data.code === 0) {
        window._message.success('保存成功')
        let data = [...this.state.data]
        data[index]._edit = false
        data[index].id = record.id || res.data.data
        this.setState({ data: data })
        this.props.fresh()
      } else {
        window._message.error(res.data.msg || '保存失败')
      }
    })
  }
  delete = (record, index) => {
    if (record.id) {
      // 如果存在id则代表保存过，需要请求后再删除
      const formData = {
        dataSourceId: this.props.source.dataSourceId,
        fieldName: record.sourceFieldName,
        id: record.id,
        menuId: this.props.menuId,
        tableName: this.props.source.tableName,
        foreignTableName: this.props.target.tableName,
        foreignfieldName: record.targetFieldName
      }
      window._http.post('/metadata/ods/delForegeinkey', formData).then(res => {
        if (res.data.code === 0) {
          window._message.success('删除成功')
          let data = [...this.state.data]
          data.splice(index, 1)
          this.setState({ data: data })
          this.props.fresh()
        } else {
          window._message.error(res.data.msg || '删除失败')
        }
      })
    } else {
      // 否则可以直接删除该行
      let data = [...this.state.data]
      data.splice(index, 1)
      this.setState({ data: data })
    }
  }
  render () {
    const { modalVisible, source, target, handleModalVisible } = this.props
    return (
      <Modal title='关联数据表字段' destroyOnClose width={900} footer={null} visible={modalVisible} onCancel={handleModalVisible}>
        <p>从表：{source && source.tableName}</p>
        <p>主表：{target && target.tableName}</p>
        <Button size='small' type='primary' icon='plus' onClick={this.addRow}>新增</Button>
        <Table rowKey={(record, index) => `${index}-${record.id}`} pagination={false} dataSource={this.state.data} size='small' style={{ marginTop: '10px' }}>
          <Table.Column key='index' title='序号' width={40} render={(text, record, index) => `${index + 1}`} />
          <Table.Column key='operation' title='操作' width={100} render={(text, record, index) => (<span>
            {
              record._edit ? <a href='javascript:;' onClick={() => this.save(record, index)}>保存</a> : <a href='javascript:;' onClick={() => this.edit(index)}>编辑</a>
            }
            <Divider type='vertical' />
            <a href='javascript:;' onClick={() => this.delete(record, index)}>删除</a>
          </span>)} />
          <Table.Column key='sourceFieldName' width={300} dataIndex='sourceFieldName' title='从表字段' render={(text, record, index) => (<Select style={{ width: '100%' }} showSearch disabled={!record._edit || !!record.id} size='small' value={text} onChange={(value) => this.handleChange(value, index, 'sourceFieldName')}>
            {this.state.sourceList.map(item => <Select.Option key={item.name} value={item.name}>{item.name}({item.comment})</Select.Option>)}
          </Select>)} />
          <Table.Column key='targetFieldName' width={300} dataIndex='targetFieldName' title='主表字段' render={(text, record, index) => (<Select style={{ width: '100%' }} showSearch disabled={!record._edit} size='small' value={text} onChange={(value) => this.handleChange(value, index, 'targetFieldName')}>
            {this.state.targetList.map(item => <Select.Option key={item.name} value={item.name}>{item.name}({item.comment})</Select.Option>)}
          </Select>)} /> />
        </Table>
      </Modal>
    )
  }
}

LinkNode.propTypes = {
  modalVisible: PropTypes.bool,
  source: PropTypes.any,
  target: PropTypes.any,
  menuId: PropTypes.string,
  handleModalVisible: PropTypes.func,
  fresh: PropTypes.func
}

class BusinessMeta extends Component {
  constructor (props) {
    super(props)
    this.handleFilter = debounce(this.onDrawerFilterChange.bind(this), 300)
    this.resizeHaddler = debounce(this.queryTableWrapper.bind(this), 300)
    this.linkNode = React.createRef()
    this.menuData = []
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
      openKeys: [],
      selectTable: '',
      selectTableInfo: {},
      selectTableFields: [],
      selectTableMaster: null,
      scollY: 0,
      visible: false,
      loading: false,
      fieldLoading: false,
      submitLoading: false,
      menuLoading: false,
      drawerVisible: false,
      linkNodeModal: false,
      setNode: null,
      targetNode: null,
      filterMenuText: ''
    }
  }
  componentDidMount () {
    this.queryMenu()
    this.queryAllTables()
    window.addEventListener('resize', this.resizeHaddler)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHaddler)
  }
  queryTableWrapper () {
    const tableWrapper = document.querySelector('.tableWrapper')
    if (tableWrapper) {
      const tableWrapperHeight = tableWrapper.clientHeight
      if (this.state.scollY !== tableWrapperHeight - 100) {
        this.setState({ scollY: tableWrapperHeight - 100 })
      }
    }
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
        this.menuData = platChildrenTree(res.data.data)
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
  filterMenu = (inputValue, option) => {
    return inputValue && this.state.filterMenuText ? option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false
  }
  selectFilterMenu = (value, option) => {
    // 选择搜索菜单
    if (this.state.menuId !== value) {
      const item = option.props.item
      this.setState({
        menuId: item.id,
        menuName: item.name,
        selectTable: '',
        selectTableFields: [],
        selectTableInfo: {},
        selectedKeys: []
      })
      this.queryMenuUsed(item.id)
      const keys = getAllPath(item.id, this.state.menu).map(path => path.id)
      this.setState({ openKeys: keys })
    }
  }
  onOpenChange = (key) => {
    this.setState({ openKeys: key })
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
    const relationshipTree = []
    const list = deepClone(this.state.useTable)
    const renderRelationship = (data) => { // 生成主从关系
      data.forEach(item => { // 生成主表
        if (!item.masters) {
          relationshipTree.push({ ...item, children: [] })
        }
      })
      relationshipTree.forEach(item => { // 生成主表的从表
        data.forEach(i => {
          if (i.tableName !== item.tableName && i.masters) {
            let hasLink = i.masters.some(node => node.foreignTableName === item.tableName)
            if (hasLink) {
              item.children.push(i)
            }
          }
        })
      })
    }
    renderRelationship(list)
    return this.renderMenuNode(relationshipTree)
  }
  renderMenuNode (data) { // 生成表的树状图
    return data.map(item => <TreeNode
      data={item}
      title={<div className={`treeItem`}>{`${item.tableName}（`}<Ellipsis style={{ maxWidth: '80px' }} content={item.comment} />）{this.renderPrimaryButton(item)}</div>}
      key={`${item.dataSourceId}|${item.tableName}`}>
      { item.children && item.children.length ? this.renderMenuNode(item.children) : '' }
    </TreeNode>
    )
  }
  renderPrimaryButton (node) {
    return <span onClick={(e) => e.stopPropagation()}><Dropdown size='small' overlay={this.renderOther(node)}><a className='ant-dropdown-link'>关联<Icon type='down' /></a></Dropdown></span>
  }
  renderOther (node) { // 生成除当前表以外的 下拉表集合
    let nodeList = deepClone(this.state.useTable)
    let _index = nodeList.findIndex(item => item.dataSourceId === node.dataSourceId && item.tableName === node.tableName)
    nodeList.splice(_index, 1)
    return (
      <Menu>
        {
          nodeList.map(item => <Menu.Item key={`${item.dataSourceId}|${item.tableName}`}>
            <a onClick={(e) => this.setTableLink(e, node, item)}>{item.tableName}</a>
          </Menu.Item>
          )
        }
      </Menu>
    )
  }
  setTableLink = (e, node, linkNode) => { // 点击表关联
    const list = node.masters ? node.masters.filter(item => linkNode.dataSourceId === item.dataSourceId && linkNode.tableName === item.foreignTableName) : null
    this.setState({ linkNodeModal: true, setNode: node, targetNode: linkNode }, () => {
      this.linkNode.current.getList(node, linkNode, list) // 获取两个表的字段列表
    })
  }
  handleModalVisible = () => {
    this.setState({ linkNodeModal: false })
  }
  selectTable = (selectedKeys, option) => {
    // 选择关联数据表
    if (selectedKeys.length > 0 && selectedKeys[0] !== this.state.selectTable) {
      const node = option.node.props.data
      this.setState({ selectTable: selectedKeys[0], selectTableMaster: node.masters })
      const [dataSourceId, tableName] = selectedKeys[0].split('|')
      this.dataSourceId = dataSourceId
      this.tableName = tableName
      this.queryTableInfo(dataSourceId, tableName)
      this.queryTableFields(dataSourceId, tableName)
      this.queryTableWrapper()
    }
  }
  queryTableInfo (dataSourceId, tableName) {
    // 查询表详情
    window._http.post('/metadata/ods/tableMeta', { dataSourceId, tableName }).then(res => {
      if (res.data.code === 0) {
        this.setState({ selectTableInfo: res.data.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    })
  }
  queryTableFields (dataSourceId, tableName) {
    // 查询表的字段
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
  getColumnSearchProps = (dataIndex) => ({ // 字段搜索
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
    return <TreeNode title={`${item.tableName}（${item.dbName}）`} key={`${item.dataSourceId}|${item.tableName}`} dataRef={item} />
  })

  renderFieldTreeNodes = (data, parent) => data.map((item) => {
    // 生成数据列类别
    return <TreeNode title={item.name} key={`${parent.dataSourceId}|${parent.tableName}|${item.name}|${item.id}`} dataRef={item} isLeaf />
  })

  selectField = (selectedKeys) => {
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

  unbindField = (record) => { // 移除字段
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
      title: '主表字段',
      key: 'linkFieldName',
      width: '15%',
      render: (text, record) => {
        if (this.state.selectTableMaster) {
          let node = this.state.selectTableMaster.find(item => record.targetFieldName && item.fieldName === record.targetFieldName)
          if (node) {
            return <Tooltip title={node.foreignTableName}>{node.foreignfieldName}</Tooltip>
          }
          return ''
        } else {
          return ''
        }
      }
    }, {
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
    let children = ''
    if (this.state.filterMenuText) {
      children = this.menuData.filter(item => item.menuPath.toUpperCase().indexOf(this.state.filterMenuText.toUpperCase()) !== -1).map(item => <AutoComplete.Option size='small' item={item} key={item.id} value={item.id}>{item.menuPath}</AutoComplete.Option>)
    }
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
              <AutoComplete
                style={{ width: '100%', fontSize: '12px' }}
                size='small'
                defaultActiveFirstOption
                allowClear
                backfill
                placeholder='输入名称搜索'
                defaultOpen={false}
                dropdownStyle={{ fontSize: '12px', lineHeight: '21px' }}
                onSelect={this.selectFilterMenu}
                onSearch={(value) => this.setState({ filterMenuText: value })}
              >
                {children}
              </AutoComplete>
              <div className='sub-menu-container'>
                <Menu
                  className='sub-menu'
                  mode='inline'
                  inlineIndent={12}
                  selectedKeys={[this.state.menuId]}
                  openKeys={this.state.openKeys}
                  onOpenChange={this.onOpenChange}
                  onClick={this.menuClick}
                >
                  {this.renderMenu(this.state.menu)}
                </Menu>
              </div>
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
                this.state.useTable.length ? <Row style={{ height: '100%' }}>
                  <Col span={8} style={{ height: '100%' }}>
                    {
                      <Tree
                        defaultExpandAll
                        className='useTable'
                        showLine
                        onSelect={this.selectTable}
                      >
                        {this.renderMenuUsed()}
                      </Tree>
                    }
                  </Col>
                  <Col span={16} style={{ height: '100%' }} className='tableWrapper'>
                    {
                      this.state.selectTable ? <Tabs type='card'>
                        <TabPane tab='表字段' key='1'>
                          <Table rowKey='targetFieldName' scroll={this.state.scollY ? { y: this.state.scollY } : false} pagination={false} columns={columns} dataSource={this.state.selectTableFields} size='small' loading={this.state.fieldLoading} />
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
        <LinkNode menuId={this.state.menuId} modalVisible={this.state.linkNodeModal} source={this.state.setNode} target={this.state.targetNode} handleModalVisible={this.handleModalVisible} ref={this.linkNode} fresh={() => this.queryMenuUsed(this.state.menuId)} />
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
