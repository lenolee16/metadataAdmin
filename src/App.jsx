import React from 'react'
import { hot } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'
import { RenderRouters } from 'routes'
import './App.css'

import { Provider } from 'react-redux'
import store from '$redux/store'

const App = () => (
  <HashRouter>
    {RenderRouters}
  </HashRouter>
)

const reduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default hot(module)(reduxApp)
