import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './Board.css'
import { convertFenToBoardMapping } from '../../utils/board'
import { boardActions } from '../../store/board'
import BoardView from './BoardView'

const GameLocal = () => {
  console.log('---------------------------render-local-game')
  // global states
  const boardState = useSelector((state) => state.board)
  const dispatch = useDispatch()
  // local states
  const [moveLock, setMoveLock] = useState({
    flag: false,
    row: null,
    col: null,
  })
  // local variables
  const boardMapping = convertFenToBoardMapping(boardState.currentState)
  const whiteFaceView = boardState.whiteFaceView

  // handlers
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
        whiteFaceView={whiteFaceView}
        onClick={clickHandler}
      />
    </div>
  )
}

export default GameLocal
