import { HIDE_LOADING, SHOW_LOADING } from '../constants/ActionTypes'

const initialState = {
  globalLoading: false
}

export default function loading (state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADING:
      return { globalLoading: true }
    case HIDE_LOADING:
      return { globalLoading: false }
    default:
      return state
  }
}
