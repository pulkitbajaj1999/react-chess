import { createSlice } from '@reduxjs/toolkit'

// const getExpandedState = (fen) => {
//   fen = fen.replace(/1/g, '.')
//   fen = fen.replace(/2/g, '..')
//   fen = fen.replace(/3/g, '...')
//   fen = fen.replace(/4/g, '....')
//   fen = fen.replace(/5/g, '.....')
//   fen = fen.replace(/6/g, '......')
//   fen = fen.replace(/7/g, '.......')
//   fen = fen.replace(/8/g, '........')
//   return fen.split('/')
// }

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

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    prevStates: [],
    currentState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR,',
    expandedState: getExpandedState(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    ),
    whiteChance: true,
    totalMoves: 0,
  },
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
      state.whiteChance = !state.whiteChance
    },
    testMove: (state) => {
      state.prevStates.push(state.currentState)
      state.currentState = 'rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR'
      state.whiteChance = !state.whiteChance
      state.totalMoves++
    },
    reverseMove: (state) => {
      if (state.prevStates.length === 0) return
      state.currentState = state.prevStates.pop()
      state.expandedState = getExpandedState(state.currentState)
      state.whiteChance = !state.whiteChance
      state.totalMoves--
    },
  },
})

export default boardSlice.reducer
export const boardActions = boardSlice.actions
