import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Divider, Button, Input, Modal, Form, Select, Switch } from 'antd'
const { Column } = Table
const { Search } = Input

class Metadata extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false
    }
  }
  componentDidMount () {
    this.data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }]
    this.setState({ data: this.data })
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.name.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  handleOk = () => {
    this.setState({ visible: false })
  }
  render () {
    return (
      <div className='User'>
        <Card title='源数据库管理'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Button type='primary' onClick={() => this.setState({ visible: true })}>
              新增
            </Button>
            <Search
              className='fr'
              placeholder='源数据库名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table dataSource={this.state.data}>
            <Column
              title='Name'
              dataIndex='name'
              key='name'
            />
            <Column
              title='Age'
              dataIndex='age'
              key='age'
            />
            <Column
              title='Address'
              dataIndex='address'
              key='address'
            />
            <Column
              title='Action'
              key='action'
              render={(text, record) => (
                <span>
                  <a href='javascript:;'>修改</a>
                  <Divider type='vertical' />
                  <a href='javascript:;'>删除</a>
                </span>
              )}
            />
          </Table>
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

const formItemSettings = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
}

class AddMetadata extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        this.props.handleBack()
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label='标题'
          {...formItemSettings}
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入标题' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='数据库名'
          {...formItemSettings}
        >
          {getFieldDecorator('dbName', {
            rules: [{ required: true, message: '请输入数据库名' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='数据库描述'
          {...formItemSettings}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='数据库类型'
          {...formItemSettings}
        >
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: '请选择数据库类型' }]
          })(
            <Select
              placeholder='请选择数据库类型'
              onChange={this.handleSelectChange}
            >
              <Select.Option value='mysql'>mysql</Select.Option>
              <Select.Option value='sqlserver'>sqlserver</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label='链接地址'
          {...formItemSettings}
        >
          {getFieldDecorator('jdbcUrl', {
            rules: [{ required: true, message: '请输入链接地址' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='用户名'
          {...formItemSettings}
        >
          {getFieldDecorator('user', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='密码'
          {...formItemSettings}
        >
          {getFieldDecorator('jdbcUrl', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemSettings}
          label='状态'
        >
          {getFieldDecorator('switch', { valuePropName: 'checked', initialValue: true })(
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

export default Metadata
