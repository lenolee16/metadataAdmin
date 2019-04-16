import React, { Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from 'views/Login'
import MainView from 'views/MainView'
import Home from 'views/Home'
import UserManage from 'views/User'
import MetadataManage from 'views/Metadata'
import MetadataSearch from 'views/Metadata/Search'
import MetadataList from 'views/Metadata/Compare'
import MetadataTableList from 'views/Metadata/Compare/table'
import MetadataColumnList from 'views/Metadata/Compare/column'

import BusinessMeta from 'views/BusinessMeta'
import BusinessMenu from 'views/BusinessMeta/menu'
import authHOC from 'utils/auth'

// https://reactjs.org/docs/code-splitting.html#suspense
const AsyncView = React.lazy(() => import(/* webpackChunkName: "async" */ 'views/AsyncView'))

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/userManage',
    component: UserManage
  },
  {
    path: '/metadataManage',
    component: MetadataManage
  },
  {
    path: '/metadataList',
    component: MetadataList,
    exact: true
  },
  {
    path: '/metadataList/:databaseId',
    component: MetadataTableList,
    exact: true
  },
  {
    path: '/metadataList/:databaseId/:id',
    component: MetadataColumnList,
    exact: true
  },
  {
    path: '/metadataSearch',
    component: MetadataSearch
  },
  {
    path: '/businessMeta',
    component: BusinessMeta
  },
  {
    path: '/businessMenu',
    component: BusinessMenu
  },
  {
    path: '/async',
    component: () => (
      <Suspense fallback={<div>Loading</div>}>
        <AsyncView />
      </Suspense>
    )
  }
]

const RenderRouters = (
  <Switch>
    <Route path='/login' component={Login} />
    <Route path='/' component={authHOC(MainView)} />
  </Switch>
)

export {
  routes,
  RenderRouters
}
