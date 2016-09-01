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

const CLOCKWISE = {
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

const INVERSE_ELBOWS = {
  top: "right",
  right: "top",
  left: "bottom",
  bottom: "left"
};

const INVERSE_STRAIGHTS = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}

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
    newDirection = CLOCKWISE[newDirection]
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

// double
Space.prototype.drawDblElbow = function () {
  let spaceCanvas = this.getCanvas();
  let ctx = spaceCanvas.getContext('2d');
  ctx.beginPath();
  ctx.arc (0, 0, 25, 0, 1 * Math.PI);
  ctx.moveTo (25, 50);
  ctx.arc (50, 50, 25, Math.PI, 2 * Math.PI);
  // ctx.arc (50, 50, 25, 0, (2*Math.?PI*(1)));

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
    case "dblElbow" :
      this.drawDblElbow();
      break;
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
  if (level == undefined) {
    level = 0;
    if (this[direction]){
      spill = true;
     }
    this.recordFillDirection(direction);
  }
  if (!spill){
    switch (this.shape){
      case "entry" :
        spill = this.fillEntry(direction, level);
        break;
      case "dblElbow" :
        spill =  this.fillDblElbow(direction, level);
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

Space.prototype.fillDblElbow = function (direction, level) {
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
    case "bottom" :
      ctx.arc (50, 50, 25, 1.6*Math.PI, ((1 + .5*level) * Math.PI ));
      this.exitDirection = this.calculateRotatedDirection("right");
      break;
    case "right" :
      ctx.arc (50, 50, 25, 1.5*Math.PI, Math.PI*(1 + .5*(1-level)), true);
      this.exitDirection = this.calculateRotatedDirection("bottom");
      break;
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
};

Space.prototype.immobile = function () {
  return (this.locked || this.shape == "entry" || this.shape == "exit" || this.shape == "barrier")
};

Space.prototype.inverseDirection = function (direction) {
  switch (this.shape){
    case "elbow" :
    case "dblElbow" :
      return INVERSE_ELBOWS[direction]
      break;
    case "straight" :
    case "plus" :
      return INVERSE_STRAIGHTS[direction]
      break;
  }
};

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
  // (this.shape != "entry" && this.shape != "exit" && this.shape !="plus" && this.shape !="barrier" && !this.locked)
  if (this.rotatable())
    {
    let rotation = e.pageX - xFirstClick + e.pageY - yFirstClick;
    rotation += (startRotation || 0);
    if (rotation*rotation > 25){
      $(this.getCanvas()).css("transform", `rotate(${rotation}deg)`);
    }
  }
};

Space.prototype.recordFillDirection = function (direction) {
  this[direction] = true;
  this[this.inverseDirection(direction)] = true;
};

Space.prototype.rotatable = function () {
  return (this.shape != "entry" && this.shape != "exit" && this.shape !="plus" && this.shape != "barrier" && !this.locked);
};

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
