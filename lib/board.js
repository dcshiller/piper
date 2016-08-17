const Space = require('./space.js');

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
