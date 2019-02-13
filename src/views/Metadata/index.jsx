import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Table, Button, Input, Modal, Form, Select, Switch } from 'antd'
import utils from 'utils'
import Ellipsis from 'components/Ellipsis'

const { Column } = Table
const { Search } = Input
const mapStateToProps = state => ({
  tableHeightNum: state.tableHeight.tableHeightNum
})
class Metadata extends PureComponent {
  constructor (props) {
    super(props)
    this.wrappedForm = React.createRef()
    this.state = {
      data: [],
      visible: false,
      loading: false,
      formDataId: null,
      tableHeight: 600
    }
  }
  componentDidMount () {
    this.initData()
    setTimeout(() => {
      console.log(this.props.tableHeightNum)
    }, 0)
    window.addEventListener('resize', this.handleResize.bind(this))
    let tableHeight = window.document.body.clientHeight - 263
    this.setState({ tableHeight })
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }
  // 浏览器窗口大小改变事件
  handleResize = e => {
    let tableHeight = e.target.innerHeight - 223
    this.setState({ tableHeight })
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.title.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  // 初始化table
  initData = () => {
    this.setState({ loading: true })
    window._http.post('/metadata/dataSource/list').then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        this.data = res.data.data
        this.setState({ data: this.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  handleCancel = () => {
    this.setState({ visible: false })
    this.form.props.form.resetFields()
  }
  handleOk = (values) => {
    this.setState({
      visible: false
    })
    if (this.state.formDataId !== null) {
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
    this.setState({ visible: true, formDataId: data.dataSourceId })
    setTimeout(() => {
      this.form.setData(data)
    }, 0)
  }
  // 点击复制按钮
  copy = (data) => {
    this.setState({ visible: true, formDataId: null })
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
        window._notification.success({ message: res.data.msg })
      } else {
        window._notification.error({ message: res.data.msg })
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
            <Button type='primary' onClick={() => this.setState({ visible: true, formDataId: null })}>
              新增
            </Button>
            <Search
              className='fr'
              placeholder='源数据库标题'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
          <Table
            rowKey='dataSourceId'
            pagination={false}
            className='smallSizeTable'
            scroll={{ y: this.state.tableHeight }}
            dataSource={this.state.data}
            loading={this.state.loading}>
            <Column
              title='标题'
              dataIndex='title'
              key='title'
              width={125}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 90 }} />
              )}
            />
            <Column
              title='库名'
              dataIndex='dbName'
              key='dbName'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='hive库名'
              dataIndex='hiveDbName'
              key='hiveDbName'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='描述'
              dataIndex='description'
              key='description'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='数据库类型'
              dataIndex='dbType'
              key='dbType'
              width={100}
              render={(v) => {
                if (v === 1) {
                  return 'mysql'
                } else if (v === 2) {
                  return 'sqlserver'
                }
              }}
            />
            <Column
              title='IP端口'
              dataIndex='jdbcUrl'
              key='jdbcUrl'
              width={150}
              render={(text) => (
                text.split('//')[1] ? text.split('//')[1].split(/[/|;]/)[0] : ''
              )}
            />
            <Column
              title='用户名'
              dataIndex='user'
              key='user'
              width={145}
              render={(text) => (
                <Ellipsis content={text} style={{ width: 110 }} />
              )}
            />
            <Column
              title='状态'
              dataIndex='status'
              key='status'
              align='center'
              width={60}
              render={(v) => v ? '启用' : '禁用'}
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                <>
                  <Button type='primary' size='small' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '10px', marginBottom: '5px' }}>修改</Button>
                  <Button type='primary' size='small' ghost icon='copy' onClick={() => this.copy(record)} style={{ marginRight: '10px', marginBottom: '5px' }}>复制</Button>
                  <Button type='primary' size='small' ghost icon='file-sync' style={{ color: '#4eca6a', borderColor: '#4eca6a' }} onClick={() => this.testFnc(record)}>测试</Button>
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
          <WrappedForm formDataId={this.state.formDataId} wrappedComponentRef={(form) => { this.form = form }} handleBack={this.handleOk} />
        </Modal>
      </div>
    )
  }
}
Metadata.propTypes = {
  tableHeightNum: PropTypes.number
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
    data.status = !!data.status
    data.dbType = '' + data.dbType
    const { dataSourceId, title, dbName, hiveDbName, description, dbType, jdbcUrl, password, status, user } = data
    if (this.props.formDataId === null) {
      this.props.form.setFieldsValue({ title, dbName, hiveDbName, description, dbType, jdbcUrl, password, status, user })
    } else {
      this.props.form.setFieldsValue({ dataSourceId, dbName, hiveDbName, title, description, dbType, jdbcUrl, password, status, user })
    }
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        {
          this.props.formDataId && <Form.Item
            label='数据源Id'
            {...formItemSettings}
          >
            {getFieldDecorator('dataSourceId')(
              <Input disabled />
            )}
          </Form.Item>
        }
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
          label='库名'
          {...formItemSettings}
        >
          {getFieldDecorator('dbName', {
            rules: [{ required: true, message: '请输入库名' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='hive库名'
          {...formItemSettings}
        >
          {getFieldDecorator('hiveDbName', {
            rules: [{ required: false, message: '请输入hive库名' }]
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
  handleBack: PropTypes.func,
  formDataId: PropTypes.any
}

const WrappedForm = Form.create()(AddMetadata)

// export default Metadata
export default connect(
  mapStateToProps
)(Metadata)
