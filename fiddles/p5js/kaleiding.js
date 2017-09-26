var colors;
var transparency = 100/16;
var spread = 100;
var numRotations = 12;
var squaresize = 50;
var color_pastel = 100;

var pickerpastel, pickertransparency,
    pickerspread, pickerrotations, pickersize;

function setup() {
    createCanvas(windowWidth, windowHeight-40).parent("sketchHere");
    frameRate(100);
    background(200);
    colorMode(ADD);
    noStroke();

    pickerpastel = createSlider(0, 255, color_pastel);
    pickerpastel.parent("sketchInput");
    pickertransparency = createSlider(0, 255, transparency);
    pickertransparency.parent("sketchInput");
    pickerspread = createSlider(50, 250, spread);
    pickerspread.parent("sketchInput");
    pickerrotations = createSlider(0, 24, numRotations);
    pickerrotations.parent("sketchInput");
    pickersize = createSlider(50, 250, squaresize);
    pickersize.parent("sketchInput");

    updateSettings();
}

function draw() {
    updateSettings();
    var distance = frameCount % (spread*2);
    if (distance != -1) {
        translate(0, height);
        // for (var j = 0; j < numRotations; j++) {
        for (var row = 0; row < (width / (spread/2)); row++) {
            var shapecolor = colors[row % colors.length]
            for (var circle = -1; circle < (height / (spread/2)); circle++) {
              push();
                translate(spread*circle, spread*circle);
                drawRingOfShapes(numRotations, distance, distance, squaresize, shapecolor);
              pop();
            }
            translate(0, -spread*2);
        }
    }
}

function updateSettings() {
  color_pastel = pickerpastel.value();
  transparency = pickertransparency.value();
  spread = pickerspread.value();
  numRotations = pickerrotations.value();
  squaresize = pickersize.value();
  stroke(255, 255, 255, transparency);
  colors = [
      color(color_pastel, 255, 255, transparency),
      color(color_pastel, color_pastel, 255, transparency),
      color(255, color_pastel, 255, transparency),
      color(255, color_pastel, color_pastel, transparency),
      color(255, 255, color_pastel, transparency),
      color(color_pastel, 255, color_pastel, transparency)
  ]
}

function drawRingOfShapes(numShapes=8, x=0, y=0, squaresize=100, color="#FFF") {
  for (var i = 0; i < numShapes; i++) {
    drawShape(x, y, squaresize, color);
    rotate(TWO_PI/numShapes);
  }
}

function drawShape(x=0, y=0, squaresize=100, color="#FFF") {
    fill(color);
    rect(x, y, squaresize, squaresize);
    line(x, y, x+squaresize, y+squaresize);
    ellipse(x, y, squaresize/10);
}
