import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { boardActions } from '../../store/board'
import { sessionActions } from '../../store/session'
import ButtonLarge from '../../UI/ButtonLarge'
import classes from './Sidebar.module.css'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const Sidebar = () => {
  const sessionState = useSelector((state) => state.session)
  const dispatch = useDispatch()
  const { id: sessionID, isActive: sessionIsActive } = sessionState

  const postAction = (type, payload) => {
    const url = BASE_URL + '/api/v1/action'
    console.log('POST/action', type, 'payload', payload)
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionID,
        action: { type, payload },
      }),
    })
      .then((res) => {
        console.log('response(POST/action)', res)
        return res.json()
      })
      .then((data) => {
        console.log('data(POST/action)', data)
      })
  }

  const flipBoardHandler = () => {
    sessionIsActive
      ? dispatch(sessionActions.flipView())
      : dispatch(boardActions.flipView())
  }

  const undoHandler = () => {
    sessionIsActive
      ? postAction('undo', {})
      : dispatch(boardActions.reverseMove())
  }

  const resetHandler = () => {
    sessionIsActive ? postAction('reset', {}) : dispatch(boardActions.reset())
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
