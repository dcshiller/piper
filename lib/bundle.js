/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);
	Board.increment = 100;
	var showing = "menu";
	var difficultyLevel = 0;
	var delay = 3000;
	var lowScore;
	var arcadeMode = false;
	var score;
	var startTimeout = undefined;

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
	    Board.increment = 150;
	  }
	};

	const countDown = function (timeLeft) {
	  if (timeLeft < 100)
	    {;
	      $('#countdown').text(0);
	      startTimeout = setTimeout($('#countdown').text.bind($('#countdown'), ""), 1000);
	      Board.startFill(Board)
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
	  Board.setup();
	  Board.initializeSpaces();
	  Board.createSpaces(difficultyLevel);
	  Board.distributeSpaces();
	  if (Board.positions["1,3"].shape == "barrier" || Board.positions["14,3"].shape == "barrier")
	    {newGame();}
	  else {
	    countDown(delay);
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
	  // setTimeout(Board.startFill.bind(Board), 5000);
	  $('#canvasFrame').click(hideAll);
	  // $(document).click(hideAll);
	  $('#menu h2').click(hideAll);
	  $('#canvasFrame').click(Board.handleBoardClick.bind(Board));
	  // $('#canvasFrame').dblclick(Board.handleBoardDblClick.bind(Board))
	  $('#newGame').click(newGame);
	  $('#instructions').click(show.bind(this,"instructionsPanel"));
	  $('#instructionsPanel').click(show.bind(this,"menu"));
	  $('#highScores').click(show.bind(this,"highScoresPanel"));
	  $('#highScoresPanel').click(show.bind(this,"menu"));
	  $('form').submit(submitScore)
	  $('#gameTitle').click(handleTitleClick);
	  $('#arcadeMode').click(setArcadeMode);
	  $('#puzzleMode').click(setPuzzleMode);
	  $('#lossPanel').click(hideAll);
	  $('#winPanel').click(hideAll);
	  lowScore = window.highScores[window.highScores.length - 1].split(" ")[0];
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Space = __webpack_require__(2);
	const EXIT_DIRECTION_CONVERTER = { top: "bottom", bottom: "top", left: "right", right: "left" }
	//
	// var boardCanvas = $('#boardCanvas')[0];

	const Board = {
	  spaces: [],
	  positions: {},
	  score: -1,
	  over: false,
	  increment: 100,
	  started: false,

	  addOneToScore () {
	    this.score += 1;
	    $('#score').text(this.score);
	  },

	  considerSwitch (x,y,i,j) {
	    if (this.positions[i + "," + j].shape == "empty"
	      ){
	      this.switchSpaces(x, y, i, j);
	      return true;
	    }
	  },

	  createSpaces (difficultyLevel) {
	    while (this.spaces.length < 127) {
	      let randomization;
	      randomization = Math.floor(Math.random()*3 + difficultyLevel);
	      // if (!arcadeMode) {randomization = Math.floor(Math.pow(Math.random()*1.3, 2) + .8);}
	      switch (randomization){
	        case 0 :
	        let elbowSpace = new Space("elbow", this.increment);
	        let rotation = (Math.floor(Math.random() * 4)) * 90;
	        $(elbowSpace.getCanvas()).css("transform", `rotate(${rotation}deg)`);
	        this.spaces.push(elbowSpace);
	        break;
	        case 1 :
	        this.spaces.push(new Space("straight", this.increment));
	        break;
	        case 2 :
	        this.spaces.push(new Space("plus", this.increment));
	        break;
	        case 3 :
	        this.spaces.push(new Space("barrier", this.increment))
	      }
	    };
	  },

	  distributeSpaces () {
	    for (let i = 0; i < 16; i++ ){
	      for (let j = 0; j < 8; j++){
	        if (j == 3 && i == 0) {nextSpace = new Space("entry", this.increment);}
	        else if (j == 4 && i == 7) {nextSpace = new Space("empty", this.increment);}
	        else if (j == 3 && i == 15) {nextSpace = new Space("exit", this.increment);}
	        else { nextSpace = this.spaces.pop(); }
	        this.positions[i + "," + j] = nextSpace;
	        nextSpace.assignCoords(i,j);
	        $('#canvasFrame').append(nextSpace.getCanvas());
	      }
	    }
	  },

	  fillNextSpace (lastX, lastY, lastExitDirection) {
	    if(this.over || !this.started) {return};
	    this.addOneToScore();
	    if(lastExitDirection == "offboard"){this.gameWon(); return;}
	    let nextSpaceLocation = this.getNextSpace(lastX, lastY, lastExitDirection);
	    let nextSpace = this.positions[nextSpaceLocation[0] + "," + nextSpaceLocation[1]];
	    if (!nextSpace) {this.spill(lastX, lastY, lastExitDirection); return;}
	    let entryDirection = EXIT_DIRECTION_CONVERTER[lastExitDirection];
	    nextSpace.fill(entryDirection,
	                  this.fillNextSpace.bind(this, nextSpaceLocation[0], nextSpaceLocation[1]),
	                  this.spill.bind(this, nextSpaceLocation[0], nextSpaceLocation[1]));
	  },

	  gameWon () {
	    this.gameWonCallback(this.score);
	  },

	  getNextSpace (lastX, lastY, lastExitDirection) {
	    let newX, newY;
	    switch (lastExitDirection) {
	      case "top" :
	        newY = lastY - 1;
	        newX = lastX;
	        break;
	      case "bottom" :
	        newX = lastX;
	        newY = lastY + 1;
	        break;
	      case "left" :
	        newX = lastX - 1;
	        newY = lastY;
	        break;
	      case "right" :
	        newX = lastX + 1;
	        newY = lastY;
	        break;
	    }
	    return [newX, newY];
	  },

	  handleBoardClick(e){
	    e.preventDefault();
	    let x = parseInt(e.target.style.left)/50
	    let y = parseInt(e.target.style.top)/50
	    let clickedSpace = this.positions[x + "," + y];
	    if(!clickedSpace || clickedSpace.locked || clickedSpace.shape == "barrier") {return}
	    let switched;
	    // if (!clickedSpace.locked)
	    switched = this.searchForEmpty(x,y)
	    if (!switched) {
	      clickedSpace.rotate();
	    }

	    // clickedSpace = this.positions[x + "," + y]
	  },

	  initializeSpaces () {
	    let boardCanvas = $('#boardCanvas')[0];
	    let ctx = boardCanvas.getContext('2d');
	    ctx.clearRect(0, 0, 800, 400);
	    ctx.beginPath();
	    let space_dimensions = 50;
	    for(let horizontal= 0; horizontal <= 450; horizontal+= space_dimensions ){
	      ctx.moveTo(0,horizontal);
	      ctx.lineTo(800,horizontal);
	      ctx.stroke();
	    }
	    for(let vertical= 0; vertical <= 800; vertical+= space_dimensions ){
	      ctx.moveTo(vertical, 0);
	      ctx.lineTo(vertical, 400);
	      ctx.stroke();
	    }
	  },

	  searchForEmpty (x,y) {
	    for( let i = -1; i <= 1; i++){
	      if( i == 0) { continue }
	      if( x + i >= 0 && x + i <= 15)
	        {
	          if (this.considerSwitch(x,y, x+i, y))
	            {return true}
	        }
	      if( y + i >= 0 && y + i <= 7)
	        {
	          if(this.considerSwitch(x,y, x, y+i))
	            {return true}
	        }
	    }
	  },

	  setup ( ) {
	    this.over = false;
	    this.started = false;
	    this.score = -1;
	  },

	  // setGameWonCallback (callback) {
	  //   this.gameWonCallback = callback;
	  // },

	  spill (lastSpaceX, lastSpaceY, lastExitDirection, level) {
	    if (level == undefined) { this.over = true; level = 0; this.gameLostCallback(lastSpaceX, lastSpaceY);}
	    else if (this.over){
	      let boardCanvas = $('#boardCanvas')[0];
	      let ctx = boardCanvas.getContext('2d');
	      ctx.beginPath();
	      let sideX = 0
	      let sideY = 0
	      switch (lastExitDirection){
	        case "top" :
	          sideX = 25;
	          break;
	        case "bottom" :
	          sideX = 25;
	          sideY = 50;
	          break;
	        case "left" :
	          sideY = 25;
	          break;
	        case "right" :
	          sideX = 50;
	          sideY = 25;
	      }
	      ctx.arc (lastSpaceX*50 + sideX, lastSpaceY*50 + sideY, level, 0, (2*Math.PI));
	      ctx.fillStyle = "green";
	      ctx.fill();
	    }
	    if(!this.over){return}
	    this.spillTimeout = setTimeout(this.spill.bind(this, lastSpaceX, lastSpaceY, lastExitDirection, level + 15/(level+1)), 100);
	  },

	  startFill () {
	    this.started = true;
	    this.positions[0 + "," + 3].fill("offboard", this.fillNextSpace.bind(this,0,3), this.spill.bind(this, 0, 3));
	  },

	  switchSpaces (i,j,u,v) {
	    let firstSpace = this.positions[i + "," + j];
	    let secondSpace = this.positions[u + "," + v];
	    this.positions[i + "," + j] = secondSpace;
	    secondSpace.assignCoords(i, j);
	    this.positions[u + "," + v] = firstSpace;
	    firstSpace.assignCoords(u,v);
	  }

	}


	module.exports = Board;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const Space = function(shape, increment){
	  this.id = (Math.random()*10000)%10000;
	  this.shape = shape || "elbow"
	  this.makeCanvas();
	  this.increment = increment;
	};

	const OPPOSITE = {
	  top: "bottom",
	  bottom: "top",
	  right: "left",
	  left: "right"
	};

	const ClOCKWISE = {
	  top: "right",
	  bottom: "left",
	  right: "bottom",
	  left: "top"
	};

	const COUNTER_CLOCKWISE = {
	  top: "left",
	  bottom: "right",
	  right: "top",
	  left: "bottom"
	};

	Space.prototype.addRotationHandler = function (e) {
	  e.preventDefault();
	  if( this.locked ){return}
	  $(document).mousemove(this.mouseMoveHandler.bind(this, e.pageX, e.pageY, this.getRotation()))
	  $(document).mouseup(this.snapAndResetHandlers.bind(this))
	};

	Space.prototype.assignCoords = function (x,y) {
	  let spaceCanvas = this.getCanvas();
	  this.x = x;
	  this.y = y;
	  spaceCanvas.style.left = `${x*50}px`;
	  spaceCanvas.style.top = `${y*50}px`;
	};

	Space.prototype.calculateRotatedDirection = function (direction, inverse) {
	  let rotations = (this.getRotation()%360)/90 ;
	  if(inverse) { rotations = rotations * -1 }
	  let newDirection = direction;
	  for (let i = 0; i < rotations && rotations > 0; i++) {
	    newDirection = ClOCKWISE[newDirection]
	  }
	  for (let i = 0; i < -1*rotations && rotations < 0; i++) {
	    newDirection = COUNTER_CLOCKWISE[newDirection]
	  }
	  return newDirection
	};

	Space.prototype.drawBarrier = function () {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.rect(0,0,50,50);
	  ctx.fillStyle = "black";
	  ctx.fill();
	  ctx.stroke();
	};

	Space.prototype.drawElbow = function () {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.arc (0, 0, 25, 0, 1 * Math.PI);
	  ctx.lineWidth =  15;
	  ctx.stroke();
	};

	Space.prototype.drawEmpty = function () {
	  let spaceCanvas = this.getCanvas();
	  $(spaceCanvas).css('z-index',-1);
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.rect(2,2,50,50);
	  ctx.fillStyle = '#d7d7d7';
	  ctx.fill();
	  ctx.rect(2,2,48,48);
	  ctx.lineWidth = 2;
	  ctx.strokeStyle = 'grey';
	  ctx.stroke();
	  ctx.rect(0,0,49,49);
	  ctx.lineWidth = 3;
	  ctx.strokeStyle = 'grey';
	  ctx.stroke();
	};

	Space.prototype.drawEntryPipe = function () {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (0,25);
	  ctx.lineTo (45, 25);
	  ctx.moveTo (45, 10);
	  ctx.lineTo (45, 40);
	  ctx.lineWidth =  15;
	  ctx.stroke();
	};

	Space.prototype.drawExitPipe = function () {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (50,25);
	  ctx.lineTo (5, 25);
	  ctx.moveTo (5, 10);
	  ctx.lineTo (5, 40);
	  ctx.lineWidth =  15;
	  ctx.stroke();
	};

	Space.prototype.drawPlus = function() {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (25,0);
	  ctx.lineTo (25, 50);
	  ctx.moveTo (0, 25);
	  ctx.lineTo (52, 25);
	  ctx.lineWidth =  15;
	  ctx.stroke();
	};

	Space.prototype.drawShape = function () {
	  switch (this.shape){
	    case "elbow" :
	      this.drawElbow();
	      break;
	    case "plus" :
	      this.drawPlus();
	      break;
	    case "straight" :
	      this.drawStraight();
	      break;
	    case "empty" :
	      this.drawEmpty();
	      break;
	    case "entry" :
	      this.drawEntryPipe();
	      break;
	    case "exit" :
	      this.drawExitPipe();
	      break;
	    case "barrier" :
	      this.drawBarrier();
	  }
	};

	Space.prototype.drawStraight = function() {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (25,0);
	  ctx.lineTo (25, 50);
	  ctx.lineWidth =  15;
	  ctx.stroke();
	};

	Space.prototype.fill = function (direction, nextSpaceCallback, spillCallback, level){
	  let spill;
	  this.locked = true;
	  if (level == undefined) {level = 0}
	  switch (this.shape){
	    case "entry" :
	      spill = this.fillEntry(direction, level);
	      break;
	    case "elbow" :
	      spill =  this.fillElbow(direction, level);
	      break;
	    case "plus" :
	      this.fillPlus(direction, level);
	      break;
	    case "straight" :
	      spill = this.fillStraight(direction, level);
	      break;
	    case "barrier" :
	    case "empty" :
	      spill = true;
	      break;
	    case "exit" :
	      spill = this.fillExit(direction, level);
	      break;
	  }
	  if (spill) {spillCallback(direction)}
	  else if (level >= 1.0) { nextSpaceCallback(this.exitDirection);}
	  else {
	    setTimeout(Space.prototype.fill.bind(this, direction, nextSpaceCallback, spillCallback, level + 0.05), this.increment)
	  }
	};

	Space.prototype.fillElbow = function (direction, level) {
	    let mappedDirection = this.calculateRotatedDirection(direction, true)
	    let spaceCanvas = this.getCanvas();
	    let ctx = spaceCanvas.getContext('2d');
	    ctx.beginPath();
	    switch (mappedDirection) {
	    case "top" :
	      ctx.arc (0, 0, 25, 0, (.5* Math.PI * level));
	      this.exitDirection = this.calculateRotatedDirection("left");
	      break;
	    case "left" :
	      ctx.arc (0, 0, 25, 1*Math.PI, ( .5*Math.PI*(1-level)), true);
	      this.exitDirection = this.calculateRotatedDirection("top");
	      break;
	    default :
	      return true;
	    }
	    ctx.lineWidth =  10;
	    ctx.strokeStyle = 'green';
	    ctx.stroke();
	};

	Space.prototype.fillEntry = function (direction, level) {
	  if(direction != "offboard"){return true}
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (0, 25);
	  ctx.lineTo (50*level, 25);
	  ctx.lineWidth =  10;
	  ctx.strokeStyle = 'green';
	  ctx.stroke();
	  this.exitDirection = "right";
	};

	Space.prototype.fillExit = function (direction, level) {
	  if(direction != "left"){return true}
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (0, 25);
	  ctx.lineTo (50*level, 25);
	  ctx.lineWidth =  10;
	  ctx.strokeStyle = 'green';
	  ctx.stroke();
	  this.exitDirection = "offboard";
	};

	Space.prototype.fillStraight = function (direction, level) {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  let newDirection = this.calculateRotatedDirection(direction, true)

	  ctx.beginPath();
	  switch (newDirection){
	  case "top" :
	    ctx.moveTo (25,0);
	    ctx.lineTo (25, 50*(1.05*level));
	    this.exitDirection = OPPOSITE[direction];
	    break;
	  case "bottom" :
	    ctx.moveTo (25, 50);
	    ctx.lineTo (25, 50 - (1.05*50*level));
	    this.exitDirection = OPPOSITE[direction];
	    break;
	  default :
	    return true;
	  }
	  ctx.lineWidth =  10;
	  ctx.strokeStyle = 'green';
	  ctx.stroke();
	};

	Space.prototype.fillPlus = function (direction, level) {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  let mappedDirection = this.calculateRotatedDirection(direction, true)

	  ctx.beginPath();
	  switch (mappedDirection){
	  case "top" :
	    ctx.moveTo (25,0);
	    ctx.lineTo (25, 50*level);
	    break;
	  case "bottom" :
	    ctx.moveTo (25, 50);
	    ctx.lineTo (25, 50 - 50*level);
	    break;
	  case "left" :
	    ctx.moveTo (0,25);
	    ctx.lineTo (50*level, 25);
	    break;
	  case "right" :
	    ctx.moveTo (50,25);
	    ctx.lineTo (50 - 50*level, 25);
	    break;
	  }
	  ctx.lineWidth =  10;
	  ctx.strokeStyle = 'green';
	  ctx.stroke();
	  this.exitDirection = OPPOSITE[direction];
	}

	Space.prototype.getCanvas = function(){
	  return this.canvas;
	};

	Space.prototype.getRotation = function () {
	  return this.getRotationFromMatrix($(this.getCanvas()).css("transform"))
	};

	Space.prototype.getRotationFromMatrix = function (matrix) {
	  if (matrix == "none" || !matrix) {return 0}
	  let cosVal = matrix.split && matrix.split("(")[1].split(",")[0];
	  let sinVal = matrix.split && matrix.split(",")[1];
	  var scale = Math.sqrt(cosVal*cosVal + sinVal*sinVal);
	  var sin = sinVal/scale;
	  var rotation = Math.round(Math.atan2(sinVal, cosVal) * (180/Math.PI));
	  return rotation
	};

	Space.prototype.makeCanvas = function(){
	  spaceCanvas = document.createElement("canvas");
	  spaceCanvas.setAttribute("id", this.id);
	  spaceCanvas.setAttribute("class", "spaceCanvas");
	  spaceCanvas.setAttribute("width", "50px");
	  spaceCanvas.setAttribute("height", "50px");
	  if (this.shape !== "empty" && this.shape !== "entry") {$(spaceCanvas).mousedown(this.addRotationHandler.bind(this))}
	  this.canvas = spaceCanvas;
	  this.drawShape();
	};

	Space.prototype.mouseMoveHandler = function (xFirstClick, yFirstClick, startRotation, e) {
	  if (this.shape != "entry" && this.shape != "exit" && this.shape !="plus" && this.shape !="barrier" && !this.locked)
	    {
	    let rotation = e.pageX - xFirstClick + e.pageY - yFirstClick;
	    rotation += (startRotation || 0);
	    if (rotation*rotation > 25){
	      $(this.getCanvas()).css("transform", `rotate(${rotation}deg)`);
	    }
	  }
	};

	Space.prototype.rotatable = function () {
	  return (this.shape != "entry" && this.shape != "exit" && this.shape !="plus" && this.shape != "barrier" && !this.locked);
	}

	Space.prototype.rotate = function () {
	  if (this.rotatable()) {
	    let currentRotation = this.getRotation()
	    $(this.getCanvas()).css("transform", `rotate(${currentRotation + 90}deg)`);
	  }
	};

	Space.prototype.snapAndResetHandlers = function () {
	  let currentRotation = this.getRotation() + 20
	  let numQuarterRotations = Math.floor(currentRotation / 45)
	  let numNearestHalf = (numQuarterRotations + numQuarterRotations % 2)
	  let snappedRotation = numNearestHalf * 45;
	  $(this.getCanvas()).css("transform", `rotate(${snappedRotation}deg)`);
	  $(document).off("mousemove");
	  $(document).off("mouseup");
	};


	module.exports = Space;


/***/ }
/******/ ]);