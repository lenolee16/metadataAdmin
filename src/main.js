import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import http from 'utils/http'
import { message, notification } from 'antd'

window._http = http
window._message = message
window._notification = notification

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
