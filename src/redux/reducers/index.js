import { combineReducers } from 'redux'
import counter from './counter'
import loading from './loading'
import tableHeight from './tableHeight'

export default combineReducers({
  counter,
  loading,
  tableHeight
})
