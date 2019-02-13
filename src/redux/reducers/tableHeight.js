import { TABLE_HEIGHT } from '../constants/ActionTypes'

const initialState = {
  tableHeightNum: window.document.body.clientHeight
}

export default function tableHeightFunc (state = initialState, action) {
  switch (action.type) {
    case TABLE_HEIGHT:
      return { tableHeightNum: action.num }
    default:
      return state
  }
}
