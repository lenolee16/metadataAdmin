import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import './index.less'

class Ellipsis extends Component {
  constructor (props) {
    super(props)
    this.ellipsisRef = React.createRef()
    this.state = {
      isEllipsis: false
    }
  }
  componentDidMount () {
    this.updateStatus()
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.content !== this.props.content) {
      setTimeout(() => this.updateStatus(), 0)
    }
  }
  updateStatus () {
    let el = this.ellipsisRef.current
    if (el.clientWidth < el.scrollWidth) {
      this.setState({ isEllipsis: true })
    } else {
      this.setState({ isEllipsis: false })
    }
  }
  render () {
    return (
      <div className='C-Ellipsis' style={this.props.style || null}>
        {
          !this.state.isEllipsis ? <p className='C-Ellipsis_inner' ref={this.ellipsisRef}>{ this.props.content }</p> : <Tooltip title={this.props.content} overlayStyle={{ fontSize: 12 }}>
            <p className='C-Ellipsis_inner' ref={this.ellipsisRef}>{ this.props.content }</p>
          </Tooltip>
        }
      </div>
    )
  }
}

Ellipsis.propTypes = {
  content: PropTypes.string,
  style: PropTypes.any
}

export default Ellipsis
