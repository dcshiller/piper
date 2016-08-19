const Board = require('./board.js');
var showing = "menu";

const hideAll = function () {
  $('.modalPanel').addClass("hidden");
}

const newGame = function () {
  $('.modalPanel').addClass("hidden");
  $('.spaceCanvas').remove();
  Board.initializeSpaces();
  Board.createSpaces();
  Board.distributeSpaces();
  setTimeout(Board.startFill.bind(Board), 5000);
};

const toggleVisibility = function (panelName) {
  if (panelName == undefined){return}
  if ($(`#${panelName}`).hasClass("hidden")){
    $(`#${panelName}`).removeClass("hidden");
    showing = panelName;}
  else {
    $(`#${panelName}`).addClass("hidden");
    showing = undefined;
  }
};

const show = function (panelName) {
  toggleVisibility(showing)
  toggleVisibility(panelName)
  showing = panelName;
};

$( function() {
  Board.initializeSpaces();
  Board.createSpaces();
  Board.distributeSpaces();
  // setTimeout(Board.startFill.bind(Board), 5000);
  $('#canvasFrame').click(hideAll);
  $('#canvasFrame').click(Board.handleBoardClick.bind(Board))
  $('#newGame').click(newGame)
  $('#instructions').click(show.bind(this,"instructionsPanel"))
  $('#instructionsPanel').click(show.bind(this,"menu"))
  $('#gameTitle').click(toggleVisibility.bind(this,"menu"))
});
