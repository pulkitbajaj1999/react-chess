import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import io from 'socket.io-client'

import './Board.css'
import { convertFenToBoardMapping } from '../../utils/board'
import { sessionActions } from '../../store/session'
import BoardView from './BoardView'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''
const socket = io(BASE_URL)

const GameSession = (props) => {
  console.log('---------------------------render-session-game')

  const sessionState = useSelector((state) => state.session)
  const dispatch = useDispatch()
  const { id: sessionID, whiteFaceView, currentState } = sessionState
  const boardMapping = convertFenToBoardMapping(currentState)
  const [moveLock, setMoveLock] = useState({
    flag: false,
    row: null,
    col: null,
  })

  // initialize socket functions
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected')
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })
    socket.on('event', (data) => {
      console.log('event-data', data)
      dispatch(sessionActions.updateCurrentState(data.currentState))
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('event')
    }
  }, [])

  const makeMove = (row, col) => {
    const url = BASE_URL + '/api/v1/action'
    console.log('POST/action to ', url)
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionID,
        action: {
          type: 'move',
          payload: {
            from: { row: moveLock.row, col: moveLock.col },
            to: { row, col },
          },
        },
      }),
    })
      .then((res) => {
        console.log('response(POST/action)', res)
        return res.json()
      })
      .then((data) => {
        console.log('data(POST/action)', data)
      })

    setMoveLock({
      flag: false,
      row: null,
      col: null,
    })
  }

  const lockSquare = (row, col) => {
    setMoveLock({
      flag: true,
      row,
      col,
    })
  }

  const alertInvalidFrom = () => {
    console.log('invalid from')
  }

  const alertInvalidTo = () => {
    console.log('invalid to')
  }

  const checkValidityFrom = (row, col) => {
    const squareData = boardMapping[row][col]
    return squareData ? true : false
  }

  const checkValidityTo = (row, col) => {
    const lockedSquareData = boardMapping[moveLock.row][moveLock.col]
    const toSquareData = boardMapping[row][col]
    return (
      toSquareData === null ||
      lockedSquareData.pieceColor !== toSquareData.pieceColor
    )
  }

  const clickHandler = (row = 0, col = 0) => {
    if (moveLock.flag === false) {
      checkValidityFrom(row, col)
        ? lockSquare(row, col)
        : alertInvalidFrom(row, col)
    } else if (moveLock.row === row && moveLock.col === col) {
      setMoveLock({ flag: false, row: null, col: null })
    } else {
      checkValidityTo(row, col) ? makeMove(row, col) : alertInvalidTo(row, col)
    }
  }

  return (
    <div className="board-component">
      <BoardView
        moveLock={moveLock}
        boardMapping={boardMapping}
        whiteFaceView={whiteFaceView}
        onClick={clickHandler}
      />
    </div>
  )
}

export default GameSession
