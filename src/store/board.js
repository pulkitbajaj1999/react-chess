import { createSlice } from '@reduxjs/toolkit'

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    prevStates: [],
    currentState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    whiteChance: true,
    totalMoves: 0,
  },
  reducers: {
    makeMove: (state, action) => {
      console.log('payload', action.payload)
    },
    testMove: (state) => {
      state.prevStates.push(state.currentState)
      state.currentState = 'rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR'
      state.whiteChance = !state.whiteChance
      state.totalMoves++
    },
    reverseMove: (state) => {
      state.currentState = state.prevStates.pop()
      state.whiteChance = !state.whiteChance
      state.totalMoves--
    },
  },
})

export default boardSlice.reducer
export const boardActions = boardSlice.actions
