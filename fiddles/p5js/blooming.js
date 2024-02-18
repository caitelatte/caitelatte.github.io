var bloomers = [];
var maturity = 100;
var increment = 0.01;

var bloomed_flowers; // initialised in setup()

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Confirm the volume warning and get an interaction before sound
  let soundButton = createButton("Continue with sound", "yes");
  soundButton.position(windowWidth/2, windowHeight/2);
  soundButton.mouseReleased(confirmedSetup)
}

function confirmedSetup() {
  // set up the sound stuff
  setupSound();

  // Set up p5-dependent variables
  bloomed_flowers = [
    color("#ea4cb0"),
    color("#f15571"),
    color("#c72ad8"),
    color("#ae2dd6")
  ]

  // Set up bloomers
  bloomers.push({
    x: random(0, width),
    y: random(0, height),
    size: 5,
    color: random(bloomed_flowers),
    bloomed: 0,
  })
}

function draw() {
  background(0);

  // map the "drawBloomer" and "updateBloomer" functions over the bloomer array
  // although these functions don't do anything yet - you need to write them (see below)
  bloomers.map(drawBloomer);
  bloomers.map(updateBloomer);
}

function mouseReleased() {
  // write some code here that pushes a new bloomer to the array
  bloomers.push({
    x: mouseX,
    y: mouseY,
    size: 1,
    color: random(bloomed_flowers),
    bloomed: 0,
  })
}

function drawBloomer(b) {
  // code which draws the bloomer goes in here
  // the bloomer object will be passed in as the `b` parameter
  push();
    var corecolor = lerpColor(color(255), b.color, b.size/maturity)
    fill(corecolor);
    if (!b.bloomed) {
      ellipse(b.x, b.y, b.size);
    } else {
      push();
        fill(lerpColor(corecolor, color(255), 0.1));
        translate(b.x, b.y);
        for (var i = 0; i < 5; i++) {
          ellipse(0, min(b.size/2, b.bloomed * (b.size/2)), b.size/1.5);
          rotate(TWO_PI/5);
        }
      pop();
      ellipse(b.x, b.y, b.size);
    }
  pop();
}

function updateBloomer(b) {
  // all code which updates parameters in the bloom goes in here
  // the bloomer object will be passed in as the `b` parameter

  function intersectingBloomer(ob, index, array) {
    intersect = (b != ob) && (dist(b.x, b.y, ob.x, ob.y) - b.size/2 <= max(getBloomerRadius(b), getBloomerRadius(ob)));
    // if (intersect) {
    //   print("COLLISION WITH " + str(index) + " dist, diameterb, diameterob: " + str([dist(b.x, b.y, ob.x, ob.y), getBloomerRadius(b), getBloomerRadius(ob)]))
    // }
    return intersect;
  }
  if (!b.bloomed) {
    if ((b.size >= maturity) || (bloomers.some(intersectingBloomer))) {
      // write a condition that makes the bloomer bloom
      if (!b.bloomed) {
        playBoop(random(60, 72));
      }
      b.bloomed += increment;
    } else {
      // write some code that makes the bloomer grow
      b.size += maturity*increment;
    }
  } else if (b.bloomed <= 1) {
    b.bloomed += increment;
  }
}

function getBloomerRadius(b) {
  var core_radius = b.size/2;
  var petal_radius = min(b.size/2, b.bloomed * (b.size/2)) / 2
  return (core_radius + petal_radius)
}
