const convertFenToBoardMapping = (fen) => {
  const isDigit = (symbol) => {
    return Number.isInteger(symbol)
  }
  const isUpper = (symbol) => {
    return symbol === symbol.toUpperCase()
  }
  const mappedPieceData = {
    r: 'Rook',
    b: 'Bishop',
    n: 'Knight',
    k: 'King',
    q: 'Queen',
    p: 'Pawn',
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
