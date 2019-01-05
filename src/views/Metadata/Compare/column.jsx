import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Input, Form, Switch, Modal, Table, Tag } from 'antd'
import utils from 'utils'

const { Search } = Input
const { Column, ColumnGroup } = Table

class MetadataColumnList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      pagination: {
        pageSize: 10,
        current: 1
      },
      formDataId: null,
      loading: false
    }
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.fieldName.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  componentDidMount () {
    this.queryData()
  }
  queryData () {
    const { params: { databaseId } } = this.props.match
    this.setState({ loading: true })
    window._http.post('/metadata/targetField/compareField', { targetTableId: databaseId }).then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        this.data = res.data.data.dataList
        const pager = this.state.pagination
        pager.total = this.data.length
        this.setState({ pagination: pager })
        this.partPage(1)
      }
    }).catch(() => {
      this.setState({ loading: false })
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.partPage(pager.current)
  }
  partPage = (current) => {
    this.setState({ data: this.data.slice((current - 1) * this.state.pagination.pageSize, current * this.state.pagination.pageSize) })
  }
  handleCancel = () => {
    this.setState({ visible: false, formDataId: null })
    this.form.props.form.resetFields()
  }
  handleOk = () => {
    const pager = this.state.pagination
    pager.current = 1
    this.setState({ visible: false, formDataId: null, pagination: pager })
    this.queryData()
  }
  edit = (data) => {
    this.setState({ visible: true, formDataId: data.targetFieldId })
    setTimeout(() => {
      this.form.setForm(data)
    }, 0)
  }
  sync = (data) => {
    utils.loading.show()
    window._http.post('/metadata/sourceField/sync', { targetFieldId: data.targetFieldId }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success('同步成功！')
      } else {
        window._message.success('同步失败！')
      }
    }).catch(res => {
      utils.loading.hide()
    })
  }
  renderColor = (status) => {
    const tagMap = {
      0: '',
      3: 'green',
      4: 'red'
    }
    return tagMap[status]
  }
  render () {
    return (
      <div className='MetadataSearch'>
        <Card title='数据列'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Button type='primary' onClick={() => this.setState({ visible: true })}>
              新增
            </Button>
            <Search
              className='fr'
              placeholder='字段名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table rowKey='fieldName' bordered pagination={this.state.pagination} dataSource={this.state.data} loading={this.state.loading} onChange={this.handleTableChange}>
            <Column
              title='字段名称'
              dataIndex='fieldName'
              key='fieldName'
            />
            <ColumnGroup title='目标'>
              <Column
                title='目标注释'
                dataIndex='targetComment'
                key='targetComment'
              />
            </ColumnGroup>
            <ColumnGroup title='当前快照'>
              <Column
                title='当前注释'
                dataIndex='currentComment'
                key='currentComment'
              />
              <Column
                title='当前状态'
                dataIndex='currentToTarget'
                key='currentToTarget'
                render={(text, record) => (
                  <>
                    <Tag color={this.renderColor(text)}>{record.currentToTargetTxt}</Tag>
                  </>
                )}
              />
            </ColumnGroup>
            <ColumnGroup title='上一次快照'>
              <Column
                title='上一次注释'
                dataIndex='compareComment'
                key='compareComment'
              />
              <Column
                title='上一次状态'
                dataIndex='compareToCurrent'
                key='compareToCurrent'
                render={(text, record) => (
                  <>
                    <Tag color={this.renderColor(text)}>{record.currentToTargetTxt}</Tag>
                  </>
                )}
              />
            </ColumnGroup>
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                <>
                  <Button type='primary' icon='edit' ghost style={{ marginRight: '10px' }} onClick={() => this.edit(record)}>修改</Button>
                  <Button type='danger' icon='sync' ghost onClick={(record) => this.sync(record)}>同步</Button>
                </>
              )}
            />
          </Table>
        </Card>
        <Modal
          title={this.state.formDataId === null ? '新增' : '修改'}
          width='600px'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <WrappedForm handleBack={this.handleOk} wrappedComponentRef={(form) => { this.form = form }} formDataId={this.state.formDataId} />
        </Modal>
      </div>
    )
  }
}

MetadataColumnList.propTypes = {
  match: PropTypes.object
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
        if (this.props.formDataId !== null) {
          window._http.post(`/metadata/targetField/update`, { targetFieldId: this.props.formDataId, ...values }).then(res => {
            if (res.data.code === 0) {
              this.props.form.resetFields()
              this.props.handleBack()
              window._message.success('修改成功！')
            } else {
              window._message.error(res.data.msg || '修改失败')
            }
          })
        } else {
          window._http.post(`/metadata/targetField/add`, values).then(res => {
            if (res.data.code === 0) {
              this.props.form.resetFields()
              this.props.handleBack()
              window._message.success('添加成功！')
            } else {
              window._message.error(res.data.msg || '添加失败')
            }
          })
        }
      }
    })
  }
  setForm = (data) => {
    const { targetFieldName, targetFieldType, targetFieldComment, targetFieldSize, targetDefaultValue, status } = data
    this.props.form.setFieldsValue({
      targetFieldName, targetFieldType, targetFieldComment, targetFieldSize, targetDefaultValue, status: !!status
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label='字段名'
          {...formItemSettings}
        >
          {getFieldDecorator('targetFieldName', {
            rules: [{ required: true, message: '请输入字段名' }]
          })(
            <Input disabled={this.props.formDataId !== null} />
          )}
        </Form.Item>
        <Form.Item
          label='字段类型'
          {...formItemSettings}
        >
          {getFieldDecorator('targetFieldType', {
            rules: [{ required: true, message: '请输入字段类型' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='字段注释'
          {...formItemSettings}
        >
          {getFieldDecorator('targetFieldComment', {
            rules: [{ required: true, message: '请输入字段注释' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='字段长度'
          {...formItemSettings}
        >
          {getFieldDecorator('targetFieldSize', {
            rules: [{ required: true, message: '请输入字段长度' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='默认值'
          {...formItemSettings}
        >
          {getFieldDecorator('targetDefaultValue', {
            rules: [{ required: true, message: '请输入默认值' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemSettings}
          label='状态'
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
  handleBack: PropTypes.func,
  formDataId: PropTypes.any
}

const WrappedForm = Form.create()(AddMetadata)

export default MetadataColumnList
