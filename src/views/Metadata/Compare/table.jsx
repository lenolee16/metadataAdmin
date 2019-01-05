import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Button, Input, Form, Modal, Tag, Switch } from 'antd'
import { Link } from 'react-router-dom'
import utils from 'utils'
const { Column, ColumnGroup } = Table
const { Search } = Input

class MetadataTableList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      // 数据源id
      dataSourceId: '1',
      loading: false
      // formData: null
    }
  }
  componentDidMount () {
    this.data = [{
      targetTableId: '1',
      tableName: 'tablesName',
      targetComment: 'targetComment',
      targetStatus: '1',
      currentComment: 'currentComment',
      currentStatus: '1',
      currentToTarget: '3',
      currentToTargetTxt: '表存在变化',
      compareComment: 'compareComment',
      compareStatus: '1',
      compareToCurrent: '4',
      compareToCurrentTxt: '表字段存在变化',
      targetTable: {
        targetTableId: 0,
        sourceDbId: 0,
        sourceTableName: 'string',
        status: 0,
        targetComment: 'string',
        tableName: 'string',
        targetVersionNo: 0
      }
    }, {
      targetTableId: '2',
      tableName: '数据表名',
      targetComment: '目标注释',
      targetStatus: '1',
      currentComment: '当前注释',
      currentStatus: '1',
      currentToTarget: '4',
      currentToTargetTxt: '表字段有变化',
      compareComment: '上一次注释',
      compareStatus: '1',
      compareToCurrent: '3',
      compareToCurrentTxt: '有变化',
      targetTable: {
        targetTableId: 1,
        sourceDbId: 0,
        sourceTableName: 'string',
        status: 0,
        targetComment: 'string',
        tableName: 'string',
        targetVersionNo: 0
      }
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
    window._http.post('/metadata/dataSource/list', { sourceDatabaseId: databaseId }).then(res => {
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
    if (data.targetTable && data.targetTable.targetTableId === null) {
      return window._message.error('目标表id不存在，无法修改！')
    }
    this.setState({ visible: true })
    setTimeout(() => {
      console.log(data.targetTable)
      this.form.setData(data.targetTable)
    }, 0)
  }
  // 传入表单回调
  handleOk = (data) => {
    this.setState({ visible: false, loading: true })
    data.status = data.status ? 1 : 0
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
  // 判断颜色 0无变化 1表存在变化 2表属性是否变化 3表字段有无删减 4表字段属性有无变化
  renderColor = (status) => {
    const tagMap = {
      0: '',
      1: '',
      2: '',
      3: 'green',
      4: 'red'
    }
    return tagMap[status]
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
          <Table bordered rowKey='targetTableId' dataSource={this.state.data} loading={this.state.loading}>
            <Column
              title='数据表名称'
              dataIndex='tableName'
              key='tableName'
            />
            <ColumnGroup title='目标版本' >
              <Column
                title='目标版本注释'
                dataIndex='targetComment'
                key='targetComment'
              />
            </ColumnGroup>
            <ColumnGroup title='当前快照与目标版本对比' >
              <Column
                title='对比注释'
                dataIndex='currentComment'
                key='currentComment'
              />
              <Column
                title='状态'
                dataIndex='currentToTarget'
                key='currentToTarget'
                render={(text, record) => (
                  <>
                    <Tag color={this.renderColor(text)}>{record.currentToTargetTxt}</Tag>
                  </>
                )}
              />
            </ColumnGroup>
            <ColumnGroup title='上一次快照与当前快照对比'>
              <Column
                title='对比注释'
                dataIndex='compareComment'
                key='compareComment'
              />
              <Column
                title='状态'
                dataIndex='compareToCurrent'
                key='compareToCurrent'
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
                    <Link to={`/metadataList/${this.dataSourceId}/${record.targetTableId}`}><Button type='primary' size='small' ghost icon='search' style={{ marginRight: '5px', marginBottom: '5px' }} >查看</Button></Link>
                    <Button type='primary' size='small' ghost icon='edit' onClick={() => this.amend(record)} style={{ marginRight: '5px', marginBottom: '5px' }}>修改</Button>
                    <Button type='danger' size='small' ghost icon='sync' onClick={() => this.sync(record)}>同步</Button>
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
      if (!err) {
        this.props.handleBack(values)
        this.props.form.resetFields()
      }
    })
  }
  setData (data) {
    data.status = !!data.status
    const { targetTableId, targetComment, status } = data
    this.props.form.setFieldsValue({ targetTableId, targetComment, status })
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
          {getFieldDecorator('targetComment', {
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
