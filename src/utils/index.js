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

utils.getLoggedIn = () => sessionStorage.getItem('isLoggedIn') === '1'
utils.setLoggedIn = (Boolean) => sessionStorage.setItem('isLoggedIn', Boolean ? '1' : '0')

export default utils
