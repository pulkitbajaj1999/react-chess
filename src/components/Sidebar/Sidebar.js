import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { boardActions } from '../../store/board'
import { sessionActions } from '../../store/session'
import ButtonLarge from '../../UI/ButtonLarge'
import classes from './Sidebar.module.css'

const Sidebar = () => {
  const boardState = useSelector((state) => state.board)
  const dispatch = useDispatch()

  const flipBoardHandler = () => {
    dispatch(sessionActions.flipView())
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
        <ButtonLarge onClick={flipBoardHandler}>Flip</ButtonLarge>
        <ButtonLarge onClick={undoHandler}>Undo</ButtonLarge>
        <ButtonLarge onClick={resetHandler}>Reset</ButtonLarge>
      </div>
    </div>
  )
}

export default Sidebar
