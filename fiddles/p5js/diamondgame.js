var rounded_rects = 5;
var update_frame = 20; // how many frames to skip when updating
var mapWidth = 15; // the number of tiles across a board's width
var mapHeight = 10; // the number of tiles across a board's height

// variables for initialising in setup() because they depend on p5js stuff
var tile_size; // the width and height of each tile
var mapOffsetX; // the real x distance to offset the board by
var mapOffsetY; // the real y distance to offset the board by
var colors;
var defaults;

// scoring variables
var score = 0;
var highscore = 0;
var goalpoints = 10;

// Game variables, initialised in startGame()
var playing;
var starttime;
var gametime;
var game_objects;

// P5JS STRUCTURE

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Configuration
    rectMode(CENTER);
    noStroke();

    // Variable initialisation
    tile_size = Math.floor(min(width / (mapWidth + 2), height / (mapHeight + 2))); // Allow for border
    mapOffsetX = (width - ((mapWidth + 2) * tile_size)) / 2;
    mapOffsetY = (height - ((mapHeight + 2) * tile_size)) / 2;
    colors = {
      "background": color("#355649"),
      "playarea": color("#74a993"),
      "playarea_highlight": color("#9dd0bb"),
      "wall": color("#33302a"),
      "floor": color("#6b583f"),
      "player": color("#96e2ea"),
      "goals": color("#e8dc7c"),
      "text": color("#f3e59e"),
      "button": color("#584e39")
    };
    defaults = { // Default settings for object types
      "walls": {
        "color": "wall",
        "shape": "rect"
      },
      "terrain": {
        "color": "floor",
        "shape": "rect"
      },
      "goals": {
        "color": "goals",
        "shape": "diamond"
      },
      "player": {
        "color": "player",
        "shape": "ellipse"
      },
      "button": {
        "color": "button",
        "shape": "rect"
      }
    }
    textSize(tile_size);
    resetbutton = {
      "shape": createObject("button", 1, mapHeight, 3, 0.8),
      "text": "Reset"
    }

    startGame();
}

function draw() {
    translate(mapOffsetX, mapOffsetY);
    // Draw the background and border
    background(colors["background"]);
    push();
      fill(colors["playarea"]);
      rect(getRealCoord((mapWidth - 1) / 2), getRealCoord((mapHeight -1) / 2), mapWidth * tile_size, mapHeight * tile_size)
      stroke(colors["playarea_highlight"]);
      for (var x = -0.5; x < mapWidth; x += 1) {
        line(getRealCoord(x), 0, getRealCoord(x), getRealCoord(mapHeight));
      }
      for (var y = -0.5; y < mapHeight; y += 1) {
        line(0, getRealCoord(y), getRealCoord(mapWidth), getRealCoord(y));
      }
    pop();
    // Draw the game objects
    drawObjects(game_objects);
    drawInterface();
}

function drawInterface() {
    push();
      fill(colors["text"]);
      textFont("courier new", tile_size*0.8);
      // score
      textAlign(LEFT, CENTER);
      text(
        "Score: " + str(score),
        getRealCoord(2.5), getRealCoord(-1), getRealCoord(5), tile_size);
      // high score
      textAlign(RIGHT, CENTER);
      text(
        "Hiscore: " + str(highscore),
        getRealCoord(mapWidth - 3), getRealCoord(-1), getRealCoord(5), tile_size);
      // timer
      textAlign(CENTER, CENTER);
      if (playing) {
        text(
          str(Math.floor((gametime-millis()) / (60*1000)))
          + ":" + str(Math.floor((gametime-millis()) / (1000))%60),
          getRealCoord((mapWidth-1)/2), getRealCoord(-1)
        );
      } else {
        text(
          "0:00",
          getRealCoord((mapWidth-1)/2), getRealCoord(-1));
      }
      // instructions
      textSize(tile_size*0.4);
      textAlign(CENTER, CENTER);
      text("Use the arrow keys to move!\nCollect the diamonds!",
        getRealCoord((mapWidth-1)/2), getRealCoord(mapHeight))
      // reset game button
      textSize(tile_size*0.7);
      textAlign(CENTER, CENTER);
      drawObject("button", resetbutton["shape"]);
      text(resetbutton["text"],
        getX(resetbutton["shape"]), getY(resetbutton["shape"]));

    pop();
}

// GAME INTERACTION

function keyPressed() {
    // your "key typed" code goes here
    if (playing) {
      if (keyCode == LEFT_ARROW) {
        moveObject("player", 0, -1, 0);
      } else if (keyCode == RIGHT_ARROW) {
        moveObject("player", 0, 1, 0);
      } else if (keyCode == UP_ARROW) {
        if (checkCollision("player", 0, getX(game_objects.player[0]), getY(game_objects.player[0]) + tile_size)) {
          moveObject("player", 0, 0, -1);
          moveObject("player", 0, 0, -1);
        }
      }
    }
    // print(key.toString() + " - " + keyCode.toString()); // debug keys
}

