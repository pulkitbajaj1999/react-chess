import React from 'react'
import ReactDOM from 'react-dom'

import Modal from '../../UI/Modal'
import Card from '../../UI/Card'
import Button from '../../UI/Button'
import Backdrop from '../../UI/Backdrop'
import classes from './JoinSessionOverlay.module.css'

const NewSessionOverlay = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onCloseOverlay} />,
        document.getElementById('backdrop')
      )}
      {ReactDOM.createPortal(
        <Card className={classes.modal}>
          <header className={classes.header}>
            <h2>New Session</h2>
          </header>
          <div className={classes.content}>
            <p>Confirm abort the current session ?</p>
          </div>
          <footer className={classes.actions}>
            <Button onClick={props.onConfirm}>Confirm</Button>
            <Button onClick={props.onCloseOverlay}>Cancel</Button>
          </footer>
        </Card>,
        document.getElementById('modal-overlay')
      )}
    </React.Fragment>
  )
}

export default NewSessionOverlay
