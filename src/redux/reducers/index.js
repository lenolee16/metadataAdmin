import { combineReducers } from 'redux'
import counter from './counter'
import loading from './loading'

export default combineReducers({
  counter,
  loading
})
