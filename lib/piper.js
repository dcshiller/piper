const Board = require('./board.js');
var showing = "menu";
var difficultyLevel = 0;
var delay = 3000;
var lowScore;
var score;

const assessDifficulty = function () {
  let arcadeMode = $('#arcadeMode').hasClass("selected");
  if (arcadeMode) {
    difficultyLevel = 0;
    delay = 3000;
  }
  else {
    difficultyLevel = .4;
    delay = 30000;
  }
};

const hideAll = function () {
  $('.modalPanel').addClass("hidden");
};

const gameWon = function () {
  toggleVisibility ("newHighScorePanel");
};

const newGame = function () {
  assessDifficulty();
  $('.modalPanel').addClass("hidden");
  $('.spaceCanvas').remove();
  Board.over = false;
  score = undefined;
  Board.score = -1;
  Board.initializeSpaces();
  Board.createSpaces(difficultyLevel);
  Board.distributeSpaces();
  if (Board.positions["1,3"].shape == "barrier" || Board.positions["14,3"].shape == "barrier")
    {newGame();}
  else {
    setTimeout(Board.startFill.bind(Board), delay);
  }
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

const setArcadeMode = function () {
  $('#puzzleMode').removeClass("selected");
  $('#arcadeMode').addClass("selected");
}

const setPuzzleMode = function () {
  $('#arcadeMode').removeClass("selected");
  $('#puzzleMode').addClass("selected");
}

const show = function (panelName) {
  toggleVisibility(showing)
  toggleVisibility(panelName)
  showing = panelName;
};

const submitScore = function (e) {
  e.preventDefault();
  let data = {};
  data.initials = $('#initials').val();
  data.score = Board.score;
  debugger
  $.ajax( {
    url: "./lib/highScoreHandler.php",
    method: "POST",
    data: {data: data},
    success(){console.log.bind("Success")},
    error(){console.log.bind("Error")}
  });
  toggleVisibility ("highScoresPanel")
};

$( function() {
  Board.initializeSpaces();
  Board.createSpaces(difficultyLevel);
  Board.distributeSpaces();
  Board.gameWonCallback = gameWon;
  // setTimeout(Board.startFill.bind(Board), 5000);
  $('#canvasFrame').click(hideAll);
  $('#canvasFrame').click(Board.handleBoardClick.bind(Board));
  // $('#canvasFrame').dblclick(Board.handleBoardDblClick.bind(Board))
  $('#newGame').click(newGame);
  $('#instructions').click(show.bind(this,"instructionsPanel"));
  $('#instructionsPanel').click(show.bind(this,"menu"));
  $('#highScores').click(show.bind(this,"highScoresPanel"));
  $('#highScoresPanel').click(show.bind(this,"menu"));
  $('form').submit(submitScore)
  $('#gameTitle').click(toggleVisibility.bind(this,"menu"));
  $('#arcadeMode').click(setArcadeMode);
  $('#puzzleMode').click(setPuzzleMode);
  lowScore = window.highScores[window.highScores.length].split(" ")[0];
});
