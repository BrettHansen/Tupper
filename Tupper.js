// Function called upon loading. You can either change this function or the 
// one controlling the drawing
var pixel_size = 10;
var pixel_break_size = 1;
var canvas;
var context;
var bg_grid;
var bit_map;
var complete_image;
var doUpdate;

var black = [0, 0, 0, 255];
var white = [255, 255, 255, 255];

function getColor(i, j) {
  if(bit_map[Math.floor(i / (pixel_size + pixel_break_size)) * 106 + Math.floor(j / (pixel_size + pixel_break_size))] == 0)
    return black;
  return white;
}

function updateImage() {
  var color_array = bg_grid.data.slice();
  complete_image = context.createImageData(106 * (pixel_size + pixel_break_size) + 1, 17 * (pixel_size + pixel_break_size) + 1);
  complete_image.data.set(color_array);
  for(var i = 0; i < complete_image.height; i++) {
    for(var j = 0; j < complete_image.width; j++) {
      if(i % (pixel_size + pixel_break_size) != 0 && j % (pixel_size + pixel_break_size) != 0) {
        complete_image.data.set(getColor(i, j), 4 * (i * complete_image.width + j));
      }
    }
  }
  doUpdate = 0;
}

function drawCanvas() {
  if(doUpdate == 1)
    updateImage();

  context.putImageData(complete_image, 50, 50);
}

function initializeGrid() {
  canvas = document.getElementById('drawingCanvas');
  context = canvas.getContext("2d");
  bg_grid = context.createImageData(106 * (pixel_size + pixel_break_size) + 1, 17 * (pixel_size + pixel_break_size) + 1);
  for(var i = 0; i < bg_grid.height; i += pixel_size + pixel_break_size) {
    for(var j = 0; j < bg_grid.width; j++) {
      bg_grid.data[4*(i*bg_grid.width + j) + 0] = 120;
      bg_grid.data[4*(i*bg_grid.width + j) + 1] = 120;
      bg_grid.data[4*(i*bg_grid.width + j) + 2] = 120;
      bg_grid.data[4*(i*bg_grid.width + j) + 3] = 255;
    }
  }
  for(var j = 0; j < bg_grid.width; j += pixel_size + pixel_break_size) {
    for(var i = 0; i < bg_grid.height; i++) {
      bg_grid.data[4*(i*bg_grid.width + j) + 0] = 120;
      bg_grid.data[4*(i*bg_grid.width + j) + 1] = 120;
      bg_grid.data[4*(i*bg_grid.width + j) + 2] = 120;
      bg_grid.data[4*(i*bg_grid.width + j) + 3] = 255;
    }
  }
  doUpdate = 1;
  bit_map = [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0];
}

initializeGrid();
drawCanvas();