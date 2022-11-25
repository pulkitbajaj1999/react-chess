import { createSlice } from '@reduxjs/toolkit'

const getExpandedState = (fen) => {
  fen = fen.replace(/1/g, '.')
  fen = fen.replace(/2/g, '..')
  fen = fen.replace(/3/g, '...')
  fen = fen.replace(/4/g, '....')
  fen = fen.replace(/5/g, '.....')
  fen = fen.replace(/6/g, '......')
  fen = fen.replace(/7/g, '.......')
  fen = fen.replace(/8/g, '........')
  let matrix = fen.split('/').map((row) => Array.from(row))
  return matrix
}

const getFenFromExpandedState = (expandedState) => {
  let fen = ''
  for (let row of expandedState) {
    let buff = 0
    for (let el of row) {
      if (el === '.') buff++
      else {
        if (buff) {
          fen += buff.toString()
          buff = 0
        }
        fen += el
      }
    }
    if (buff) {
      fen += buff.toString()
      buff = 0
    }
    fen += '/'
  }
  return fen.substring(0, fen.length - 1)
}

const initialState = {
  prevStates: [],
  currentState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  expandedState: [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ],
  whiteToMove: true,
  totalMoves: 0,
  whiteFaceView: true,
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    makeMove: (state, action) => {
      console.log('payload', action.payload)
      const { row: r1, col: c1 } = action.payload.from
      const { row: r2, col: c2 } = action.payload.to
      state.expandedState[r2][c2] = state.expandedState[r1][c1]
      state.expandedState[r1][c1] = '.'
      state.prevStates.push(state.currentState)
      state.currentState = getFenFromExpandedState(state.expandedState)
      state.totalMoves++
      state.whiteToMove = !state.whiteToMove
    },
    reverseMove: (state) => {
      if (state.prevStates.length > 0) {
        state.currentState = state.prevStates.pop()
        state.expandedState = getExpandedState(state.currentState)
        state.whiteToMove = !state.whiteToMove
        state.totalMoves--
      }
    },
    changeView: (state) => {
      state.whiteFaceView = !state.whiteFaceView
    },
    reset: (state) => {
      console.log('restarting')
      return initialState
    },
    loadSession: (state, action) => {
      console.log('action', action)
      return action.payload.boardState
    },
  },
})

export default boardSlice.reducer
export const boardActions = boardSlice.actions
