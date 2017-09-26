var base_size = 50;
var tile_width = 200;
var increment = 0.5;
var pause_beats = BEATS_TO_PAUSE = 15;
var text_color = "#2f1c09"

var oct_tile

var oct1_color_picker, oct2_color_picker,
    sq1_color_picker, sq2_color_picker,
    fill_color_picker,
    text_color_picker;

var select_preset_ocean, select_preset_soft_ocean;

function setup() {
    createCanvas(800, 600).parent("sketchHere");
    // any additional setup code goes here

    oct_tile = new Octagonal_Tile();

    var oct_colors = oct_tile.getColors();

    oct1_color_picker = createInput(oct_colors.get("oct1_color"), "color")
    oct1_color_picker.parent("sketchInput")
    oct2_color_picker = createInput(oct_colors.get("oct2_color"), "color")
    oct2_color_picker.parent("sketchInput")
    sq1_color_picker = createInput(oct_colors.get("sq1_color"), "color")
    sq1_color_picker.parent("sketchInput")
    sq2_color_picker = createInput(oct_colors.get("sq2_color"), "color")
    sq2_color_picker.parent("sketchInput")
    fill_color_picker = createInput(oct_colors.get("fill_color"), "color")
    fill_color_picker.parent("sketchInput")
    text_color_picker = createInput(text_color, "color")
    text_color_picker.parent("sketchInput")

    select_preset_ocean = createButton("Ocean pallette");
    select_preset_ocean.mousePressed(function() {presetColors("ocean")})

    select_preset_soft_ocean = createButton("Soft ocean pallette");
    select_preset_soft_ocean.mousePressed(function() {presetColors("soft_ocean")})

}

function presetColors(preset_name="ocean") {
  oct_tile.setPresetColors(preset_name);
}

function draw() {
    clear();

    // Set colors from pickers here
    oct_tile.setColors(
      oct1_color_picker.value(),
      oct2_color_picker.value(),
      sq1_color_picker.value(),
      sq2_color_picker.value(),
      fill_color_picker.value(),
      text_color_picker.value()
    )

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
    textAlign(CENTER);
    textSize(75);
    textStyle(BOLD);
    fill(color(text_color));
    text("Caitessegonal", 400, 320);
}
