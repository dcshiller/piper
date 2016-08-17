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

	$( function() {
	  Board.initializeSpaces();
	  Board.createSpaces();
	  Board.distributeSpaces();
	  $('#canvasFrame').click(Board.handleBoardClick.bind(Board))
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Space = __webpack_require__(2);

	var canvas = $('#boardCanvas');

	const Board = {
	  spaces: [],
	  positions: {},

	  considerSwitch (x,y,i,j) {
	    if (this.positions[i + "," + j].shape == "empty"){
	      this.switchSpaces(x, y, i, j);
	    }
	  },

	  createSpaces () {
	    while (this.spaces.length < 126) {
	      switch(Math.floor(Math.random()*3)){
	        case 0 :
	          let elbowSpace = new Space("elbow");
	          let rotation = (Math.floor(Math.random() * 4)) * 90;
	          $(elbowSpace.getCanvas()).css("transform", `rotate(${rotation}deg)`);
	          this.spaces.push(elbowSpace);
	          break;
	        case 1 :
	          this.spaces.push(new Space("plus"));
	          break;
	        case 2 :
	          this.spaces.push(new Space("straight"));
	          break;
	      }
	    };
	    while (this.spaces.length < 128) {
	      this.spaces.push(new Space("empty"));
	    }
	  },

	  distributeSpaces () {
	    for (let i = 0; i < 16; i++ ){
	      for (let j = 0; j < 8; j++){
	        nextSpace = this.spaces.pop();
	        this.positions[i + "," + j] = nextSpace;
	        nextSpace.assignCoords(i,j);
	        $('#canvasFrame').append(nextSpace.getCanvas());
	      }
	    }
	  },

	  handleBoardClick(e){
	    e.preventDefault();
	    let x = parseInt(e.target.style.left)/50
	    let y = parseInt(e.target.style.top)/50
	    let empty = this.searchForEmpty(x,y)
	    clickedSpace = this.positions[x + "," + y]
	  },

	  initializeSpaces () {
	    let boardCanvas = $('#boardCanvas')[0];
	    let ctx = boardCanvas.getContext('2d');
	    ctx.beginPath();
	    let space_dimensions = 50;
	    for(let horizontal= 0; horizontal < 400; horizontal+= space_dimensions ){
	      ctx.moveTo(0,horizontal);
	      ctx.lineTo(800,horizontal);
	      ctx.stroke();
	    }
	    for(let vertical= 0; vertical < 800; vertical+= space_dimensions ){
	      ctx.moveTo(vertical, 0);
	      ctx.lineTo(vertical, 400);
	      ctx.stroke();
	    }
	  },

	  searchForEmpty (x,y) {
	    for( let i = -1; i <= 1; i++){
	      if( i == 0) { continue }
	      if( x + i >= 0 && x + i <= 19)
	        { this.considerSwitch(x,y, x+i, y) }
	      if( y + i >= 0 && y + i <= 7)
	        { this.considerSwitch(x,y, x, y+i) }
	    }
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

	const Space = function(shape){
	  this.id = (Math.random()*10000)%10000;
	  this.shape = shape || "elbow"
	  this.makeCanvas();
	};


	Space.prototype.addRotationHandler = function (e) {
	  $(document).mousemove(this.mouseMoveHandler.bind(this, e.pageX, e.pageY))
	  $(document).mouseup(this.snapAndResetHandlers.bind(this))
	},

	Space.prototype.assignCoords = function (x,y) {
	  let spaceCanvas = this.getCanvas();
	  this.x = x;
	  this.y = y;
	  spaceCanvas.style.left = `${x*50}px`;
	  spaceCanvas.style.top = `${y*50}px`;
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

	};

	Space.prototype.drawPlus = function() {
	  let spaceCanvas = this.getCanvas();
	  let ctx = spaceCanvas.getContext('2d');
	  ctx.beginPath();
	  ctx.moveTo (25,0);
	  ctx.lineTo (25, 50);
	  ctx.moveTo (0, 25);
	  ctx.lineTo (50, 25);
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

	Space.prototype.getCanvas = function(){
	  return this.canvas;
	};

	Space.prototype.getRotation = function (matrix) {
	  sinVal = matrix.split(",")[1];
	  let rotation = (Math.asin(sinVal)/Math.PI) * 180
	  return rotation
	}

	Space.prototype.makeCanvas = function(){
	  spaceCanvas = document.createElement("canvas");
	  spaceCanvas.setAttribute("id", this.id);
	  spaceCanvas.setAttribute("class", "spaceCanvas");
	  spaceCanvas.setAttribute("width", "50px");
	  spaceCanvas.setAttribute("height", "50px");
	  $(spaceCanvas).mousedown(this.addRotationHandler.bind(this))
	  this.canvas = spaceCanvas;
	  this.drawShape();
	};

	Space.prototype.mouseMoveHandler = function (x, y, e) {
	  let rotation = (x - e.pageX + y - e.pageY);
	  if (rotation*rotation > 25){
	    $(this.getCanvas()).css("transform", `rotate(${rotation}deg)`);
	  }
	}

	Space.prototype.snapAndResetHandlers = function () {
	  let current_rotation = this.getRotation($(this.getCanvas()).css("transform"))
	  let numQuarterRotations = Math.floor(current_rotation / 45)
	  let numNearestHalf = (numQuarterRotations + numQuarterRotations % 2)
	  let snapped_rotation = numNearestHalf * 45;
	  $(this.getCanvas()).css("transform", `rotate(${snapped_rotation}deg)`);
	  $(document).off("mousemove");
	  $(document).off("mouseup");
	}

	module.exports = Space;


/***/ }
/******/ ]);