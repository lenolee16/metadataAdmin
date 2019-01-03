import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Divider, Button, Input, Modal, Form, Select, Switch, Popconfirm } from 'antd'
const { Column } = Table
const { Search } = Input

class Metadata extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      amendVisible: false,
      isEdit: false
    }
  }
  componentDidMount () {
    this.data = [{
      id: '1',
      title: '所属',
      dbName: 'John Brown',
      des: '描述',
      type: '类型',
      jdbcUrl: '链接',
      userName: '用户名',
      pw: '密码'
    }, {
      id: '2',
      title: '所属',
      dbName: 'Jim Green',
      des: '描述',
      type: '类型',
      jdbcUrl: '链接',
      userName: '用户名',
      pw: '密码'
    }, {
      id: '3',
      title: '所属',
      dbName: 'Joe Black',
      des: '描述',
      type: '类型',
      jdbcUrl: '链接',
      userName: '用户名',
      pw: '密码'
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
    this.setState({ amendVisible: false })
  }
  handleOk = (data) => {
    this.setState({ visible: false })
    this.setState({ amendVisible: false })
    console.log(data)
    // this.setState({ data: Object.assign(this.data, data) })
    data.id = 10
    console.log(data)
    console.log(this.data)
    this.setState({ data: [...this.data, data] })
  }
  amend = (record) => {
    console.log(record)
    // this.props.form.setFieldsValue({
    //   note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
    // })
    console.log(this.refs.wrappedForm)
    this.setState({ amendVisible: true })
  }
  handleDelete = (key) => {
    console.log('删除这条数据' + key)
    const data = [...this.state.data]
    console.log(data[0])
    this.setState({ data: data.filter(item => item.key !== key) })
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
              title='标题'
              dataIndex='title'
              key='title'
            />
            <Column
              title='数据库名称'
              dataIndex='dbName'
              key='dbName'
            />
            <Column
              title='描述'
              dataIndex='des'
              key='des'
            />
            <Column
              title='类型'
              dataIndex='type'
              key='type'
            />
            <Column
              title='链接地址'
              dataIndex='jdbcUrl'
              key='jdbcUrl'
            />
            <Column
              title='用户名'
              dataIndex='userName'
              key='userName'
            />
            <Column
              title='密码'
              dataIndex='pw'
              key='pw'
            />
            <Column
              title='状态'
              dataIndex='state'
              key='state'
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                <span>
                  {/* <a href='javascript:;' onClick={() => this.setState({ amendVisible: true })}>修改</a> */}
                  <a href='javascript:;' onClick={() => this.amend(record)}>修改</a>
                  <Divider type='vertical' />
                  <Popconfirm title='确定删除?' onConfirm={() => this.handleDelete(record.id)}>
                    <a href='javascript:;'>删除</a>
                  </Popconfirm>
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
        <Modal
          title='修改'
          width='600px'
          visible={this.state.amendVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <WrappedForm ref='wrappedForm' handleBack={this.handleOk} isEdit={this.isEdit} />
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
      console.log(!err)
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
          {getFieldDecorator('des', {
            rules: [{ required: false, message: '请输入数据库描述' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='数据库类型'
          {...formItemSettings}
        >
          {getFieldDecorator('type', {
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
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='密码'
          {...formItemSettings}
        >
          {getFieldDecorator('pw', {
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
  handleBack: PropTypes.func,
  isEdit: PropTypes.bool
}

const WrappedForm = Form.create()(AddMetadata)

export default Metadata
