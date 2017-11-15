const {nextMinimaxAction} = require('./ai-player');
const heuristic = require('./heuristic');

module.exports = {
  initializeGame,
  syncGameState
}

const NEW_GAME_STATE = {
  turn: 1,
  board: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]
};
const EMPTY_CLASS = 'empty';

const GAME_POSITIONS = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2],
];

function initializeGame() {
  syncGameState(NEW_GAME_STATE);
  handleGameRestart();
}

function handleGameRestart() {
  const restartElem = document.getElementById('restart');
  restartElem.onclick = initializeGame;
}

function updateGameBoard(board) {
  const classesByState = [EMPTY_CLASS, 'p1', 'p2'];
  GAME_POSITIONS.forEach(function(position) {
    const [row, col] = position;
    const positionElem = getElementByRowAndCol(row, col);
    const positionState = board[row][col];
    const elemClass = classesByState[positionState];
    positionElem.setAttribute('class', `position ${elemClass}`);
    positionElem.onclick = handlePositionClick;
  });
}

function handlePositionClick(evt) {
  const clickedElem = evt.toElement;
  if(!clickedElem.classList.contains(EMPTY_CLASS)) return;

  const move = getPositionFromElement(clickedElem);
  const currentGameState = getCurrentGameState();
  const nextGameState = getUpdatedGameState(currentGameState, move);
  syncGameState(nextGameState);

  if(!isGameOver(nextGameState)) {
    getAndApplyAIMove();
  }
}

function getPositionFromElement(elem) {
  const {id} = elem;
  const idParts = id.split('-');
  const row = parseInt(idParts[1], 10);
  const col = parseInt(idParts[2], 10);
  return [row, col];
}

function getAndApplyAIMove() {
  const currentGameState = getCurrentGameState();

  const aiMove = nextMinimaxAction({
    availableMovesFromGameState,
    gameState: currentGameState,
    getUpdatedGameState,
    heuristic: heuristic.bind(null, 2) // from pov of player 2
  });
  if(!aiMove) return;

  const nextGameState = getUpdatedGameState(currentGameState, aiMove);
  syncGameState(nextGameState);
}

function syncGameState(gameState) {
  const {board, turn} = gameState;
  setTurn(turn);
  updateGameBoard(board);

  if(isGameOver(gameState)) {
    endGame(gameState);
  }
}

function isGameOver(gameState) {
  const availableMoves = availableMovesFromGameState(gameState);
  return !availableMoves.length;
}

function endGame(gameState) {
  const gameElem = document.getElementById('tic-tac-toe-game');
  gameElem.setAttribute('class', `gameover`);
}

function getCurrentGameState() {
  const turn = getTurn();
  const board = getBoard();
  return {board, turn};
}

function getUpdatedGameState(state, move) {
  const {turn:currentTurn, board} = state;
  const updatedBoard = getUpdatedBoard(board, currentTurn, move);
  const updatedTurn = currentTurn === 1 ? 2 : 1;
  return {board: updatedBoard, turn: updatedTurn};
}

function getUpdatedBoard(board, player, move) {
  const [row, col] = move;
  const updatedBoard = cloneBoard(board);
  updatedBoard[row][col] = player;
  return updatedBoard;
}

function cloneBoard(board) {
  return board.map(function(row) {
    return row.slice();
  });
}

function getTurn() {
  const gameElem = document.getElementById('tic-tac-toe-game');
  return parseInt(gameElem.classList[0].match(/p(1|2)-turn/)[1], 10);
}

function setTurn(player) {
  const gameElem = document.getElementById('tic-tac-toe-game');
  gameElem.setAttribute('class', `p${player}-turn`);
}

function getBoard() {
  const board = [[], [], []];
  GAME_POSITIONS.forEach(function(position) {
    const [row, col] = position;
    const positionElem = getElementByRowAndCol(row, col);
    const positionState = getPositionStateFromElem(positionElem);
    board[row][col] = positionState;
  });
  return board;
}

function getElementByRowAndCol(row, col) {
  return document.getElementById(`pos-${row}-${col}`);
}

function getPositionStateFromElem(positionElem) {
  const stateClass = Array.from(positionElem.classList)
    .find(elemClass => elemClass !== 'position');
  return stateClass !== EMPTY_CLASS ?
    parseInt(stateClass.match(/p(1|2)/)[1], 10) :
    0;
}

function availableMovesFromGameState(gameState) {
  const {board} = gameState;
  const availableMoves = [];

  if(heuristic(gameState.turn, gameState)) return availableMoves;

  GAME_POSITIONS.forEach(function(position) {
    const [row, col] = position;
    const positionState = board[row][col];
    if(!positionState) {
      availableMoves.push([row, col]);
    }
  });
  return availableMoves;
}

