const Board = require('./board.js');

$( function() {
  Board.initializeSpaces();
  Board.createSpaces();
  Board.distributeSpaces();
  setTimeout(Board.startFill.bind(Board), 5000);
  $('#canvasFrame').click(Board.handleBoardClick.bind(Board))
});
