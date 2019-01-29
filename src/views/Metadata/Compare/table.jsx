import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
// import { Card, Table, Button, Input, Form, Modal, Tag, Switch, Popover, Icon } from 'antd'
import { Card, Table, Button, Input, Form, Modal, Tag, Switch, Radio, InputNumber } from 'antd'
import utils from 'utils'
import Ellipsis from 'components/Ellipsis'
const { Column, ColumnGroup } = Table
const { Search } = Input

class MetadataTableList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      // 数据源id
      dataSourceId: null,
      loading: false,
      filteredInfo: null,
      tableHeight: 600
    }
  }
  componentDidMount () {
    // 初始化需要导出的数组
    this.selectData = []
    // 拿到上个页面传递过来的源id
    this.setState({ dataSourceId: this.props.match.params.databaseId })
    this.initData()
    window.addEventListener('resize', this.handleResize.bind(this))
    let tableHeight = window.document.body.clientHeight - 273
    this.setState({ tableHeight })
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }
  // 浏览器窗口大小改变事件
  handleResize = e => {
    let tableHeight = e.target.innerHeight - 313
    this.setState({ tableHeight })
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.tableName.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  // 初始化table
  initData = () => {
    const { params: { databaseId } } = this.props.match
    this.setState({ loading: true })
    window._http.post('/metadata/targetTable/compareTable', { sourceDatabaseId: databaseId }).then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        this.data = res.data.data.dataList
        this.setState({ data: this.data })
      } else {
        window._message.error(res.data.msg)
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  // 同步数据表
  sync = (data) => {
    utils.loading.show()
    window._http.post('/metadata/sourceTable/sync', { sourceTableId: data.currentTableId }).then(res => {
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
  // 查看
  examine = (data) => {
    if (data.targetTable && data.targetTable.targetTableId !== null) {
      this.props.history.push(`/metadataList/${this.state.dataSourceId}/${data.targetTable.targetTableId}`)
    } else {
      window._message.error('目标表id不存在，无法查看！')
    }
  }
  // 修改
  amend = (data) => {
    if (data.targetTable && data.targetTable.targetTableId === null) {
      // return window._message.error('目标表id不存在，无法修改！')
      return false
    }
    this.setState({ visible: true })
    setTimeout(() => {
      this.form.setData(data.targetTable)
    }, 0)
  }
  // 传入表单回调
  handleOk = (data) => {
    this.setState({ visible: false, loading: true })
    data.status = data.status ? 1 : 0
    window._http.post('/metadata/targetTable/update', data).then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        window._message.success(res.data.msg)
        this.initData()
      } else {
        window._message.error(res.data.msg || '修改失败')
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  // 判断颜色 0无变化 1表存在变化 2表属性是否变化 3表字段有无删减 4表字段属性有无变化
  renderColor = (status) => {
    const tagMap = {
      0: '',
      1: 'green',
      2: 'red',
      3: 'blue',
      4: 'blue'
    }
    return tagMap[status]
  }
  // 目标版本号
  renderPopover = (data, str) => {
    return (
      <div className='Popover'>
        <p>表注释：{data[str]}</p>
      </div>
    )
  }
  // 筛选变化
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters
    })
  }
  // 导出选中数据表
  export = () => {
    if (this.selectData.length > 0) {
      console.log(this.selectData)
      const { params: { databaseId } } = this.props.match
      const tableIds = this.selectData.map(item => item.targetTable.targetTableId).join(',')
      utils.loading.show()
      window._http.post('/metadata/sqoop/exportTables', { dataSourceId: databaseId, tableIds }).then(res => {
        utils.loading.hide()
        if (res.data.code === 0) {
          window._message.success(res.data.msg)
          window.open('about:blank').location.href = res.data.data
        } else {
          window._message.error(res.data.msg)
        }
      }).catch(res => {
        utils.loading.hide()
      })
    } else {
      window._message.error('请选择需要导出的表')
    }
  }
  render () {
    const filters = [
      { text: '无变化', value: 0 },
      { text: '表存在变化', value: 1 },
      { text: '表属性变化', value: 2 },
      { text: '表字段有变化', value: 3 },
      { text: '表字段属性有变化', value: 4 }
    ]
    let { filteredInfo } = this.state
    filteredInfo = filteredInfo || {}
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectData = selectedRows
      }
    }
    return (
      <div className='MetadataSearch'>
        <Card title='数据表'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Button type='primary' icon='export' onClick={this.export}>
              导出
            </Button>
            <Search
              className='fr'
              placeholder='数据表名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table
            bordered
            ref='table'
            rowSelection={rowSelection}
            pagination={false}
            className='smallSizeTable'
            scroll={{ y: this.state.tableHeight }}
            rowKey='currentTableId'
            onChange={this.handleTableChange}
            dataSource={this.state.data}
            loading={this.state.loading}>
            <Column
              title='数据表名称'
              dataIndex='tableName'
              key='tableName'
              width={220}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 185 }} />
              )}
            />
            <Column
              title='分库分表（数量）'
              dataIndex='splitFlag'
              key='splitFlag'
              align='center'
              width={90}
              render={
                (text, record) => (record.targetTable ? (record.targetTable.splitFlag ? '是（' + record.targetTable.splitNum + '）' : '否') : '-')
              }
            />
            <ColumnGroup title='目标版本' >
              <Column
                title='目标注释'
                dataIndex='targetComment'
                key='targetComment'
                width={150}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 110 }} />
                )}
              />
            </ColumnGroup>
            <ColumnGroup title='当前快照与目标版本对比' >
              <Column
                title='当前注释'
                dataIndex='currentComment'
                key='currentComment'
                width={150}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 110 }} />
                )}
              />
              <Column
                title='状态'
                dataIndex='currentToTarget'
                key='currentToTarget'
                width={150}
                filters={filters}
                filteredValue={filteredInfo.currentToTarget}
                onFilter={(value, record) => value.includes(`${record.currentToTarget}`)}
                render={(text, record) => (
                  <>
                    <Tag color={this.renderColor(text)}>{record.currentToTargetTxt}</Tag>
                  </>
                )}
              />
            </ColumnGroup>
            <ColumnGroup title='上一次快照与当前快照对比'>
              <Column
                title='上一次注释'
                dataIndex='compareComment'
                key='compareComment'
                width={150}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 110 }} />
                )}
              />
              <Column
                title='状态'
                dataIndex='compareToCurrent'
                key='compareToCurrent'
                width={150}
                filters={filters}
                filteredValue={filteredInfo.compareToCurrent}
                onFilter={(value, record) => value.includes(`${record.compareToCurrent}`)}
                render={(text, record) => (
                  <>
                    <Tag color={this.renderColor(text)}>{record.compareToCurrentTxt}</Tag>
                  </>
                )}
              />
            </ColumnGroup>
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                  <>
                    <Button type='primary' size='small' ghost icon='search' style={{ marginRight: '5px', marginBottom: '5px' }} onClick={() => this.examine(record)} >查看</Button>
                    <Button type='primary' size='small' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '5px', marginBottom: '5px' }}>修改</Button>
                    <Button type='danger' size='small' disabled={record.currentToTarget === 0} ghost icon='sync' onClick={() => this.sync(record)}>同步</Button>
                  </>
              )}
            />
          </Table>
        </Card>
        <Modal
          title='修改'
          width='600px'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <WrappedForm wrappedComponentRef={(form) => { this.form = form }} handleBack={this.handleOk} />
        </Modal>
      </div>
    )
  }
}
MetadataTableList.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}
const formItemSettings = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
}

