const Space = require('./space.js');
const EXIT_DIRECTION_CONVERTER = { top: "bottom", bottom: "top", left: "right", right: "left" }

//
// var boardCanvas = $('#boardCanvas')[0];

const Board = {
  spaces: [],
  positions: {},

  considerSwitch (x,y,i,j) {
    if (this.positions[i + "," + j].shape == "empty"){
      this.switchSpaces(x, y, i, j);
    }
  },

  createSpaces () {
    while (this.spaces.length < 127) {
      switch(Math.floor(Math.random()*3)){
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
      }
    };
  },

  distributeSpaces () {
    for (let i = 0; i < 16; i++ ){
      for (let j = 0; j < 8; j++){
        if (j == 3 && i == 0) {nextSpace = new Space("entry");}
        else if (j == 4 && i == 7) {nextSpace = new Space("empty");}
        else { nextSpace = this.spaces.pop(); }
        this.positions[i + "," + j] = nextSpace;
        nextSpace.assignCoords(i,j);
        $('#canvasFrame').append(nextSpace.getCanvas());
      }
    }
  },

  fillNextSpace (lastX, lastY, lastExitDirection) {
    let nextSpaceLocation = this.getNextSpace(lastX, lastY, lastExitDirection);
    let nextSpace = this.positions[nextSpaceLocation[0] + "," + nextSpaceLocation[1]];
    let entryDirection = EXIT_DIRECTION_CONVERTER[lastExitDirection];
    nextSpace.fill(entryDirection,
                  this.fillNextSpace.bind(this, nextSpaceLocation[0], nextSpaceLocation[1]),
                  this.spill.bind(this, nextSpaceLocation[0], nextSpaceLocation[1]));
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

  spill (lastSpaceX, lastSpaceY, level) {
    if (level = undefined) { level = 0};
    let boardCanvas = $('#boardCanvas')[0];
    let ctx = boardCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc (0, 0, level, 0, (2*Math.PI));
    ctx.fillStyle = "green";
    ctx.fill();
    setTimeout(this.spill.bind(this, lastSpaceX, lastSpaceY, level + 15), 50);
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
