# Piper

Piper is a puzzle game inspired by Pipe Dream. The player must connect an entry pipe to an exit pipe through manipulating intermediary pipes. Piper differs from its inspiration in that all pipes pieces are present on the screen at the start of the game, and must be rotated and shifted rather than freely placed.

![gameshot]
[gameshot]: ./docs/GameShot.png

A guide to game play is available in game from the instructions panel.

### Organization

Game logic is broken down into three separate components. One component, organized in the piper.js file, contains methods not essential to the actual running of the game, but important for setting it up or restarting it. A second component, organized in the board.js file, handles methods for making the board and the interaction between individual pieces on the board. Individual pieces are represented by html canvases, and all piece internal actions are organized in the space.js file.

### Piece logic

When a player rotates a piece, the rotation is handled by the space. The board keeps no track of how pieces are rotated, only their location. When a player switches two pieces, the board switches the positions of the pieces, and the pieces themselves are unaffected.

```javascript
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
```

The behavior of the sludge through the individual pipes is handled through the interaction of individual pieces and the board.

The board will tell an individual piece that the sludge is entering it from a certain direction, the piece will then take over, handle the movement of the sludge across itself, and reply (via a callback passed into it when it is triggered) when it is finished. The board will then identify the next piece to trigger.

```javascript
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
```

### High Scores


![highscore]
[highscore]: ./docs/HighScore.png

The player gets a point when the sludge moves into a new pipe. If the player succeeds in getting the sludge to the exit pipe, they win, and are eligible for a high score. High scores are saved to a txt file on the server. They are included with the initial html of the game (both as DOM elements and saved to the window for easy maninpulation in javascript), and are updated by an AJAX request as necessary.

```php
<?php
echo "<script type=\"text/javascript\"> window.highScores = [";
for ($i = 0; $i < 5; $i++)
  {
    echo "\"". rtrim($high_scores[$i]) . " \" ";
    if ($i < 4) {
      echo ", ";
    }
  }
echo  "] </script>";
?>
```

```javascript
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
```
