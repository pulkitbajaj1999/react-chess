import { createSlice } from '@reduxjs/toolkit'
import { getExpandedState, getFenFromExpandedState } from '../utils/board'

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
  whiteFaceView: true,
  totalMoves: 0,
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    makeMove: (state, action) => {
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
    flipView: (state) => {
      state.whiteFaceView = !state.whiteFaceView
    },
    reset: (state) => {
      return initialState
    },
  },
})

export default boardSlice.reducer
export const boardActions = boardSlice.actions
