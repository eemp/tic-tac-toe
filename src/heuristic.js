module.exports = function(pov, gameState) {
  const {turn, board} = gameState;
  const diagonalGroups = getDiagonals(board);
  const keyPositionGroups = [
    getRow(board, 0), getRow(board, 1), getRow(board, 2),
    getCol(board, 0), getCol(board, 1), getCol(board, 2),
    diagonalGroups[0], diagonalGroups[1]
  ];

  const completeGroup = keyPositionGroups.find(group => {
    return getGroupValue(group);
  });
  const completeGroupVal = getGroupValue(completeGroup);

  return completeGroupVal ?
    (completeGroupVal === pov ? 1 : -1) :
    0;
}

function getRow(board, row) {
  return [board[row][0], board[row][1], board[row][2]];
}

function getCol(board, col) {
  return [board[0][col], board[1][col], board[2][col]];
}

function getDiagonals(board) {
  return [
    [board[0][0], board[1][1], board[2][2]],
    [board[2][0], board[1][1], board[0][2]]
  ];
}

function getGroupValue(positions) {
  const gameoverState = positions && positions[0] &&
    positions[0] === positions[1] && positions[1] === positions[2];
  return gameoverState ? positions[0] : 0;
}

