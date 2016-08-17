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
