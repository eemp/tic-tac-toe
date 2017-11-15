const {initializeGame, syncGameState} = require('./game');

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

