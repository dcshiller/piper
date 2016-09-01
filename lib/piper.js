const Board = require('./board.js');
Board.increment = 100;
var showing = "menu";
var difficultyLevel = 0;
var delay = 3000;
var lowScore;
var arcadeMode = true;
var challengeMode = false;
var score;
var startTimeout = undefined;

const assessDifficulty = function () {
  arcadeMode = $('#arcadeMode').hasClass("selected");
  puzzleMode = $('#puzzleMode').hasClass("selected");
  challengeMode = $('#challengeMode').hasClass("selected");
  if (arcadeMode) {
    difficultyLevel = 0;
    delay = 3000;
    Board.increment = 100;
  }
  else if (puzzleMode){
    difficultyLevel = .4;
    delay = 30000;
    Board.increment = 150;
  }
  else if (challengeMode) {
    difficultyLevel = 0;
    delay = 5000//15000;
    Board.increment = 150;
  }
};

const assignHandlers = function () {
  $('#canvasFrame').click(hideAll);
  $('#menu h2').click(hideAll);
  $('#canvasFrame').click(Board.handleBoardClick.bind(Board, undefined));
  $('#canvasFrame').contextmenu(Board.handleBoardClick.bind(Board, "rightclick"));
  $('.newGame').click(newGame);
  $('#instructions').click(show.bind(this,"instructionsPanel"));
  $('#instructionsPanel').click(show.bind(this,"menu"));
  $('#highScores').click(show.bind(this,"highScoresPanel"));
  $('#highScoresPanel').click(show.bind(this,"menu"));
  $('form').submit(submitScore)
  $('#gameTitle').click(handleTitleClick);
  $('#arcadeMode').click(setArcadeMode);
  $('#challengeMode').click(setChallengeMode);
  $('#puzzleMode').click(setPuzzleMode);
  $('#lossPanel').click(hideAll);
  $('#winPanel').click(hideAll);
};

const countDown = function (timeLeft) {
  if (timeLeft < 100)
    {;
      $('#countdown').text(0);
      startTimeout = setTimeout($('#countdown').text.bind($('#countdown'), ""), 1000);
      Board.startFill(challengeMode)
    }
  else {
    let stringTime = String(timeLeft);
    if (stringTime.length >= 4)
      {stringTime = stringTime.slice(0, stringTime.length - 3) +
        "." +
        stringTime.slice(stringTime.length - 3, stringTime.length - 1)}
    else {stringTime = "0." + stringTime.slice(0,2) }
    $('#countdown').text(stringTime);
    startTimeout = setTimeout(countDown.bind(null, timeLeft - 100), 100);
  }
};

const handleTitleClick = function () {
  toggleVisibility("menu");
  $('#menuIndicator').text("");
};

const hideAll = function () {
  $('.modalPanel').addClass("hidden");
};

const gameWon = function () {
  if (Board.score > lowScore && arcadeMode) {
    toggleVisibility ("newHighScorePanel");
  }
  else {
    $('#scoreReport').text(Board.score);
    toggleVisibility ("winPanel");
  }
  $('#menuIndicator').show();
};

const gameLost = function (xDistance, yDistance) {
  let distance = Math.abs(xDistance - 15) + Math.abs(yDistance - 3);
  $('#distanceReport').text(distance);
  toggleVisibility ("lossPanel");
  $('#menuIndicator').show();
};

const newGame = function () {
  $('#menuIndicator').hide();
  clearTimeout(startTimeout);
  clearTimeout(Board.spillTimeout);
  assessDifficulty();
  $('.modalPanel').addClass("hidden");
  $('.spaceCanvas').remove();
  score = undefined;
  $('#score').text("-");
  Board.setup();
  Board.initializeSpaces();
  Board.createSpaces(difficultyLevel);
  Board.distributeSpaces(challengeMode);
  if (!challengeMode && Board.positions["1,3"].shape == "barrier" || Board.positions["14,3"].shape == "barrier")
    {newGame();}
    //   if (challengeMode && (Board.positions["1,3"].shape == "barrier" ||
    //   Board.positions["1,4"].shape == "barrier" ||
    //   Board.positions["14,0"].shape == "barrier" ||
    //   Board.positions["13,0"].shape == "barrier" ||
    //   Board.positions["14,7"].shape == "barrier" ||
    //   Board.positions["13,7"].shape == "barrier" ||
    // )) {newGame();}
  else {
    countDown(delay);
  }
};

const setArcadeMode = function () {
  $('#puzzleMode').removeClass("selected");
  $('#challengeMode').removeClass("selected");
  $('#arcadeMode').addClass("selected");
};

const setChallengeMode = function () {
  $('#puzzleMode').removeClass("selected");
  $('#arcadeMode').removeClass("selected");
  $('#challengeMode').addClass("selected");
};

const setPuzzleMode = function () {
  $('#arcadeMode').removeClass("selected");
  $('#challengeMode').removeClass("selected");
  $('#puzzleMode').addClass("selected");
};

const show = function (panelName) {
  toggleVisibility(showing)
  toggleVisibility(panelName)
  showing = panelName;
};

const showOrHideFooter = function () {
  if (window.innerHeight < 600) {$('footer').hide();}
  else {$('footer').show();}
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

const toggleVisibility = function (panelName) {
  $('#menuIndicator').hide();
  if (panelName == undefined){return}
  if (showing == "lossPanel"){  $(`#lossPanel`).addClass("hidden")}
  // if (showing == "instructionsPanel"){  $(`#instructionsPanel`).addClass("hidden")}
  if ($(`#${panelName}`).hasClass("hidden")){
    $(`#${panelName}`).removeClass("hidden");
    showing = panelName;
    // if (panelName == "menu"){}
   }
  else {
    $(`#${panelName}`).addClass("hidden");
    showing = undefined;
  };
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
  if (window.innerHeight < 600) {$('footer').hide();}
  $(window).resize(showOrHideFooter);
  assignHandlers();
  lowScore = window.highScores[window.highScores.length - 1].split(" ")[0];
});
