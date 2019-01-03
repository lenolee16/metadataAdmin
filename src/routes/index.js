import React, { Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import MainView from 'views/MainView'
import SyncView from 'views/SyncView'
import UserManage from 'views/User'
import MetadataManage from 'views/Metadata'
import MetadataSearch from 'views/Metadata/search'
import MetadataList from 'views/Metadata/list'
import MetadataBaseList from 'views/Metadata/database'
import MetadataTableList from 'views/Metadata/datatable'

// https://reactjs.org/docs/code-splitting.html#suspense
const AsyncView = React.lazy(() => import(/* webpackChunkName: "async" */ 'views/AsyncView'))

const routes = [
  {
    path: '/sync',
    component: SyncView
  },
  {
    path: '/async',
    component: () => (
      <Suspense fallback={<div>Loading</div>}>
        <AsyncView />
      </Suspense>
    )
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
    component: MetadataList
  },
  {
    path: '/metadataList/:databaseId',
    component: MetadataBaseList
  },
  {
    path: '/metadataList/:databaseId/:id',
    component: MetadataTableList
  },
  {
    path: '/metadataSearch',
    component: MetadataSearch
  }
]

const RenderRouters = (
  <Switch>
    <Route path='/' component={MainView} />
  </Switch>
)

export {
  routes,
  RenderRouters
}
