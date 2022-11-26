import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

import Modal from '../../UI/Modal'
import Card from '../../UI/Card'
import Button from '../../UI/Button'
import Backdrop from '../../UI/Backdrop'
import classes from './JoinSessionOverlay.module.css'

const JoinSessionOverlay = (props) => {
  const sessionRef = useRef()
  const okHandler = () => {
    const sessionID = sessionRef.current.value
    if (sessionID.trim().length > 0) {
      props.onJoinSession(sessionID)
    }
  }
  const enterHandler = (event) => {
    if (event.key === 'Enter') {
      okHandler()
    }
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onCloseOverlay} />,
        document.getElementById('backdrop')
      )}
      {ReactDOM.createPortal(
        <Card className={classes.modal}>
          <header className={classes.header}>
            <h2>Join Session</h2>
          </header>
          {props.error && <div className={classes.error}>{props.error}</div>}
          <div className={classes.input}>
            <label htmlFor="session-input">SessionId</label>
            <input
              id="session-input"
              ref={sessionRef}
              onKeyDown={enterHandler}
            />
          </div>
          <footer className={classes.actions}>
            <Button onClick={okHandler}>OK</Button>
            <Button onClick={props.onCloseOverlay}>Cancel</Button>
          </footer>
        </Card>,
        document.getElementById('modal-overlay')
      )}
    </React.Fragment>
  )
}

export default JoinSessionOverlay