function mousePressed() {
    var tmouseX = mouseX - mapOffsetX;
    var tmouseY = mouseY - mapOffsetY;
    // check for resetbutton
    if (
      (tmouseX > getX(resetbutton.shape) - (getWidth(resetbutton.shape)/2))
      & (tmouseX < getX(resetbutton.shape) + (getWidth(resetbutton.shape)/2))
      & (tmouseY > getY(resetbutton.shape) - (getHeight(resetbutton.shape)/2))
      & (tmouseY < getY(resetbutton.shape) + (getHeight(resetbutton.shape)/2))
    ) {
      if (playing) {
        completeGame();
      }
      startGame();
    }
}

// GAME LOGIC

function startGame() {

  // Reset game score
  if (score > highscore) {
    highscore = score;
  }
  score = 0;
  playing = true;
  starttime = millis();
  gametime = starttime + (180 * 1000); // 3 minutes in milliseconds

  // Reset game objects
  game_objects = {
    // [shape, centrex, centrey, width, height, color name]
    // function createObject(category, tilex, tiley, objwidth=1, objheight=1, shape=null, objcolor=null)
    // coordinates are in terms of tile coord.
    "walls": [
      createObject("walls", -1, (mapHeight - 1) / 2, 1, mapHeight + 2), // left wall
      createObject("walls", mapWidth, (mapHeight - 1)/2, 1, mapHeight + 2), // right wall
      createObject("walls", (mapWidth - 1) / 2, -1, mapWidth + 2, 1), // ceiling
      createObject("walls", (mapWidth - 1) / 2, mapHeight, mapWidth + 2, 1), // floor
    ],
    "terrain": [
      // top left quadrant
      createObject("terrain", 0, 2),
      createObject("terrain", 1, 4),
      createObject("terrain", 2, 1),
      createObject("terrain", 2, 3.5, 1, 2),
      createObject("terrain", 3, 4),
      createObject("terrain", 4, 3, 1, 3),
      createObject("terrain", 5, 3.5, 1, 2),
      createObject("terrain", 6, 3),
      // bottom left quadrant
      createObject("terrain", 0, 7.5, 1, 4),
      createObject("terrain", 1, 8.5, 1, 2),
      createObject("terrain", 2, 8, 1, 3),
      createObject("terrain", 3, 9),
      createObject("terrain", 5, 8.5, 1, 2),
      createObject("terrain", 6, 7, 1, 3),
      createObject("terrain", 7, 5.5, 1, 2),
      // bottom right quadrant
      createObject("terrain", 8, 5),
      createObject("terrain", 9, 9),
      createObject("terrain", 10, 8, 1, 3),
      createObject("terrain", 11, 8.5, 1, 2),
      createObject("terrain", 12, 9),
      createObject("terrain", 13, 8, 1, 3),
      createObject("terrain", 14, 7, 1, 5),
      // top right quadrant
      createObject("terrain", 8, 1),
      createObject("terrain", 9, 1),
      createObject("terrain", 10, 4),
      createObject("terrain", 11, 3.5, 1, 2),
      createObject("terrain", 12, 2.5, 1, 2),
      createObject("terrain", 13, 3)
    ],
    "goals": [
      createObject("goals", 2, 0),
      createObject("goals", 2, 6),
      createObject("goals", 3, 3),
      createObject("goals", 4, 9),
      createObject("goals", 7, 9),
      createObject("goals", 9, 0),
      createObject("goals", 12, 1),
      createObject("goals", 13, 6)
    ],
    "player": [
      createObject("player", 7, 4)
    ]
  }
}

function drawObjects(game_objects) {
    for (var category in game_objects) {
      for (var currentobject in game_objects[category]) {
        if (playing) {
          // Check if game is finished
          if (millis() >= gametime) {
            completeGame();
          } else {
            // See if player object should fall
            if ((frameCount % update_frame == 0) && (category == "player")) {
              moveObject(category, currentobject, 0, 1);
            }
          }
        }
        drawObject(category, game_objects[category][currentobject]);
      }
    }
}

function drawObject(category, objlist) {
  // making the rest of this code readable. object array should be:
  // [shape, centrex, centrey, width, height, color name]
  var shape = objlist[0];
  var centrex = getX(objlist);
  var centrey = getY(objlist);
  var objwidth = getWidth(objlist);
  var objheight = getHeight(objlist);
  var objcolor = colors[objlist[5]];

  // Drawing objects logic
  push()
    fill(objcolor);
    if (shape == "rect") {
      rect(centrex, centrey, objwidth, objheight, rounded_rects);
    } else if (shape == "ellipse") {
      ellipse(centrex, centrey, objwidth, objheight);
    } else if (shape == "diamond") {
      push()
        translate(centrex, centrey);
        rotate(TWO_PI / 8);
        rect(0, 0, sqrt(sq(objwidth/2) + sq(objheight/2)), sqrt(sq(objwidth/2) + sq(objheight/2)), rounded_rects);
      pop();
    }
    if (category == "player") {
      if (playing) {
        var emoji = "😻"
      } else {
        var emoji = "😸"
      }
      text(emoji, centrex, centrey, objwidth, objheight)
    }
  pop();
}

