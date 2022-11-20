import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { boardActions } from '../../store/board'
import './Board.css'

const getSquareColor = (rank, file) => {
  if (file === 'a' || file === 'c' || file === 'e' || file === 'g') {
    return +rank & 1 ? 'black' : 'white'
  } else {
    return +rank & 1 ? 'white' : 'black'
  }
}

const convertFenToBoardMapping = (fen) => {
  const isDigit = (symbol) => {
    return Number.isInteger(symbol)
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
  const boardState = useSelector((state) => state.board)
  console.log(boardState)

  const boardMapping = convertFenToBoardMapping(boardState.currentState)
  console.log('boardmapping', boardMapping)

  const getPieceClass = (row, col) => {
    const pieceData = boardMapping[row][col]
    return pieceData ? `${pieceData.pieceColor}-${pieceData.pieceType}` : ''
  }

  return (
    <table>
      {ranks.map((rank, row) => (
        <tr>
          {files.map((file, col) => (
            <td
              className={`${getSquareColor(rank, file)} ${getPieceClass(
                row,
                col
              )}`}
              id={file + rank}
            >
              <span>{rank === '1' && file}</span>
              <span>{file === 'a' && rank}</span>
            </td>
          ))}
        </tr>
      ))}
    </table>
  )
}

export default Board

// rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR
