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

//-----Recurring-----

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
  console.log("updated");
}

function drawCanvas() {
  if(doUpdate == 1)
    updateImage();

  context.putImageData(complete_image, 50, 50);
}

function toggleBitAtPixel(event) {
  var posX = event.pageX - canvas.offsetLeft - 50;
  var posY = event.pageY - canvas.offsetTop - 50;
  var x = Math.floor(posX / (pixel_size + pixel_break_size));
  var y = Math.floor(posY / (pixel_size + pixel_break_size));
  if(x >= 0 && x < 106 && y >= 0 && y < 17) {
    bit_map[106 * y + x] = 1 - bit_map[106 * y + x];
    doUpdate = 1;
    drawCanvas();
  }
}

//-----Initialization-----

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
  bit_map = [];
  for(var i = 0; i < 106 * 17; i++)
    bit_map.push(Math.floor(Math.random() + 1 - i / 106 / 17));
  console.log("once");
}

document.getElementById('drawingCanvas').addEventListener("mousedown", function(event){toggleBitAtPixel(event);});
initializeGrid();
drawCanvas();