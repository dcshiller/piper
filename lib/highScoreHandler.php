<?php
  ini_set('display_errors', 'On');
  error_reporting(E_ALL | E_STRICT);
  $new_score = isset($_POST['data']['score']) ? $_POST['data']['score'] : null;
  $new_initials = isset($_POST['data']['initials']) ? $_POST['data']['initials'] : null;

  $new_score = substr($new_score,0,3);
  $new_initials = substr($new_initials,0,3);

  $file = "../assets/highscores.txt";
  $lines = file( $file );
  array_shift($lines);
  array_shift($lines);

  function get_score($line)
    {
      return explode(" ", $line)[0];
    }

  $scores = array_map ("get_score", $lines);

  for ($i = 0; $i < 5; $i++)
    {
        if ($new_score > $scores[$i]) {
            $higher_scores = array_slice($lines, 0, $i);
            $lower_scores = array_slice($lines, $i, 5);
            $new_line = $new_score . " " . $new_initials . "\n";
            array_push( $higher_scores, $new_line);
            $lines = array_merge($higher_scores, $lower_scores);
            break;
        }
    }

  $highScores = fopen("../assets/highscores.txt", "w") or die("Unable to open file!");
  fwrite($highScores, "High Scores\n");
  fwrite($highScores, "-----------\n");
  for ($i = 0; $i < 5; $i++)
  {
    fwrite($highScores, $lines[$i]);
  }
  fclose($highScores);
?>
