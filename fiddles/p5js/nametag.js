var base_size = 1;
var tile_width = 200;
var increment = 0.5;
var pause_beats = BEATS_TO_PAUSE = 60;
var text_color = "#2f1c09"

var oct_tile

function setup() {
    // create the canvas
    createCanvas(800, 600);

    // make the text nice and big - adjust theSize parameter
    // to make *your* name fit nicely on the nametag
    textSize(150);

    // // draw a border to help you see the size
    // // this isn't compulsory (remove this code if you like)
    // strokeWeight(5);
    // rect(0, 0, width, height);

    oct_tile = new Octagonal_Tile("soft_ocean");

    var oct_colors = oct_tile.getColors();
}

function draw() {
    // my cool nametag code is here!

    // Set beats to pause to the frameRate, which hopefully will pause for a second
    BEATS_TO_PAUSE = frameRate();

    clear();

    // Shrink or grow the octagon size.
    if ((base_size >= tile_width) || (base_size <= 0)) {
      pause_beats = pause_beats - 1;
      if (pause_beats <= 0){
        pause_beats = BEATS_TO_PAUSE;
        increment = -increment;
        base_size = base_size + increment;
      }
    } else {
      base_size = base_size + increment;
    }

    // Draw 4x3 octagon tiles.
    var across = 4;
    var down = 3;
    var odd_tile = true;
    for (var x = 0; x < across; x++) {
      for (var y = 0; y < down; y++) {
        oct_tile.drawTile(
          x * tile_width + 100,
          y * tile_width + 100,
          tile_width,
          base_size,
          odd_tile
        )
        odd_tile = !odd_tile
      }
    }

    // replace my name with your name!
    textAlign(CENTER, CENTER); // horizAlign, vertAlign
    textStyle(BOLD);
    fill(color(text_color));
    text("Caitlin", 400, 400);
}

// this function is here so that when you hit the spacebar, the current version
// of the nametag sketch will be saved to your downloads folder
function keyTyped() {
    if (key === " ") {
        saveCanvas("nametag.png");
    }
}
