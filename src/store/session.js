import { createSlice } from '@reduxjs/toolkit'

const sessionSlice = createSlice({
  name: 'session',
  initialState: { id: null },
  reducers: {
    setID: (state, action) => {
      state.id = action.payload
    },
  },
})

export default sessionSlice.reducer
export const sessionActions = sessionSlice.actions
