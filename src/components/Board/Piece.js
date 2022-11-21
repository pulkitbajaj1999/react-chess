import React from 'react'

const Piece = (props) => {
  console.log('render-piece')
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

  const squareClasses = `${getSquareColor(
    props.rank,
    props.file
  )} ${getPieceClass()} ${props.isActive ? 'active' : ''}`

  return (
    <td
      id={props.file + props.rank}
      className={squareClasses}
      onClick={props.onClick}
    >
      <span>{props.rank === '1' && props.file}</span>
      <span>{props.file === 'a' && props.rank}</span>
    </td>
  )
}

export default Piece
