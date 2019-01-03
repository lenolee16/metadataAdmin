import React, { PureComponent } from 'react'
import { Card, Button, Input } from 'antd'

const { Search } = Input

class MetadataColumnList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      visible: false
    }
  }
  filter = (val) => {
    if (!val) {
      return this.setState({ data: this.data })
    }
    this.setState({ data: this.data.filter(item => item.name.toLocaleLowerCase().includes(val.toLocaleLowerCase())) })
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
              placeholder='源数据库名称'
              onSearch={this.filter}
              style={{ width: 200 }}
            />
          </div>
        </Card>
      </div>
    )
  }
}

export default MetadataColumnList
