const Board = require('./board.js');
Board.increment = 100;
var showing = "menu";
var difficultyLevel = 0;
var delay = 3000;
var lowScore;
var arcadeMode = false;
var score;

const assessDifficulty = function () {
  arcadeMode = $('#arcadeMode').hasClass("selected");
  if (arcadeMode) {
    difficultyLevel = 0;
    delay = 3000;
    Board.increment = 100;
  }
  else {
    difficultyLevel = .4;
    delay = 30000;
    Board.increment = 400;
  }
};

const countDown = function (timeLeft) {
  if (timeLeft < 100)
    {
      $('#countdown').text(0);
      setTimeout($('#countdown').text.bind($('#countdown'), ""), 1000);
      Board.startFill(Board)
    }
  else {
    let stringTime = String(timeLeft);
    if (stringTime.length >= 4)
      {stringTime = stringTime.slice(0, stringTime.length - 3) +
        "." +
        stringTime.slice(stringTime.length - 3, stringTime.length - 1)}
    $('#countdown').text(stringTime);
    setTimeout(countDown.bind(null, timeLeft - 100), 100);
  }
}

const hideAll = function () {
  $('.modalPanel').addClass("hidden");
};

const gameWon = function () {
  if (Board.score > lowScore && arcadeMode) {
    toggleVisibility ("newHighScorePanel");
  }
  else {
    $('#scoreReport').text(score);
    toggleVisibility ("winPanel");
  }
};

const gameLost = function () {
  $('#distanceReport').text(distance);
  toggleVisibility ("lossPanel");
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
    countDown(delay);
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
};

const setPuzzleMode = function () {
  $('#arcadeMode').removeClass("selected");
  $('#puzzleMode').addClass("selected");
};

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
  $.ajax( {
    url: "./lib/highScoreHandler.php",
    method: "POST",
    data: {data: data},
    success(){console.log.bind("Success")},
    error(){console.log.bind("Error")}
  });
  updateHighScore(data.score, data.initials);
  toggleVisibility ("newHighScorePanel");
  toggleVisibility ("highScoresPanel");
};

const updateHighScore = function (score, initials) {
  $(".highscore").last().remove();
  for(let i = 0; i < 5; i++){
    if(parseInt(window.highScores[i]) < score){
      let newHighScores = window.highScores.slice(0,i);
      newHighScores.push(`${score} + ${initials}`);
      newHighScores.concat(window.highScores.slice(i));
      window.highScores = newHighScores;
      $(`<li>${score} ${initials}</li>`).insertBefore($(`.highscore:nth-of-type(${i+1})`));
      break;
    }
  }
};

$( function() {
  Board.initializeSpaces();
  Board.createSpaces(difficultyLevel);
  Board.distributeSpaces();
  Board.gameWonCallback = gameWon;
  Board.gameLostCallback = gameLost;
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
  lowScore = window.highScores[window.highScores.length - 1].split(" ")[0];
});
