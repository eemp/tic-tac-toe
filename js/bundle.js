/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const {initializeGame, syncGameState} = __webpack_require__(1);

//const initialState = {
  //board: [
    //[0, 1, 0],
    //[0, 2, 0],
    //[1, 0, 0],
  //],
  //turn: 2,
//};

function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  initializeGame();
  //syncGameState(initialState);
});



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const {nextMinimaxAction} = __webpack_require__(2);
const heuristic = __webpack_require__(3);

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



/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
  nextMinimaxAction
};

function nextMinimaxAction(game) {
  const {availableMovesFromGameState, gameState, getUpdatedGameState} = game;
  const availableMoves = availableMovesFromGameState(gameState);

  let bestMoves = [];
  let bestAlphaBeta = -Infinity;
  for(var possibleMoveIdx = 0; possibleMoveIdx < availableMoves.length; possibleMoveIdx++) {
    const possibleMove = availableMoves[possibleMoveIdx];
    const possibleGame = Object.assign({}, game, {
      gameState: getUpdatedGameState(gameState, possibleMove)
    });
    const alphabetaRating = alphabeta(possibleGame, Infinity, -Infinity, Infinity, false);
    if(alphabetaRating >= bestAlphaBeta) {
      bestMoves = alphabetaRating === bestAlphaBeta ?
        bestMoves.concat([possibleMove]) :
        [possibleMove];
      bestAlphaBeta = alphabetaRating;
    }
  }

  const randMoveIdx = Math.floor(Math.random() * bestMoves.length);
  return bestMoves.length ?
    bestMoves[randMoveIdx] :
    null;
}

// based on wiki pseudocode
function alphabeta(game, depth, alpha, beta, maximizingPlayer) {
  const {availableMovesFromGameState, gameState, heuristic} = game;
  const possibleGames = getNextPossibleGames(game);
  const isTerminalNode = possibleGames.length === 0;
  if(depth === 0 || isTerminalNode) {
    return heuristic(gameState, 2); // TODO: here
  }

  let v;
  if(maximizingPlayer) {
    v = -Infinity;
    for(var possibleGameIdx = 0; possibleGameIdx < possibleGames.length; possibleGameIdx++) {
      v = Math.max(v, alphabeta(possibleGames[possibleGameIdx], depth-1, alpha, beta, false));
      alpha = Math.max(alpha, v);
      if(beta <= alpha) break;
    }
  }
  else {
    v = Infinity;
    for(var possibleGameIdx = 0; possibleGameIdx < possibleGames.length; possibleGameIdx++) {
      v = Math.min(v, alphabeta(possibleGames[possibleGameIdx], depth-1, alpha, beta, true));
      beta = Math.min(beta, v);
      if(beta <= alpha) break;
    }
  }

  return v;
}

function getNextPossibleGames(game) {
  const {availableMovesFromGameState, gameState, getUpdatedGameState} = game;
  const availableMoves = availableMovesFromGameState(gameState);
  return availableMoves.map(function(move) {
    return Object.assign({}, game, {
      gameState: getUpdatedGameState(gameState, move)
    });
  });
}



/***/ }),
/* 3 */
/***/ (function(module, exports) {

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



/***/ })
/******/ ]);