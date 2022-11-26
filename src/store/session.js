import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
  isActive: false,
  id: 'local',
  currentState: '',
  whiteFaceView: true,
}
const sessionSlice = createSlice({
  name: 'session',
  initialState: INITIAL_STATE,
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
    deactivateSession: (state) => {
      return INITIAL_STATE
    },
  },
})

export default sessionSlice.reducer
export const sessionActions = sessionSlice.actions
