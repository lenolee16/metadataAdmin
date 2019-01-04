import store from '$redux/store'
import { showLoading, hideLoading } from '$redux/actions'

const utils = {}
utils.loading = {
  show: store.dispatch(showLoading),
  hide: store.dispatch(hideLoading)
}

export default utils
