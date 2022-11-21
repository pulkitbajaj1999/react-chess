import React from 'react'

import Navigation from './components/Navigation/Navigation'
import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  return (
    <React.Fragment>
      <Navigation />
      <Board />
      <Sidebar />
    </React.Fragment>
  )
}

export default App
