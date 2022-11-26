import { createSlice } from '@reduxjs/toolkit'

const sessionSlice = createSlice({
  name: 'session',
  initialState: { id: 'test', whiteFaceView: true },
  reducers: {
    setID: (state, action) => {
      state.id = action.payload
    },
    flipView: (state) => {
      state.whiteFaceView = !state.whiteFaceView
    },
  },
})

export default sessionSlice.reducer
export const sessionActions = sessionSlice.actions
