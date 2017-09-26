/**
 * @file
 * Creates and draws tesselating tiles with octagons.
 */

/** Class representing settings for several octagonal tesselating tiles */
class Octagonal_Tile {
  /**
   * Initialises the octagonal tile instance with specified colors
   * Looks a bit like:
   * ________________
   * | A  |_C__|  B |
   * |__ /      \ __|
   * |D |   E    |D |
   * |__|        |__|
   * | B \ ____ / A |
   * |____|_C__|____|
   *
   * @param {str|Map} color_map - either a name of a preset color collection or
   *                              a map of color settings to values.
   */
  constructor(color_map="ocean") {
    this.colors = new Map()

    // Ocean colors:
    if (color_map instanceof Map) {
      this.setColors(
        color_map.get("oct1_color"), color_map.get("oct2_color"),
        color_map.get("sq1_color"), color_map.get("sq2_color"),
        color_map.get("fill_color")
      );
    } else {
      this.setPresetColors(color_map)
    }
  }

  /**
  * Draws an octagonal tile at the specified location.
  *
  * @param {Number} centrex - the x-coordinate of the centre of the tile
  * @param {Number} centrey - the y-coordinate of the centre of the tile
  * @param {Number} tile_width - the width of the square tile to be drawn
  * @param {Number} base_size - the width of the centre octagon
  * @param {boolean} odd_tile - is this an odd tile in an alternating pattern?
  */
  drawTile(centrex, centrey, tile_width, base_size, odd_tile) {
    base_size;
    push(); // Start a new drawing state
      noStroke();

      // Draw corner rectangles labelled A (top left, bottom right)
      if (odd_tile) {
        fill(color(this.colors.get("sq1_color")));
      } else {
        fill(color(this.colors.get("sq2_color")));
      }
      rect(
        centrex - (tile_width/2), centrey - (tile_width/2),
        tile_width/2, tile_width/2
      );
      rect(
        centrex, centrey,
        tile_width/2, tile_width/2
      );

      // Draw corner rectangles labelled B (top right, bottom left)
      if (odd_tile) {
        fill(color(this.colors.get("sq2_color")));
      } else {
        fill(color(this.colors.get("sq1_color")));
      }
      rect(
        centrex, centrey - (tile_width/2),
        tile_width/2, tile_width/2
      );
      rect(
        centrex - (tile_width/2), centrey,
        tile_width/2, tile_width/2
      );

      // Draw middle rectangles labelled C (centre vertical and horizontal)
      fill(color(this.colors.get("fill_color")));
      var oct_edge_length = Octagonal_Tile.oct_edge_length(base_size)
      rect(
        centrex - (oct_edge_length / 2),
        centrey - (tile_width / 2),
        oct_edge_length,
        tile_width
      )
      rect(
        centrex - (tile_width / 2),
        centrey - (oct_edge_length / 2),
        tile_width,
        oct_edge_length
      )

      // Draw centre octagon labelled E
      if (odd_tile) {
        fill(color(this.colors.get("oct1_color")));
      } else {
        fill(color(this.colors.get("oct2_color")));
      }
      this.regular_octagon(centrex, centrey, base_size)

    pop(); // Restore drawing state from before start.
  }

  /**
   * Draw a regularly-sized octagon.
   * @param {number} centrex - x-coordinate of the centre of the octagon
   * @param {number} centrey - y-coordinate of the centre of the octagon
   * @param {number} base_size - width of the octagon
   */
  regular_octagon(centrex, centrey, base_size) {
    var edge_length = Octagonal_Tile.oct_edge_length(base_size);
    beginShape();
      vertex(centrex - (base_size/2), centrey - (edge_length/2));
      vertex(centrex - (edge_length/2), centrey - (base_size/2));
      vertex(centrex + (edge_length/2), centrey - (base_size/2));
      vertex(centrex + (base_size/2), centrey - (edge_length/2));
      vertex(centrex + (base_size/2), centrey + (edge_length/2));
      vertex(centrex + (edge_length/2), centrey + (base_size/2));
      vertex(centrex - (edge_length/2), centrey + (base_size/2));
      vertex(centrex - (base_size/2), centrey + (edge_length/2));
      vertex(centrex - (base_size/2), centrey - (edge_length/2));
    endShape();
  }

  /**
  * Returns the length of an octagon edge given its width (edge to opposite edge)
  *
  * @param {number} width - width of octagon (flat edge to opposite edge)
  */
  static oct_edge_length (width) {
    return (width / (1 + sqrt(2)));
  }

  /**
   * Configures the color values of the internal colors dictionary.
   *
   * @param {Color} oct1_color - Color for first alternating octagon
   * @param {Color} oct2_color - Color for second alternating octagon
   * @param {Color} sq1_color - Color for first alternating background square
   * @param {Color} sq2_color - Color for second alternating background square
   * @param {Color} fill_color - Color for octagon-joining rectangle
   */
  setColors(oct1_color, oct2_color, sq1_color, sq2_color, fill_color) {
    this.colors.set("oct1_color", oct1_color)
    this.colors.set("oct2_color", oct2_color)
    this.colors.set("sq1_color", sq1_color)
    this.colors.set("sq2_color", sq2_color)
    this.colors.set("fill_color", fill_color)
  }

  /**
   * Configures the color values of the internal colors dictionary using the
   * name of a preset color set.
   *
   * @param {str} preset_name - name of the preset pallette to use.
   */
  setPresetColors(preset_name="ocean") {
    if (preset_name == "ocean") {
      this.setColors("#13606f", "#407880", "#58968e", "#9ec9c4", "#bbb899");
    } else if (preset_name == "soft_ocean") {
      this.setColors("#5a95a1", "#89a3a6", "#9cc9c3", "#cde9e6", "#d6d4be");
    } else {
      this.setColors("#13606f", "#407880", "#58968e", "#9ec9c4", "#bbb899");
    }
  }

  /**
  *
  * @return {Map} A map of color settings to color values.
  */
  getColors() {
    return this.colors
  }
}
