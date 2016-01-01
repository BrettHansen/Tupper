// Function called upon loading. You can either change this function or the 
// one controlling the drawing
var pixel_size = 10;
var pixel_break_size = 1;
var canvas;
var context;
var bg_grid;
var bit_map;
var complete_image;
var lastPosition;
var drawMode;

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
}

function drawCanvas() {
  updateImage();
  encodeBitmap();

  context.putImageData(complete_image, 0, 0);
}

function getPositionFromEvent(event) {
  var posX = event.pageX - canvas.offsetLeft;
  var posY = event.pageY - canvas.offsetTop;
  var x = Math.floor(posX / (pixel_size + pixel_break_size));
  var y = Math.floor(posY / (pixel_size + pixel_break_size));
  return [x, y];
}

function toggleBit(x, y) {
  if(x >= 0 && x < 106 && y >= 0 && y < 17) {
    bit_map[106 * y + x] = 1 - bit_map[106 * y + x];
    drawCanvas();
  }
}

function setAllBlack() {
  for(var i = 0; i < bit_map.length; i++)
    bit_map[i] = 0;
  drawCanvas();
}

function setAllWhite() {
  for(var i = 0; i < bit_map.length; i++)
    bit_map[i] = 1;
  drawCanvas();
}

function setAllToggle() {
  for(var i = 0; i < bit_map.length; i++)
    bit_map[i] = 1 - bit_map[i];
  drawCanvas();
}

function flipVertical() {
  var new_map = [];
  for(var i = 16; i >= 0; i--)
    new_map = new_map.concat(bit_map.slice(i * 106, i * 106 + 106));
  bit_map = new_map.slice();
  drawCanvas();
}

function flipHorizontal() {
  var new_map = [];
  for(var i = 0; i < 17; i++)
    for(var j = 105; j >= 0; j--)
      new_map.push(bit_map[i * 106 + j]);
  bit_map = new_map.slice();
  drawCanvas();
}

function storeLocation(event) {
  lastPosition = getPositionFromEvent(event);
}

function min(a, b) {
  if(a < b)
    return a;
  return b;
}

function max(a, b) {
  if(a > b)
    return a;
  return b;
}

function editRectangle(event) {
  if(lastPosition == undefined)
    return;
  var endPosition = getPositionFromEvent(event);

  var x1 = min(lastPosition[0], endPosition[0]);
  var y1 = min(lastPosition[1], endPosition[1]);
  var x2 = max(lastPosition[0], endPosition[0]);
  var y2 = max(lastPosition[1], endPosition[1]);
  var x = 0;
  var y = 0;

  for(var i = 0; i < bit_map.length; i++) {
    x = i % 106;
    y = Math.floor(i / 106);
    if(x >= x1 && x <= x2 && y >= y1 && y <= y2) {
      if(drawMode == 2)
        bit_map[i] = 1 - bit_map[i];
      else
        bit_map[i] = drawMode;
    }
  }
  lastPosition = undefined;

  drawCanvas();
}

function changeDrawMode() {
  drawMode = (drawMode + 1) % 3;
  var button_name = "Set Black";
  if(drawMode == 1)
    button_name = "Set White";
  else if(drawMode == 2)
    button_name = "Toggle";

  document.getElementById('edit_mode').value = button_name;
}

function encodeBitmap() {
  var binary_string = "";
  for(var j = 0; j < 106; j++) {
    for(var i = 16; i >= 0; i--) {
      binary_string += bit_map[i * 106 + j];
    }
  }
  var encoded_number = BigInteger.parse(binary_string, 2);
  console.log(encoded_number.toString(10));
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
  bit_map = [];
  for(var i = 0; i < 106 * 17; i++)
    bit_map.push(Math.floor(Math.random() + 1 - i / 106 / 17));
  drawMode = 2;
}

document.getElementById('drawingCanvas').addEventListener("mousedown", storeLocation);
document.getElementById('drawingCanvas').addEventListener("mouseup", editRectangle);
document.getElementById('all_black').addEventListener("click", setAllBlack);
document.getElementById('all_white').addEventListener("click", setAllWhite);
document.getElementById('all_toggle').addEventListener("click", setAllToggle);
document.getElementById('flip_vertical').addEventListener("click", flipVertical);
document.getElementById('flip_horizontal').addEventListener("click", flipHorizontal);
document.getElementById('edit_mode').addEventListener("click", changeDrawMode);

initializeGrid();
drawCanvas();