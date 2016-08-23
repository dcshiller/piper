<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Piper</title>
    <link href="https://fonts.googleapis.com/css?family=Exo+2" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <link rel="stylesheet" href="./assets/main.css" media="screen" title="no title" charset="utf-8">
    <script src="./lib/bundle.js"> </script>
  </head>
  <body>
    <h1 id="gameTitle"> Piper </h1>
    <div id="canvasFrame">
      <h3 id="countdown"> </h3>
      <canvas id="boardCanvas" width="800px" height="400px"> </canvas>
      <h2> Score: <span id="score">-</span> </h2>
    </div>

    <nav id="menu" class="modalPanel">
      <h2 class="clickable"> Menu </h2>
      <hr/>
      <ul>
        <li id="newGame">New Game</li>
        <li id="gameMode"><span id="arcadeMode" class="selected">Arcade Mode</span>    <span id="puzzleMode">Puzzle Mode</span> </li>
        <li id="instructions">Instructions</li>
        <li id="highScores">High Scores</li>
      </ul>

    </nav>

    <div id="instructionsPanel" class="modalPanel hidden">
      <h2> Guide to Play </h2>
      <hr/>
        <p> Piper is a puzzle game inspired by Pipe Dream.
          The goal of the game is to connect the lefthand entry pipe to the righthand exit pipe by rotating and moving
          the intermediary pipes.</p>
          <img src="assets/goals.png" class="right" alt="entryAndExitPipes" />

          <p>  There is a time limit. After a set amount of time (depending upon the option settings) green sludge will begin to be pumped through the entry pipe.
          If at any point there is no pipe in front of it, you lose! </p>

          <p>
          Any pipe may be rotated by clicking on it and dragging the mouse. Clicking and dragging right or down will swing the pipe clockwise.
          Left or up will swing it counter-clockwise. </p>
          <img src="assets/mousemove.png" class="fullWidth" alt="mouseDemonstration" />
          <p>
          Alternatively, any piece may be rotated clockwise 90 degrees with a single click. </p>

          <p>
          Additionally, any pipe adjacent to the empty space may be swapped for the empty space with a click.
          This takes precedence over rotations. Rotations next to the empty space require clicking and dragging.
          </p>
          <img src="assets/emptyclick.png" class="fullWidth" alt="" />
          <p>
          Note well, proper use of the empty space is integral to getting a high score in this game.
          You cannot cross over any pipe that has already been filled with sludge. If your empty space gets stuck somewhere, your game may become impossible to win.

          <p>  <img src="assets/barriers.png"  class="right" alt="" ;/> When in puzzle mode, the sludge will move slower down, so you will have more time to plan your moves. However, you will also have to contend with barriers.
             Barriers cannot be moved, and if the sludge ever meets a barrier, you will lose.</p>

          Presently, high scores are not recorded for puzzle mode.
        </p>
    </div>

    <div id="highScoresPanel" class="modalPanel hidden">
      <h2> High Scores </h2>
      <hr/>
      <?php
        $file = "assets/highscores.txt";
        $lines = file( $file );
        $high_scores = [];
        for ($i = 2; $i <= 6; $i++){
          array_push($high_scores, $lines[$i]);
          echo "<li class=\"highscore\">". $lines[$i]. "</li>";
        }
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
    </div>

    <div id="winPanel" class="modalPanel winloss hidden">
        <h2>You won!</h2>
        <br/><br/>
        <p>
          Nice Job.
        </p>
        <p>
          Your score was: <span id="scoreReport"> </span>
        </p>
    </div>

    <div id="lossPanel" class="modalPanel winloss hidden">
        <h2>You Lost!</h2>
        <hr/>
        <br/><br/>
        <p>
          You were <span id="distanceReport"> </span> spaces away from the end!
        </p>
    </div>

    <div id="newHighScorePanel" class="modalPanel hidden">
      <h2> You got a high score! </h2>

      <hr/>

      <form>
        <label> Your Initials:
          <input id="initials" type="text" name="initials" maxlength="3" value="" placeholder = "XYZ">
          </input>
        </label>
        <br/>
        <input id="initialsSubmit" type="submit"></input>
      </form>

    </div>


  </body>
</html>
