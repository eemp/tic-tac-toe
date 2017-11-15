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

