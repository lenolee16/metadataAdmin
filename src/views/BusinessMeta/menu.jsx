import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Col, Tree, Form, Input, InputNumber, Button } from 'antd'

import './index'

const { TreeNode } = Tree

const renderMenu = (data) => {
  const _renderMenu = (list) => {
    return list.map(item => {
      return (item.childrenMenuResources && Array.isArray(item.childrenMenuResources) && item.childrenMenuResources.length > 0) ? <TreeNode key={item.id} title={`${item.name}${item.level === 1 ? '系统' : ''}`} >
        {_renderMenu(item.childrenMenuResources)}
      </TreeNode> : <TreeNode key={item.id} title={item.name} />
    })
  }
  return _renderMenu(data)
}

class BusinessMetaMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      menu: [],
      selectedMenu: ''
    }
  }
  componentDidMount () {
    this.queryMenu()
  }
  queryMenu () {
    window._http.post('/metadata/ods/menuList').then(res => {
      this.setState({ menuLoading: false })
      if (res.data.code === 0) {
        this.menuData = res.data.data
        this.setState({ menu: res.data.data })
      } else {
        window._message.error(res.data.msg || '查询失败')
      }
    }).catch(res => {
      this.setState({ menuLoading: false })
    })
  }
  selectMenu = (selectedKeys, item) => {
    if (selectedKeys[0] !== this.state.selectedMenu) {
      this.setState({ selectedMenu: selectedKeys[0] })
      this.form.props.form.setFieldsValue({ parentId: selectedKeys[0], parentNode: item.node.props.title })
    }
  }
  addCallback = () => {
    console.log(2)
    this.queryMenu()
  }
  render () {
    return (
      <div className='BusinessMeta'>
        <Row gutter={8} style={{ height: '100%' }}>
          <Col span={4} style={{ height: '100%' }}>
            <Card title='菜单管理' className='BusinessMetaMenu' type='inner'>
              <div className='menu'>
                <Tree
                  showLine
                  onSelect={this.selectMenu}
                >
                  {renderMenu(this.state.menu)}
                </Tree>
              </div>
            </Card>
          </Col>
          <Col span={20} style={{ height: '100%' }}>
            <Card title='新增菜单' type='inner' className='BusinessMetaMenu'>
              <EnhancedForm callback={this.addCallback} menuData={this.state.menu} wrappedComponentRef={(form) => { this.form = form }} />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

class CustomizedForm extends Component {
  state = {
    loading: false
  }
  handleReset = () => {
    this.props.form.resetFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        const formData = {
          name: values.name,
          parentId: values.parentId ? values.parentId : '0',
          displaySequence: values.displaySequence
        }
        window._http.post('/metadata/ods/addMenu', formData).then(res => {
          this.setState({ loading: false })
          if (res.data.code === 0) {
            window._message.success('保存成功')
            this.props.form.setFieldsValue({ name: '' })
            this.props.callback()
          } else {
            window._message.error(res.data.msg || '保存失败')
          }
        }).catch(() => this.setState({ loading: false }))
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 10
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        span: 10,
        offset: 6
      }
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} >
        <Form.Item
          label=''
        >
          {getFieldDecorator('parentId', {})(
            <Input disabled type='hidden' />
          )}
        </Form.Item>
        <Form.Item
          label='菜单名称'
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入菜单名称'
            }]
          })(
            <Input placeholder='系统简称不需要带上系统字样' />
          )}
        </Form.Item>
        <Form.Item
          label='父级节点'
        >
          {getFieldDecorator('parentNode', {})(
            <Input disabled />
          )}
        </Form.Item>
        <Form.Item
          label='排序'
        >
          {getFieldDecorator('displaySequence', {
            initialValue: 1,
            rules: [{
              required: true, message: '请输入排序值'
            }]
          })(
            <InputNumber />
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout} >
          <Button type='primary' htmlType='submit' loading={this.state.loading}>保存</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
        </Form.Item>
      </Form>
    )
  }
}

CustomizedForm.propTypes = {
  form: PropTypes.object,
  menuData: PropTypes.array,
  callback: PropTypes.func
}

const EnhancedForm = Form.create()(CustomizedForm)

export default BusinessMetaMenu