class AddMetadata extends Component {
  constructor (props) {
    super(props)
    this.splitFlag = 0
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleBack(values)
        this.props.form.resetFields()
      }
    })
  }
  setData (data) {
    data.status = !!data.status
    const { targetTableId, status, splitFlag, splitNum } = data
    const targetTableComment = data.targetComment || ''
    this.splitFlag = splitFlag
    this.props.form.setFieldsValue({ targetTableId, targetTableComment, status, splitFlag, splitNum })
  }
  radioFunc (e) {
    console.log(e.target)
    this.splitFlag = e.target.value
    console.log(this.splitFlag)
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label='数据表Id'
          {...formItemSettings}
        >
          {getFieldDecorator('targetTableId')(
            <Input disabled />
          )}
        </Form.Item>
        <Form.Item
          label='目标版本注释'
          {...formItemSettings}
        >
          {getFieldDecorator('targetTableComment', {
            rules: [{ required: true, message: '请输入目标版本注释' }]
          })(
            // <Input />
            <textarea style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          label='是否分库分表'
          {...formItemSettings}
        >
          {getFieldDecorator('splitFlag', {
            initialValue: 0
          })(
            <Radio.Group onChange={e => this.radioFunc(e)}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item
          label='分库数'
          {...formItemSettings}
        >
          {getFieldDecorator('splitNum', {
            initialValue: 1,
            rules: [{ required: true,
              pattern: new RegExp(/^[1-9]\d*$/, 'g'),
              message: '请输入分库数且为整数' }]
          })(
            <InputNumber min={1 + this.splitFlag} max={this.splitFlag ? 1000 : 1} disabled={!this.splitFlag} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemSettings}
          label='启用状态'
        >
          {getFieldDecorator('status', { valuePropName: 'checked', initialValue: true })(
            <Switch />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 12, offset: 5 }}
        >
          <Button type='primary' htmlType='submit'>
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

AddMetadata.propTypes = {
  form: PropTypes.object,
  handleBack: PropTypes.func
}

const WrappedForm = Form.create()(AddMetadata)
export default MetadataTableList
