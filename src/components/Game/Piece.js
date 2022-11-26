import React from 'react'

const Piece = (props) => {
  const row = props.row
  const col = props.col

  const getSquareColor = (rank, file) => {
    if (file === 'a' || file === 'c' || file === 'e' || file === 'g') {
      return +rank & 1 ? 'black' : 'white'
    } else {
      return +rank & 1 ? 'white' : 'black'
    }
  }

  const getPieceClass = () => {
    return props.squareData
      ? `${props.squareData.pieceColor}-${props.squareData.pieceType}`
      : ''
  }

  const squareClasses = `piece ${getSquareColor(
    props.rank,
    props.file
  )} ${getPieceClass()} ${props.isActive ? 'active' : ''}`

  return (
    <td
      id={props.file + props.rank}
      className={squareClasses}
      onClick={props.onClick}
    >
      {props.showCoordinate.rank && (
        <span className="coordinate-rank">{props.rank}</span>
      )}
      {props.showCoordinate.file && (
        <span className="coordinate-file">{props.file}</span>
      )}
    </td>
  )
}

export default Piece
