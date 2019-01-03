import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import http from 'utils/http'
import { message } from 'antd'

window._http = http
window._message = message

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
