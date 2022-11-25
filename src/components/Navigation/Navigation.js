import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import classes from './Navigation.module.css'
import { boardActions } from '../../store/board'
import session, { sessionActions } from '../../store/session'
import JoinSessionOverlay from './JoinSessionOverlay'
import NewSessionoverlay from './NewSessionOverlay'

const Navigation = () => {
  // laoding environment variables
  const BASE_URL = process.env.REACT_APP_BASE_URL

  // load states
  const boardState = useSelector((state) => state.board)
  const sessionState = useSelector((state) => state.session)
  const dispatch = useDispatch()

  // define current state variables
  const [showNewSessionOverlay, setShowNewSessionOverlay] = useState(false)
  const [showJoinSessionOverlay, setShowJoinSessionOverlay] = useState(false)

  // define functions
  const startNewSessionHandler = () => {
    const url = BASE_URL + '/api/v1/session/new'
    fetch(url)
      .then((res) => {
        console.log('start-new-session-handler', 'response: ', res)
        return res.json()
      })
      .then((data) => {
        console.log('data', data)
        const { sessionID, boardState } = data
        dispatch(sessionActions.setID(sessionID))
        dispatch(boardActions.loadSession({ sessionID, boardState }))
      })
      .then(() => {
        closeNewSessionHandler()
      })
  }

  const joinSessionHandler = (sessionID) => {
    const url =
      BASE_URL + '/api/v1/session/existing' + `?sessionID=${sessionID}`
    fetch(url)
      .then((res) => {
        console.log('join-session-handler', 'response: ', res)
        return res.json()
      })
      .then((data) => {
        console.log('data', data)
        const { sessionID, boardState } = data
        dispatch(sessionActions.setID(sessionID))
        dispatch(boardActions.loadSession({ sessionID, boardState }))
      })
      .then(() => {
        console.log('session-joined')
        setShowJoinSessionOverlay(false)
      })
  }

  const openNewSessionHandler = () => {
    setShowNewSessionOverlay(true)
  }

  const closeNewSessionHandler = () => {
    setShowNewSessionOverlay(false)
  }

  const openJoinSessionHandler = () => {
    setShowJoinSessionOverlay(true)
  }

  const closeJoinSessionHandler = () => {
    setShowJoinSessionOverlay(false)
  }

  return (
    <div className={classes['nav-component']}>
      <div className={classes['nav-top']}>
        <div className={classes['nav-head-component']}>Chess19</div>
        <div
          className={classes['nav-link-component']}
          onClick={openNewSessionHandler}
        >
          <span>Start New</span>
        </div>
        <div
          className={classes['nav-link-component']}
          onClick={openJoinSessionHandler}
        >
          <span>Join</span>
        </div>
      </div>
      <div className={classes['nav-bottom']}>
        <div className={classes['nav-session-component']}>
          <span className={classes['session-heading']}>SessionID</span>
          <span className={classes['session-value']}>{sessionState.id}</span>
        </div>
      </div>
      {showJoinSessionOverlay && (
        <JoinSessionOverlay
          onCloseOverlay={closeJoinSessionHandler}
          onJoinSession={joinSessionHandler}
        />
      )}
      {showNewSessionOverlay && (
        <NewSessionoverlay
          onCloseOverlay={closeNewSessionHandler}
          onConfirm={startNewSessionHandler}
        />
      )}
    </div>
  )
}

export default Navigation
