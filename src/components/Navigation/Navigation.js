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
  const [showLocalGameOverlay, setShowLocalGameOverlay] = useState(false)
  const [showNewSessionOverlay, setShowNewSessionOverlay] = useState(false)
  const [showJoinSessionOverlay, setShowJoinSessionOverlay] = useState(false)
  const [joinSessionError, setJoinSessionError] = useState('')

  // define handlers
  const openLocalGameOverlay = () => {
    setShowLocalGameOverlay(true)
  }

  const closeLocalGameOverlay = () => {
    setShowLocalGameOverlay(false)
  }

  const openNewSessionOverlay = () => {
    setShowNewSessionOverlay(true)
  }

  const closeNewSessionOverlay = () => {
    setShowNewSessionOverlay(false)
  }

  const openJoinSessionOverlay = () => {
    setShowJoinSessionOverlay(true)
  }

  const closeJoinSessionOverlay = () => {
    setShowJoinSessionOverlay(false)
    setJoinSessionError('')
  }

  const startLocalGameHandler = () => {
    dispatch(sessionActions.deactivateSession())
    closeLocalGameOverlay()
  }

  const startNewSessionHandler = () => {
    const url = BASE_URL + '/api/v1/session/new'
    console.log('GET/new-session')
    fetch(url)
      .then((res) => {
        console.log('res(get-new-session)', res)
        return res.json()
      })
      .then((data) => {
        console.log('data(get-new-session)', data)
        const { sessionID, currentState } = data
        const whiteFaceView = true
        dispatch(
          sessionActions.setSession({ sessionID, currentState, whiteFaceView })
        )
      })
      .then(() => {
        closeNewSessionOverlay()
      })
  }

  const joinSessionHandler = (sessionID) => {
    const url =
      BASE_URL + '/api/v1/session/existing' + `?sessionID=${sessionID}`
    console.log('GET/existing-session')
    fetch(url)
      .then((res) => {
        console.log('response(join-existing-sesssion)', res)
        if (res.status === 404) throw Error('Error while fetching session')
        return res.json()
      })
      .then((data) => {
        console.log('data(join-existing-session)', data)
        const currentState = data.currentState
        const whiteFaceView = false
        if (currentState) {
          dispatch(
            sessionActions.setSession({
              sessionID,
              currentState,
              whiteFaceView,
            })
          )
        } else if (data.error) {
          throw Error(data.error)
        } else {
          throw Error('Improper session data')
        }
      })
      .then(() => {
        console.log('session-joined')
        closeJoinSessionOverlay()
      })
      .catch((error) => {
        setJoinSessionError(error.message)
      })
  }

  return (
    <div className={classes['nav-component']}>
      <div className={classes['nav-top']}>
        <div className={classes['nav-head-component']}>Chess19</div>
        <div
          className={
            sessionState.isActive
              ? classes['nav-link-component']
              : classes['nav-link-component-active']
          }
          onClick={sessionState.isActive ? openLocalGameOverlay : undefined}
        >
          <span>Local</span>
        </div>
        <div
          className={classes['nav-link-component']}
          onClick={openNewSessionOverlay}
        >
          <span>Start New</span>
        </div>
        <div
          className={classes['nav-link-component']}
          onClick={openJoinSessionOverlay}
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
      {showLocalGameOverlay && (
        <NewSessionoverlay
          onCloseOverlay={closeLocalGameOverlay}
          onConfirm={startLocalGameHandler}
        />
      )}
      {showNewSessionOverlay && (
        <NewSessionoverlay
          onCloseOverlay={closeNewSessionOverlay}
          onConfirm={startNewSessionHandler}
        />
      )}
      {showJoinSessionOverlay && (
        <JoinSessionOverlay
          onCloseOverlay={closeJoinSessionOverlay}
          onJoinSession={joinSessionHandler}
          error={joinSessionError}
        />
      )}
    </div>
  )
}

export default Navigation
