import React from 'react'

import classes from './ButtonNav.module.css'

const ButtonNav = (props) => {
  return (
    <button className={classes['button-nav']} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default ButtonNav
