// this is the variable your picker should change

var fraction = 3/5; // Fraction of previous node's size for next fractal.
var angle = 3/15; // The angle for a tree node to be from the centre.
var bleaching = 0; // Percentage progress to a fully bleached coral reef.
var max_depth = 7; // Number of iterations into fractals and circles to go.
var background_color, water_colors, target_colors, pickedColor, water_background_color;

var resetButton;

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight-42);
    canvas.parent('canvas-holder');

    noStroke();

    // Initialise p5js-dependent variables
    background_color = color(26, 150, 160);
    water_colors = [ // Water colours for background.
      color(15, 100, 179),
      color(21, 43, 122),
      color(40, 86, 92),
      color(28, 59, 190),
      color(7, 116, 195)
    ];
    // Coral colors sourced from http://www.colourlovers.com/palette/5885/coral_reef
    coral_colors = [
      color(167, 21, 60, 225),
      color(233, 48, 64, 225),
      color(255, 254, 53, 225),
      color(255, 192, 110, 225),
      color(249, 162, 122, 225)
    ];
    target_colors = [ // Colors for fractals to aim for
      color(255, 0, 0, 255),
      color(0, 255, 0, 255),
      color(0, 0, 255, 255)
    ]
    water_background_color = color(255, 255, 255); // The outer ring of nested circles

    resetButton = createButton("Generate new reef")
    resetButton.parent('coral-settings')

    // Start with picked colour from water colours.
    pickedColor = random(water_colors);

    updateScreen();
}

// EVENTS

function draw() {
    // display the currently "picked" colour in the bottom-right
    fill(pickedColor);
    rect(width-100, height-100, 100, 100);
}

function mousePressed() {
    // When the mouse is pressed, update the picked colour and redraw everything.
    // if ((mouseX > 0 && mouseX < width) && (mouseY > 0 && mouseY < height))
    // FIXME: This currently fires even if the mouse is off the canvas or the user has scrolled down, causing pickedColor to become (NaN, NaN, NaN, 255)!
    pickedColor = pixelColorAt(int(mouseX), int(mouseY));
    bleaching = bleaching + 1/100;
    updateScreen();
}

function updateScreen() {
    // This drawing function is called when something changes.
    // It draws the background (including the nesting circles),
    // the outer fractal coral reefs, and the centre custom fractal.
    push();
    var centre = [width/2, height/2];
    var distance = 100;
    clear();

    // Draw the background
    background(background_color)
    for (var i = 0; (i-1) * distance <= height; i++) {
      for (var j = 0; (j-1) * distance < width; j++) {
        nestedCircles(
          j*distance,
          i*distance,
          random(water_colors),
          distance*2
        )
      }
    }

    // draw background fractals.
    // variables are: x, y, rotation, size
    var background_fractals = [
      [25, height * (3/5), -0.15*PI, 175], // left close to bottom
      [50, height-50, -0.20*PI, 200], // bottom left
      [width/4, height-30, -0.4 * PI, 100], // bottom close to left
      [width - 60, height * (2/3), -0.60*PI, 150], // right close to bottom
      [width - 100, height - 50, -0.70*PI, 200], // bottom right
    ]
    for (var i = 0; i < background_fractals.length; i++) {
      push();
        translate(background_fractals[i][0], background_fractals[i][1]);
        rotate(background_fractals[i][2]);
        drawtree(background_fractals[i][3], color(coral_colors[i]));
      pop();
    }

    // Draw the picked color fractal
    push();
      translate(width/2, height/2);
      rotate(-HALF_PI)
      drawtree(width/4, color(pickedColor));
    pop();

    pop();

    if (bleaching > 0.20) {
      fill(color(75, 150, 150));
      rect(25, 25, 250, 100, 10, 10, 10, 10);
      fill(255);
      textSize(18);
      text(
        "Your reef's looking a bit bleached from all that climate change... " +
        "Scroll down to generate a new reef.",
        30, 30, 240, 90
      )
    }
}

function resetBleaching() {
    // Reset bleaching to 0 and randomise the picked color.
    bleaching = 0;
    pickedColor = random(water_colors);
    updateScreen();
}

// DRAWING SHAPES

function drawtree(node_size=100, node_color, depth=1) {
    // Draw a fractal tree.
    progress = depth/max_depth;
    if (depth <= max_depth) {
        var subtree_variables = [
          [-1, fadeColor(target_colors[0], bleaching)],
          [0, fadeColor(target_colors[1], bleaching)],
          [1, fadeColor(target_colors[2], bleaching)]
        ]
        for (var subtree = 0; subtree < subtree_variables.length; subtree++) {
            if (random(0, 1) > progress/3) {
                push();
                var d_angle = subtree_variables[subtree][0] * TWO_PI * angle;
                rotate(d_angle)
                // rotate(HALF_PI - d_angle)
                translate(node_size/2, 0);
                // rotate(- HALF_PI + d_angle)
                drawtree(
                  node_size * fraction,
                  lerpColor(node_color, subtree_variables[subtree][1], 1 / (max_depth + 1), RGB),
                  depth+1);
                pop();
            }
        }
        // draw node
        push();
          fill(fadeColor(node_color, bleaching * depth));
          // rect(0 - node_size/2, 0-node_size/2, node_size, node_size, node_size/4);
          ellipse(0, 0, node_size)
          // ellipse(0, -2*node_size, node_size/5)
          // stroke(node_color)
          // line(0,0,0, -2*node_size)
        pop();
    }
}

function nestedCircles(x, y, circleColor, csize, depth=0) {
    /** Draw circles of decreasing size.
    */
    fill(lerpColor(water_background_color, circleColor, depth/max_depth));
    ellipse(x, y, csize);
    if (depth < max_depth) {
      nestedCircles(x, y,
        circleColor,
        csize - (csize / (max_depth-depth)),
        depth+1
      )
    }
}

// UTILITIES

function fadeColor(inColor, fade) {
    // Fade a certain color to white by increasing each of the rgb values
    return lerpColor(inColor, color(255, 255, 255), fade)
}

function pixelColorAt(x, y) {
  // This is a derivative of the example code given in the p5js pixels documentation.
  // https://p5js.org/reference/#/p5.Image/pixels
  loadPixels();
  var d = pixelDensity();
  var idx = int(4 * ( // 4 elements per element (rgba)
    ( width * d) // how many elements in a row
    * (y * d) // how many rows down to look
    + (x * d) // how many columns into the row to look
  ))
  var newColor = color(pixels[idx], pixels[idx+1], pixels[idx+2])
  return newColor;
}
