import { TOGGLE_MENU } from '../constants/ActionTypes'

const initialState = {
  collapsed: false
}

export default function common (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, collapsed: !state.collapsed }
    default:
      return state
  }
}
