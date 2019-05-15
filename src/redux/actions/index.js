import * as types from '../constants/ActionTypes'

export const increment = () => ({ type: types.INCREMENT })
export const showLoading = () => ({ type: types.SHOW_LOADING })
export const hideLoading = () => ({ type: types.HIDE_LOADING })
export const tableHeight = (num) => ({ type: types.TABLE_HEIGHT, num })
export const toggleMenu = () => ({ type: types.TOGGLE_MENU })
export const TABS_PAGE = (page) => ({ type: types.TABS_PAGE, page })
