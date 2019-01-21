import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Input, Form, Switch, Modal, Table, Tag, Radio, Popover, Icon } from 'antd'
import Ellipsis from 'components/Ellipsis'
import utils from 'utils'

const { Search } = Input
const { Column, ColumnGroup } = Table

class MetadataColumnList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false,
      formDataId: null,
      loading: false,
      filteredInfo: null
    }
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.targetFieldName.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
  }
  componentDidMount () {
    this.queryData()
  }
  queryData () {
    const { params: { databaseId, id } } = this.props.match
    this.setState({ loading: true })
    window._http.post('/metadata/targetField/compareField', { sourceDatabaseId: databaseId, targetTableId: id }).then(res => {
      this.setState({ loading: false })
      if (res.data.code === 0) {
        this.data = res.data.data.dataList
        this.setState({ data: this.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(() => {
      this.setState({ loading: false })
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters
    })
  }
  handleCancel = () => {
    this.setState({ visible: false, formDataId: null })
    this.form.props.form.resetFields()
  }
  handleOk = () => {
    this.setState({ visible: false, formDataId: null })
    this.queryData()
  }
  edit = (data) => {
    this.setState({ visible: true, formDataId: data.targetFieldName })
    setTimeout(() => {
      this.form.setForm(data.targetField)
    }, 0)
  }
  sync = (data) => {
    utils.loading.show()
    const { params: { databaseId, id } } = this.props.match
    window._http.post('/metadata/sourceField/sync', { dataSourceId: databaseId, targetTableId: id, targetFieldName: data.targetFieldName }).then(res => {
      utils.loading.hide()
      if (res.data.code === 0) {
        window._message.success('同步成功！')
        this.queryData()
      } else {
        window._message.error(res.data.msg || '同步失败！')
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
  renderPopover = (data) => {
    return (
      <div className='Popover'>
        <p>字段类型：{data.fieldType}</p>
        <p>是否主键：{data.fieldPri ? '是' : '否'}</p>
        <p>字段注释：{data.fieldComment}</p>
        <p>字段长度：{data.fieldSize}</p>
        <p>默认值：{data.fieldDefault}</p>
      </div>
    )
  }
  renderTargetPopover = (data) => {
    return (
      <div className='Popover'>
        <p>字段类型：{data.targetFieldType}</p>
        <p>是否主键：{data.targetFieldPri ? '是' : '否'}</p>
        <p>字段注释：{data.targetFieldComment}</p>
        <p>字段长度：{data.targetFieldSize}</p>
        <p>默认值：{data.targetDefaultValue}</p>
      </div>
    )
  }
  render () {
    const filters = [
      { text: '无变化', value: 0 },
      { text: '有新增', value: 3 },
      { text: '有修改', value: 4 }
    ]
    let { filteredInfo } = this.state
    filteredInfo = filteredInfo || {}
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
          <Table rowKey='targetFieldName' bordered pagination={false} onChange={this.handleTableChange} dataSource={this.state.data} loading={this.state.loading} className='smallSizeTable' scroll={{ y: 500 }} >
            <Column
              title='字段名称'
              dataIndex='targetFieldName'
              key='targetFieldName'
              width={150}
              render={(text) => (
                <b>{text}</b>
              )}
            />
            <ColumnGroup title='目标'>
              <Column
                title='注释'
                dataIndex='targetField.targetFieldComment'
                key='targetField.targetFieldComment'
                width={150}
                render={(text, record) => (
                  record.targetField ? <Ellipsis content={record.targetField.targetFieldComment} style={{ width: 100 }} /> : '-'

                )}
              />
              <Column
                title='类型（长度,小数位）'
                dataIndex='targetField'
                key='targetField.targetFieldType'
                width={150}
                render={(text, record) => (
                  record.targetField ? record.targetField.targetFieldType + '(' + record.targetField.targetFieldSize + ',' + record.targetField.targetDecimalDigits + ')' : '-'
                )}
              />
              <Column
                title='是否主键'
                dataIndex='targetField.targetFieldPri'
                key='targetField.targetFieldPri'
                width={90}
                render={(text, record) => (
                  record.targetField ? record.targetField.targetFieldPri ? '是' : '否' : '-'
                )}
              />
              <Column
                title='其他信息'
                dataIndex='targetField'
                key='targetField'
                width={90}
                render={(text) => (
                  <>
                    {
                      text ? <Popover content={this.renderTargetPopover(text)} title='详情'>
                        详情<Icon type='exclamation-circle' style={{ marginLeft: '5px', color: '#1890ff' }} />
                      </Popover> : '-'
                    }
                  </>
                )}
              />
            </ColumnGroup>
            <ColumnGroup title='当前快照'>
              <Column
                title='当前状态'
                dataIndex='currentToTarget'
                key='currentToTarget'
                width={180}
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
            <ColumnGroup title='上一次快照'>
              <Column
                title='上一次状态'
                dataIndex='compareToCurrent'
                key='compareToCurrent'
                width={180}
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
                  <Button type='primary' icon='edit' disabled={!record.targetField} ghost style={{ marginRight: '10px' }} onClick={() => this.edit(record)}>修改</Button>
                  <Button type='danger' icon='sync' disabled={record.currentToTarget === 0} ghost onClick={() => this.sync(record)}>同步</Button>
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
          <WrappedForm handleBack={this.handleOk} match={this.props.match} wrappedComponentRef={(form) => { this.form = form }} formDataId={this.state.formDataId} />
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
        values.status = values.status ? 1 : 0
        const { params: { databaseId, id } } = this.props.match
        if (this.props.formDataId !== null) {
          window._http.post(`/metadata/targetField/update`, { dataSourceId: databaseId, targetTableId: id, ...values }).then(res => {
            if (res.data.code === 0) {
              this.props.form.resetFields()
              this.props.handleBack()
              window._message.success('修改成功！')
            } else {
              window._message.error(res.data.msg || '修改失败')
            }
          })
        } else {
          window._http.post(`/metadata/targetField/add`, { dataSourceId: databaseId, targetTableId: id, ...values }).then(res => {
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
    const { targetFieldName, targetFieldType, targetFieldComment, targetFieldPri, targetFieldSize, targetDecimalDigits, targetDefaultValue, status } = data
    this.props.form.setFieldsValue({
      targetFieldName, targetFieldType, targetFieldComment, targetFieldPri, targetFieldSize, targetDecimalDigits, targetDefaultValue, status: !!status
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
          label='是否是主键'
          {...formItemSettings}
        >
          {getFieldDecorator('targetFieldPri', {
            initialValue: 0
          })(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
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
          label='字段小数位'
          {...formItemSettings}
        >
          {getFieldDecorator('targetDecimalDigits', {
            rules: [{ required: true, message: '请输入字段小数位' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label='默认值'
          {...formItemSettings}
        >
          {getFieldDecorator('targetDefaultValue')(
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
  formDataId: PropTypes.any,
  match: PropTypes.object
}

const WrappedForm = Form.create()(AddMetadata)

export default MetadataColumnList
