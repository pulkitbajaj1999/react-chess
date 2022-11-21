import React from 'react'

import classes from './Navigation.module.css'

const Navigation = () => {
  return (
    <div className={classes['nav-component']}>
      <div className={classes['nav-link-component']}>Chess19</div>
      <div className={classes['nav-link-component']}>Play</div>
      <div className={classes['nav-link-component']}>Friends</div>
    </div>
  )
}

export default Navigation
