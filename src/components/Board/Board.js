import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import io from 'socket.io-client'

import './Board.css'
import Piece from './Piece'
import { convertFenToBoardMapping } from '../../utils/board'
import { boardActions } from '../../store/board'
import session from '../../store/session'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''
const socket = io(BASE_URL)
const clientID = Math.random().toString()

const BoardView = (props) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']
  const boardPiecesMatrix = []

  for (let i = 0; i < 8; i++) {
    const currRowData = []
    for (let j = 0; j < 8; j++) {
      const [row, col] = props.whiteFaceView ? [i, j] : [7 - i, 7 - j]
      const rank = ranks[row]
      const file = files[col]
      const showCoordinate = props.whiteFaceView
        ? { rank: col === 0, file: row === 7 }
        : { rank: col === 7, file: row === 0 }
      currRowData.push(
        <Piece
          key={file + rank}
          file={file}
          rank={rank}
          row={row}
          col={col}
          squareData={props.boardMapping[row][col]}
          isActive={
            props.moveLock.flag &&
            props.moveLock.col === col &&
            props.moveLock.row === row
          }
          showCoordinate={showCoordinate}
          onClick={props.onClick.bind(null, row, col)}
        />
      )
    }
    boardPiecesMatrix.push(
      <tr key={i} className={`row-${i}`}>
        {currRowData}
      </tr>
    )
  }
  return (
    <table className={`board ${props.face}-view`}>
      <tbody>{boardPiecesMatrix}</tbody>
    </table>
  )
}

const Board = () => {
  console.log('---------------------------render-board')

  const boardState = useSelector((state) => state.board)
  const boardMapping = convertFenToBoardMapping(boardState.currentState)

  const sessionState = useSelector((state) => state.session)
  const dispatch = useDispatch()

  const [moveLock, setMoveLock] = useState({
    flag: false,
    row: null,
    col: null,
  })

  const [socketIsConnected, setSocketIsConnected] = useState(false)
  const [events, setEvents] = useState([])

  // initialize socket functions
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected')
      // setSocketIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected')
      // setSocketIsConnected(false)
    })
    socket.on('event', (data) => {
      console.log('event-data', data)
      if (data.clientID === clientID) {
        console.log('event-on-same-client')
      } else {
        setEvents((state) => [...state, data])
      }
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('event')
    }
  }, [])

  // fetch new board state from backend
  const url =
    BASE_URL + '/api/v1/session/existing' + `?sessionID=${sessionState.id}`
  useEffect(() => {
    console.log('GET/existing-session', url)
    fetch(url)
      .then((res) => {
        console.log('response(fetch-existing-session)', res)
        return res.json()
      })
      .then((data) => {
        console.log('data(fetch-existing-session)', data)
        console.log('dispatching-loadSession')
        dispatch(boardActions.loadSession({ boardState: data.boardState }))
      })
  }, [events])

  // update session
  useEffect(() => {
    const sessionID = sessionState.id
    if (sessionID) {
      const url = BASE_URL + '/api/v1/session/update'
      console.log('POST/update-session')
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientID: clientID,
          sessionID: sessionState.id,
          boardState: boardState,
        }),
      })
        .then((res) => {
          console.log('response(update-session)', res)
          return res.json()
        })
        .then((data) => {
          console.log('data(update-session)', data)
        })
    }
  }, [boardState])

  const makeMove = (row, col) => {
    dispatch(
      boardActions.makeMove({
        from: { row: moveLock.row, col: moveLock.col },
        to: { row, col },
      })
    )
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
    const colorToMove = boardState.whiteToMove ? 'white' : 'black'
    return squareData && squareData.pieceColor === colorToMove
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
        whiteFaceView={sessionState.whiteFaceView}
        onClick={clickHandler}
      />
    </div>
  )
}

export default Board
