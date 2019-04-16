import { combineReducers } from 'redux'
import common from './common'
import loading from './loading'
import tableHeight from './tableHeight'

export default combineReducers({
  common,
  loading,
  tableHeight
})
