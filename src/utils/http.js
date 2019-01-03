import axios from 'axios'
import { message } from 'antd'

// create an axios instance
const api = process.env.NODE_ENV !== 'production' ? '/metadata_manager_api' : '/metadata_manager_api'
const service = axios.create({
  timeout: 15000
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (config.url.indexOf('static/datas') === -1) { // 如果请求的不是本地文件则加上前缀
    config.url = api + config.url
  }
  if (config.method === 'post') { // 如果是post请求则，封装data数据
    config.data = {
      data: config.data
    }
  }
  if (config.method === 'upload') { // 自定义上传
    config.method = 'post'
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code >= 100 && res.code < 200) {
      message.error('你没有访问权限')
    }
    return response
  },
  error => {
    console.log('err' + error)// for debug
    message.error(error.message)
    return Promise.reject(error)
  })

export default service
