import { TABLE_HEIGHT } from '../constants/ActionTypes'

const tableHeight = {
  tableHeightNum: window.document.body.clientHeight
}

export default function tableHeightFunc (state = tableHeight, action) {
  switch (action.type) {
    case TABLE_HEIGHT:
      return { tableHeightNum: state.tableHeightNum }
    default:
      return state
  }
}
