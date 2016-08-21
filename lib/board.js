const Space = require('./space.js');
const EXIT_DIRECTION_CONVERTER = { top: "bottom", bottom: "top", left: "right", right: "left" }
//
// var boardCanvas = $('#boardCanvas')[0];

const Board = {
  spaces: [],
  positions: {},
  score: -1,
  over: false,

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
        let elbowSpace = new Space("elbow");
        let rotation = (Math.floor(Math.random() * 4)) * 90;
        $(elbowSpace.getCanvas()).css("transform", `rotate(${rotation}deg)`);
        this.spaces.push(elbowSpace);
        break;
        case 1 :
        this.spaces.push(new Space("straight"));
        break;
        case 2 :
        this.spaces.push(new Space("plus"));
        break;
        case 3 :
        this.spaces.push(new Space("barrier"))
      }
    };
  },

  distributeSpaces () {
    for (let i = 0; i < 16; i++ ){
      for (let j = 0; j < 8; j++){
        if (j == 3 && i == 0) {nextSpace = new Space("entry");}
        else if (j == 4 && i == 7) {nextSpace = new Space("empty");}
        else if (j == 3 && i == 15) {nextSpace = new Space("exit");}
        else { nextSpace = this.spaces.pop(); }
        this.positions[i + "," + j] = nextSpace;
        nextSpace.assignCoords(i,j);
        $('#canvasFrame').append(nextSpace.getCanvas());
      }
    }
  },

  fillNextSpace (lastX, lastY, lastExitDirection) {
    if(this.over == false){this.addOneToScore();}
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
    if(clickedSpace.locked || clickedSpace.shape == "barrier") {return}
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

  // setGameWonCallback (callback) {
  //   this.gameWonCallback = callback;
  // },

  spill (lastSpaceX, lastSpaceY, lastExitDirection, level) {
    if (level == undefined) { this.over = true; level = 0}
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
    setTimeout(this.spill.bind(this, lastSpaceX, lastSpaceY, lastExitDirection, level + 15/(level+1)), 100);
  },

  startFill () {
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
