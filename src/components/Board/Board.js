import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './Board.css'
import Piece from './Piece'
import { convertFenToBoardMapping } from '../../utils/board'
import { boardActions } from '../../store/board'

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
  console.log('render-board')
  const boardState = useSelector((state) => state.board)
  const dispatch = useDispatch()

  const boardMapping = convertFenToBoardMapping(boardState.currentState)
  // console.log('boardmapping', boardMapping)

  const [moveLock, setMoveLock] = useState({
    flag: false,
    row: null,
    col: null,
  })

  const makeMove = (row, col) => {
    console.log('making move')
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
        whiteFaceView={boardState.whiteFaceView}
        onClick={clickHandler}
      />
    </div>
  )
}

export default Board