function collectObject(category, objindex, playerindex=0) {
    game_objects[category].splice(objindex, 1);
    score += goalpoints;
    if (game_objects[category].length <= 0) {
      completeGame();
    }
}

function completeGame() {
  playing = false;
  if ((gametime > 0) & (game_objects["goals"].length <= 0)) {
    score += Math.floor((gametime - millis()) / 1000);
  }
  if (score > highscore) {
    highscore = score;
  }
}

// Object movement

function moveObject(category, objindex, tiles_x, tiles_y, falling=false) {
    // Try to move the specified object tiles_x tiles to the left and tiles_y down.
    var targetx = getX(game_objects[category][objindex]) + (tiles_x * tile_size);
    var targety = getY(game_objects[category][objindex]) + (tiles_y * tile_size);
    // print("Trying to move: " + [tiles_x, tiles_y].toString() + " to " + [targetx, targety].toString())
    var collision = checkCollision(category, objindex, targetx, targety)
    if (!collision) {
      // print("Moving: " + [tiles_x, tiles_y].toString() + " to " + [targetx, targety].toString())
      setX(category, objindex, targetx);
      setY(category, objindex, targety);
    } else if (collision[0] == "goals") {
      // If running into a goal, collect it and try to move to where it is!
      collectObject(collision[0], collision[1]);
      moveObject(category, objindex, tiles_x, tiles_y, falling);
    } else {
      // Debug why it didn't move!
      // print("Tried to move: " + [tiles_x, tiles_y].toString() + " to " + [targetx, targety].toString())
      // print(checkCollision(category, objindex, targetx, targety))
    }
}

function checkCollision(category, objindex, targetx, targety) {
      /* Check if the target coordinate is legal to move to.
      * Checks if there is an object there already, and if it's within the canvas bounds.
      */
      // Check if inside canvas bounds
      if (
        (targetx - (tile_size / 2) <= 0) // left side equal or less than canvas left side
        || (targetx + (tile_size / 2) >= width) // right side equal or less than canvas right side
        || (targety - (tile_size / 2) <= 0) // top equal or greater than canvas top
        || (targety + (tile_size / 2) >= height) // bottom equal or less than canvas bottom
      ) {
        // print("Tried to move out of bounds at " + [targetx, targety].toString())
        return "OUT OF BOUNDS";
      }
      // Check for other objects
      for (var othercat in game_objects) {
        for (var otherobj in game_objects[othercat]) {
          otherx = getX(game_objects[othercat][otherobj]);
          othery = getY(game_objects[othercat][otherobj]);
          otherWidth = getWidth(game_objects[othercat][otherobj]);
          otherHeight = getHeight(game_objects[othercat][otherobj]);
          // Don't check against self
          if (!(category == othercat && objindex == otherobj)){
            if (
                (targetx >= otherx - otherWidth / 2) && (targetx <= otherx + otherWidth / 2) &&
                (targety >= othery - otherHeight / 2) && (targety <= othery + otherHeight / 2)
            ) {
              // print("Collision detected: target = " + [targetx, targety].toString()
              //    + "detected object: " + [othercat, otherobj].toString() + " at, sized " + [otherx, othery, otherWidth, otherHeight].toString())
              return [othercat, otherobj];
            }
          }
        // print("checked object: " + [othercat, otherobj, otherx, othery].toString())
        }
      }
      // print("No collision detected at " + [targetx, targety].toString())
      return false;
}

// Utility functions

function getTileCoord(coord) {
  return (coord) / tile_size - 1.5;
}
function getRealCoord(tile_coord) {
  return (tile_coord + 1.5) * (tile_size) ;
}

function getX(objlist) {
  return getRealCoord(objlist[1]);
}
function getY(objlist) {
  return getRealCoord(objlist[2]);
}
function getWidth(objlist) {
  return objlist[3] * tile_size;
}
function getHeight(objlist) {
  return objlist[4] * tile_size;
}
function setX(category, objindex, value) {
  // game_objects[category][objindex][1] = Math.round(value/tile_size);
  game_objects[category][objindex][1] = getTileCoord(value);
}
function setY(category, objindex, value) {
  game_objects[category][objindex][2] = getTileCoord(value);
}

function createObject(category, tilex, tiley, objwidth=1, objheight=1, shape=null, objcolor=null) {
  // Create an object with the provided settings.
  // Shape and objcolor default to the category's defaults.
  // [shape, centrex, centrey, width, height, color name]
  if (!shape) {shape = defaults[category]["shape"]}
  if (!objcolor) {objcolor = defaults[category]["color"]}
  return [shape, tilex, tiley, objwidth, objheight, objcolor];
}
