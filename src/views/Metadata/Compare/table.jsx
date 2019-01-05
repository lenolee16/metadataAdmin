import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Button, Input, Form, Modal } from 'antd'
import { Link } from 'react-router-dom'
import utils from 'utils'
const { Column } = Table
const { Search } = Input

class MetadataTableList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      dataSourceId: '1',
      loading: false
      // formData: null
    }
  }
  componentDidMount () {
    this.data = [{
      targetTableId: '1',
      tableName: 'John Brown',
      targetComment: '目标注释',
      targetStatus: '目标状态',
      currentComment: '当前注释',
      currentStatus: '当前状态',
      compareComment: '对比注释',
      compareStatus: '对比状态'
    }, {
      targetTableId: '2',
      tableName: 'tableName',
      targetComment: 'targetComment',
      targetStatus: 'targetStatus',
      currentComment: 'currentComment',
      currentStatus: 'currentStatus',
      compareComment: 'compareComment',
      compareStatus: 'compareStatus'
    }]
    this.setState({ data: this.data })
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
    window._http.post('/metadata/dataSource/list', { dataSourceId: databaseId }).then(res => {
      if (res.data.code === 0) {
        this.setState({
          data: res.data.data,
          loading: false
        })
      } else {
        this.setState({ loading: false })
      }
    }).catch(res => {
      this.setState({ loading: false })
    })
  }
  // 同步数据表
  sync = (data) => {
    utils.loading.show()
    window._http.post('/metadata/sourceTable/sync', { dataSourceId: data.targetTableId }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success('同步成功')
      } else {
        window._message.error('同步失败')
      }
    }).catch(() => {
      utils.loading.hide()
    })
  }
  // 修改
  amend = (data) => {
    console.log('我在修改')
    this.setState({
      visible: true
    })
    setTimeout(() => {
      this.form.setData(data)
    }, 0)
  }
  // 传入表单回调
  handleOk = (data) => {
    this.setState({ visible: false })
    this.setState({ loading: true })
    window._http.post('metadata/targetTable/update', data).then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        window._message.success('修改成功！')
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
  render () {
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
          <Table rowKey='targetTableId' dataSource={this.state.data} loading={this.state.loading}>
            <Column
              title='数据表名称'
              dataIndex='tableName'
              key='tableName'
            />
            <Column
              title='目标注释'
              dataIndex='targetComment'
              key='targetComment'
            />
            <Column
              title='目标状态'
              dataIndex='targetStatus'
              key='targetStatus'
            />
            <Column
              title='当前注释'
              dataIndex='currentComment'
              key='currentComment'
            />
            <Column
              title='当前状态'
              dataIndex='currentStatus'
              key='currentStatus'
            />
            <Column
              title='对比注释'
              dataIndex='compareComment'
              key='compareComment'
            />
            <Column
              title='对比状态'
              dataIndex='compareStatus'
              key='compareStatus'
            />
            <Column
              title='操作'
              key='action'
              render={(text, record) => (
                  <>
                    <Link to={`/metadataList/${this.dataSourceId}/${record.targetTableId}`}><Button type='primary' ghost icon='search' style={{ marginRight: '10px' }} >查看</Button></Link>
                    <Button type='primary' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '10px' }}>修改</Button>
                    <Button type='danger' ghost icon='sync' onClick={() => this.sync(record)}>同步</Button>
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
      console.log(values)
      console.log(!err)
      if (!err) {
        this.props.handleBack(values)
        this.props.form.resetFields()
      }
    })
  }
  setData (data) {
    this.props.form.setFieldsValue(data)
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
            <Input readOnly />
          )}
        </Form.Item>
        <Form.Item
          label='数据表名称'
          {...formItemSettings}
        >
          {getFieldDecorator('tableName', {
            rules: [{ required: true, message: '请输入数据表名称' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='目标注释'
          {...formItemSettings}
        >
          {getFieldDecorator('targetComment', {
            rules: [{ required: true, message: '请输入目标注释' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='目标状态'
          {...formItemSettings}
        >
          {getFieldDecorator('targetStatus', {
            rules: [{ required: false, message: '请输入目标状态' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='当前注释'
          {...formItemSettings}
        >
          {getFieldDecorator('currentComment', {
            rules: [{ required: false, message: '请输入当前注释' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='当前状态'
          {...formItemSettings}
        >
          {getFieldDecorator('currentStatus', {
            rules: [{ required: true, message: '请输入当前状态' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='对比注释'
          {...formItemSettings}
        >
          {getFieldDecorator('compareComment', {
            rules: [{ required: true, message: '请输入对比注释' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='对比状态'
          {...formItemSettings}
        >
          {getFieldDecorator('compareStatus', {
            rules: [{ required: true, message: '请输入对比状态' }]
          })(
            <Input />
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
