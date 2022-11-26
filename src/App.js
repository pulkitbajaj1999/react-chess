import React from 'react'
import { useSelector } from 'react-redux'

import Navigation from './components/Navigation/Navigation'
import Sidebar from './components/Sidebar/Sidebar'
import GameLocal from './components/Game/GameLocal'
import GameSession from './components/Game/GameSession'

function App() {
  const sessionState = useSelector((state) => state.session)
  return (
    <React.Fragment>
      <Navigation />
      {!sessionState.isActive && <GameLocal />}
      {sessionState.isActive && <GameSession />}
      <Sidebar />
    </React.Fragment>
  )
}

export default App
