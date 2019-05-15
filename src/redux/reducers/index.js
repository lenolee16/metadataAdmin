import { combineReducers } from 'redux'
import common from './common'
import loading from './loading'
import tableHeight from './tableHeight'
import tabsPage from './tabsPage'

export default combineReducers({
  common,
  loading,
  tableHeight,
  tabsPage
})
