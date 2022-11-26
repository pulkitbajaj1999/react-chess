import React from 'react'
import Piece from './Piece'

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

export default BoardView
