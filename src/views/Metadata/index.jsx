import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Button, Input, Modal, Form, Select, Switch } from 'antd'
import utils from 'utils'

const { Column } = Table
const { Search } = Input
class Metadata extends PureComponent {
  constructor (props) {
    super(props)
    this.wrappedForm = React.createRef()
    this.state = {
      data: [],
      visible: false,
      loading: false,
      // pagination: {
      //   pageSize: 10,
      //   current: 1
      // },
      isAdd: true
    }
  }
  componentDidMount () {
    this.data = [{
      dataSourceId: '1',
      title: 'title',
      dbName: 'dbName',
      description: 'description',
      dbType: 'mysql',
      jdbcUrl: 'jdbcUrl',
      status: 1,
      user: 'user',
      password: 'password'
    }, {
      dataSourceId: '2',
      title: '所属',
      dbName: 'Jim Green',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 1,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '3',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '4',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '5',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '6',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '7',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '8',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '9',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '10',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '11',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '12',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }, {
      dataSourceId: '13',
      title: '所属',
      dbName: 'Joe Black',
      description: '描述',
      dbType: 'mysql',
      jdbcUrl: '链接',
      status: 0,
      user: '用户名',
      password: '密码'
    }]
    this.setState({ data: this.data })
    // this.initData()
    // this.wrappedForm.current.focusTextInput()
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.dbName.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  // 初始化table
  initData = () => {
    this.setState({ loading: true })
    window._http.post('/metadata/dataSource/list').then(res => {
      if (res.data.code === 0) {
        this.setState({
          data: res.data.data,
          loading: false
        })
        // const pager = this.state.pagination
        // pager.total = this.data.length
        // this.setState({ pagination: pager })
        // this.partPage(1)
      } else {
        this.setState({ loading: false })
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  // partPage = (current) => {
  //   this.setState({ data: this.data.slice((current - 1) * this.state.pagination.pageSize, current * this.state.pagination.pageSize) })
  // }
  // handleTableChange = (pagination, filters, sorter) => {
  //   console.log(pagination, filters, sorter)
  //   const pager = { ...this.state.pagination }
  //   pager.current = pagination.current
  //   this.setState({
  //     pagination: pager
  //   })
  //   this.partPage(pager.current)
  // }
  handleCancel = () => {
    this.setState({ visible: false })
    this.form.props.form.resetFields()
  }
  handleOk = (values) => {
    this.setState({
      visible: false
    })
    if (values.dataSourceId !== 'undifined') {
      values.status = values.status ? 1 : 0
      window._http.post('/metadata/dataSource/update', values).then(res => {
        if (res.data.code === 0) {
          this.initData()
          window._message.success('修改成功！')
        } else {
          window._message.error(res.data.msg || '修改失败！')
        }
      }).catch((err) => {
        console.log(err)
      })
    } else {
      values.status = values.status ? 1 : 0
      window._http.post('/metadata/dataSource/add', values).then(res => {
        if (res.data.code === 0) {
          this.initData()
          window._message.success('新增成功！')
        } else {
          window._message.error(res.data.msg || '修改失败！')
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
  // 点击修改按钮
  amend = (data) => {
    this.setState({ visible: true, isAdd: false })
    setTimeout(() => {
      this.form.setData(data)
    }, 0)
  }
  // 测试数据源
  testFnc = (data) => {
    utils.loading.show()
    window._http.post('/metadata/dataSource/test', { dataSourceId: data.dataSourceId }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._notification.success('请求成功')
      } else {
        window._notification.error('请求失败')
      }
    }).catch(() => {
      utils.loading.hide()
    })
  }
  render () {
    return (
      <div className='User'>
        <Card title='源数据库管理'>
          <div className='clearfix' style={{ marginBottom: 12 }}>
            <Button type='primary' onClick={() => this.setState({ visible: true, isAdd: true })}>
              新增
            </Button>
            <Search
              className='fr'
              placeholder='源数据库名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table rowKey='dataSourceId' dataSource={this.state.data} loading={this.state.loading}>
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
              dataIndex='description'
              key='des'
            />
            <Column
              title='数据库类型'
              dataIndex='dbType'
              key='type'
            />
            <Column
              title='链接地址'
              dataIndex='jdbcUrl'
              key='jdbcUrl'
            />
            <Column
              title='用户名'
              dataIndex='user'
              key='user'
            />
            <Column
              title='密码'
              dataIndex='password'
              key='password'
              render={() => '*****'}
            />
            <Column
              title='状态'
              dataIndex='status'
              key='state'
              render={(v) => v.status ? 1 : 0}
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                <>
                  <Button type='primary' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '10px' }}>修改</Button>
                  <Button type='primary' ghost icon='file-sync' style={{ color: '#4eca6a', borderColor: '#4eca6a' }} onClick={() => this.testFnc(record)}>测试</Button>
                </>
              )}
            />
          </Table>
        </Card>
        <Modal
          title={this.state.isAdd ? '新增' : '修改'}
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
        this.props.form.resetFields()
      }
    })
  }
  setData (data) {
    console.log(data)
    data.status = !!data.status
    this.props.form.setFieldsValue(data)
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label='数据源Id'
          {...formItemSettings}
        >
          {getFieldDecorator('dataSourceId')(
            <Input disabled />
          )}
        </Form.Item>
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
          {getFieldDecorator('description', {
            rules: [{ required: false, message: '请输入数据库描述' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='数据库类型'
          {...formItemSettings}
        >
          {getFieldDecorator('dbType', {
            rules: [{ required: true, message: '请选择数据库类型' }]
          })(
            <Select
              placeholder='请选择数据库类型'
              onChange={this.handleSelectChange}
            >
              <Select.Option value='1'>mysql</Select.Option>
              <Select.Option value='2'>sqlserver</Select.Option>
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
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
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
  handleBack: PropTypes.func
}

const WrappedForm = Form.create()(AddMetadata)

export default Metadata
