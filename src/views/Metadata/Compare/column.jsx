import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Input, Form, Switch, Modal } from 'antd'

const { Search } = Input

class MetadataColumnList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      pagination: {
        pageSize: 10,
        current: 1
      }
    }
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.name.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  componentDidMount () {
    console.log(this.props.match)
  }
  queryData () {
    const { params: { databaseId } } = this.props.match
    window._http.post('/metadata/targetField/compareField', { targetTableId: databaseId }).then(res => {
      if (res.data.code === 0) {
        this.data = res.data.data
        const pager = this.state.pagination
        pager.total = res.data.data.length
        this.setState({ pagination: pager })
        this.partPage(1)
      }
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
  }
  partPage = (current) => {
    this.setState({ data: this.data.splice((current - 1) * this.state.pagination.pageSize, current * this.state.pagination.pageSize) })
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  handleOk = () => {
    this.setState({ visible: false })
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
        </Card>
        <Modal
          title='新增'
          width='600px'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <WrappedForm handleBack={this.handleOk} />
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

class AddMetadata extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleBack(values)
        // this.props.form.resetFields()
      }
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
            rules: [{ required: true, message: '请输入标题' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='字段类型'
          {...formItemSettings}
        >
          {getFieldDecorator('targetFieldType', {
            rules: [{ required: true, message: '请输入数据库名' }]
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
  isEdit: PropTypes.bool
}

const WrappedForm = Form.create()(AddMetadata)

export default MetadataColumnList
