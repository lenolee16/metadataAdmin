import { TABS_PAGE } from '../constants/ActionTypes'

const initialState = {
  tabs: []
}

export default function tabsPageFunc (state = initialState, action) {
  switch (action.type) {
    case TABS_PAGE:
      return { tabs: action.page }
    default:
      return state
  }
}
