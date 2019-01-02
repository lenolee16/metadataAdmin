import React, { PureComponent } from 'react'
import { Card, Table, Divider, Button } from 'antd'
const { Column } = Table

class User extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [{
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
    }
  }
  render () {
    return (
      <div className='User'>
        <Card
          title='用户管理'
        >
          <div style={{ marginBottom: 12 }}>
            <Button
              type='primary'
            >
              新增
            </Button>
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
      </div>
    )
  }
}

export default User
