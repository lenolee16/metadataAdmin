import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
// import { Card, Table, Button, Input, Form, Modal, Tag, Switch, Popover, Icon } from 'antd'
import { Card, Table, Button, Input, Form, Modal, Tag, Switch } from 'antd'
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
      filteredInfo: null
    }
  }
  componentDidMount () {
    // 拿到上个页面传递过来的源id
    this.setState({ dataSourceId: this.props.match.params.databaseId })
    this.initData()
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
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters
    })
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
          <Table bordered rowKey='currentTableId' onChange={this.handleTableChange} dataSource={this.state.data} loading={this.state.loading}>
            <Column
              title='数据表名称'
              dataIndex='tableName'
              key='tableName'
            />
            <ColumnGroup title='目标版本' >
              {/* <Column
                title='目标版本号'
                dataIndex='targetVersionNo'
                key='targetVersionNo'
                render={(text, values) => (
                  <>
                    {
                      text ? <Popover content={this.renderPopover(values, 'targetComment')} title='详情'>
                        {values.targetVersionNo}<Icon type='exclamation-circle' style={{ marginLeft: '5px', color: '#1890ff' }} />
                      </Popover> : '-'
                    }
                  </>
                )}
              /> */}
              <Column
                title='目标注释'
                dataIndex='targetComment'
                key='targetComment'
                width='200px'
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 150 }} />
                )}
              />
            </ColumnGroup>
            <ColumnGroup title='当前快照与目标版本对比' >
              {/* <Column
                title='当前版本号'
                dataIndex='currentVersionNo'
                key='currentVersionNo'
                render={(text, values) => (
                  <>
                    {
                      text ? <Popover content={this.renderPopover(values, 'currentComment')} title='详情'>
                        {values.currentVersionNo}<Icon type='exclamation-circle' style={{ marginLeft: '5px', color: '#1890ff' }} />
                      </Popover> : '-'
                    }
                  </>
                )}
              /> */}
              <Column
                title='当前注释'
                dataIndex='currentComment'
                key='currentComment'
                width='200px'
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 150 }} />
                )}
              />
              <Column
                title='状态'
                dataIndex='currentToTarget'
                key='currentToTarget'
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
              {/* <Column
                title='上一次版本号'
                dataIndex='compareVersionNo'
                key='compareVersionNo'
                render={(text, values) => (
                  <>
                    {
                      text ? <Popover content={this.renderPopover(values, 'compareComment')} title='详情'>
                        {values.compareVersionNo}<Icon type='exclamation-circle' style={{ marginLeft: '5px', color: '#1890ff' }} />
                      </Popover> : '-'
                    }
                  </>
                )}
              /> */}
              <Column
                title='上一次注释'
                dataIndex='compareComment'
                key='compareComment'
                width={200}
                render={(text) => (
                  <Ellipsis content={text} style={{ width: 150 }} />
                )}
              />
              <Column
                title='状态'
                dataIndex='compareToCurrent'
                key='compareToCurrent'
                filters={filters}
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
              width='200'
              render={(text, record) => (
                  <>
                    <Button type='primary' ghost icon='search' style={{ marginRight: '5px', marginBottom: '5px' }} onClick={() => this.examine(record)} >查看</Button>
                    <Button type='primary' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '5px', marginBottom: '5px' }}>修改</Button>
                    <Button type='danger' disabled={record.currentToTarget === 0} ghost icon='sync' onClick={() => this.sync(record)}>同步</Button>
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
    const { targetTableId, status } = data
    const targetTableComment = data.targetComment || ''
    this.props.form.setFieldsValue({ targetTableId, targetTableComment, status })
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
