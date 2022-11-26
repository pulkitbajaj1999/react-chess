export const convertFenToBoardMapping = (fen) => {
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

export const getExpandedState = (fen) => {
  fen = fen.replace(/1/g, '.')
  fen = fen.replace(/2/g, '..')
  fen = fen.replace(/3/g, '...')
  fen = fen.replace(/4/g, '....')
  fen = fen.replace(/5/g, '.....')
  fen = fen.replace(/6/g, '......')
  fen = fen.replace(/7/g, '.......')
  fen = fen.replace(/8/g, '........')
  let matrix = fen.split('/').map((row) => Array.from(row))
  return matrix
}

export const getFenFromExpandedState = (expandedState) => {
  let fen = ''
  for (let row of expandedState) {
    let buff = 0
    for (let el of row) {
      if (el === '.') buff++
      else {
        if (buff) {
          fen += buff.toString()
          buff = 0
        }
        fen += el
      }
    }
    if (buff) {
      fen += buff.toString()
      buff = 0
    }
    fen += '/'
  }
  return fen.substring(0, fen.length - 1)
}
