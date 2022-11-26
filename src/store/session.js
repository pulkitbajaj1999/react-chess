import { createSlice } from '@reduxjs/toolkit'

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    isActive: false,
    id: 'local',
    currentState: '',
    whiteFaceView: true,
  },
  reducers: {
    setSession: (state, action) => {
      state.isActive = true
      state.id = action.payload.sessionID
      state.currentState = action.payload.currentState
      if ('whiteFaceView' in action.payload)
        state.whiteFaceView = action.payload.whiteFaceView
    },
    updateCurrentState: (state, action) => {
      state.currentState = action.payload
    },
    flipView: (state) => {
      state.whiteFaceView = !state.whiteFaceView
    },
  },
})

export default sessionSlice.reducer
export const sessionActions = sessionSlice.actions
