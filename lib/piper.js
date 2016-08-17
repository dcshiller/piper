const Board = require('./board.js');

$( function() {
  Board.initializeSpaces();
  Board.createSpaces();
  Board.distributeSpaces();
  $('#canvasFrame').click(Board.handleBoardClick.bind(Board))
});
