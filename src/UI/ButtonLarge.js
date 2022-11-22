import React from 'react'

import classes from './ButtonLarge.module.css'

const ButtonLarge = (props) => {
  return (
    <button className={classes['button-large']} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default ButtonLarge
