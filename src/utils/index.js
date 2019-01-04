import store from '$redux/store'
import { SHOW_LOADING, HIDE_LOADING } from '$redux/constants/ActionTypes'

const utils = {}
utils.loading = {
  show () {
    store.dispatch({ type: SHOW_LOADING })
  },
  hide () {
    store.dispatch({ type: HIDE_LOADING })
  }
}

export default utils
