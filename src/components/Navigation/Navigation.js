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
  const [joinSessionError, setJoinSessionError] = useState('')

  // define handlers
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
    setJoinSessionError('')
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
        closeNewSessionHandler()
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
        closeJoinSessionHandler()
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
          error={joinSessionError}
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
