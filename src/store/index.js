import { configureStore } from '@reduxjs/toolkit'

import boardReducer from './board'
import sessionReducer from './session'

const store = configureStore({
  reducer: { board: boardReducer, session: sessionReducer },
})

export default store
