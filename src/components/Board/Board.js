import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { boardActions } from '../../store/board'
import './Board.css'
import Piece from './Piece'

const convertFenToBoardMapping = (fen) => {
  const isDigit = (symbol) => {
    return Number.isInteger(+symbol)
  }
  const isUpper = (symbol) => {
    return symbol === symbol.toUpperCase()
  }
  const mappedPieceData = {
    r: 'rook',
    b: 'bishop',
    n: 'knight',
    k: 'king',
    q: 'queen',
    p: 'pawn',
  }

  const boardMapping = []
  const sections = fen.split(' ')
  const positionsSec = sections[0]

  let row = 0
  let col = 0
  let buffRow = Array(8).fill(null)
  for (let symbol of positionsSec) {
    if (symbol === '/') {
      boardMapping.push(buffRow)
      buffRow = Array(8).fill(null)
      row++
      col = 0
    } else if (isDigit(symbol)) {
      col += +symbol
    } else {
      buffRow[col] = {
        pieceColor: isUpper(symbol) ? 'white' : 'black',
        pieceType: mappedPieceData[symbol.toLowerCase()],
      }
      col++
    }
  }
  boardMapping.push(buffRow)
  return boardMapping
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

const Board = () => {
  console.log('render-board')
  const boardState = useSelector((state) => state.board)
  // console.log(boardState)
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
    const colorToMove = boardState.whiteChance ? 'white' : 'black'
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

  const clickHandler = (row, col) => {
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
    <table>
      <tbody>
        {ranks.map((rank, row) => (
          <tr key={rank}>
            {files.map((file, col) => (
              <Piece
                key={file + rank}
                file={file}
                rank={rank}
                row={row}
                col={col}
                squareData={boardMapping[row][col]}
                isActive={
                  moveLock.flag && moveLock.col === col && moveLock.row === row
                }
                onClick={clickHandler.bind(null, row, col)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Board

// rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR
