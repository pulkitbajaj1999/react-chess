import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { boardActions } from '../../store/board'
import classes from './Sidebar.module.css'

const Sidebar = () => {
  const boardState = useSelector((state) => state.board)
  const dispatch = useDispatch()

  const flipBoardHandler = () => {
    dispatch(boardActions.changeView())
  }

  const undoHandler = () => {
    dispatch(boardActions.reverseMove())
  }

  const resetHandler = () => {
    dispatch(boardActions.reset())
  }

  return (
    <div className={classes['sidebar-component']}>
      <div className={classes['sidebar-control']}>
        <button onClick={flipBoardHandler}>Flip</button>
        <button onClick={undoHandler}>Undo</button>
        <button onClick={resetHandler}>Reset</button>
      </div>
    </div>
  )
}

export default Sidebar
