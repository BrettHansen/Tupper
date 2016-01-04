// Function called upon loading. You can either change this function or the 
// one controlling the drawing
var pixel_size = 9;
var pixel_break_size = 1;
var canvas;
var context;
var bg_grid;
var bit_map;
var complete_image;
var lastPosition;
var drawMode;

var black = [0, 0, 0, 255];
var grey = [180, 180, 180, 255];
var white = [255, 255, 255, 255];

//-----Recurring-----

function getColor(i, j) {
  if(i % (pixel_size + pixel_break_size) <= pixel_break_size || j % (pixel_size + pixel_break_size) <= pixel_break_size)
    return grey;
  if(bit_map[Math.floor(i / (pixel_size + pixel_break_size)) * 106 + Math.floor(j / (pixel_size + pixel_break_size))] == 0)
    return white;
  return black;
}

function updateImage() {
  var color_array = bg_grid.data.slice();
  complete_image = context.createImageData(106 * pixel_size + 107 * pixel_break_size, 17 * pixel_size + 18 * pixel_break_size);
  complete_image.data.set(color_array);
  for(var i = 0; i < complete_image.height; i++) {
    for(var j = 0; j < complete_image.width; j++) {
      complete_image.data.set(getColor(i, j), 4 * ((complete_image.height - i - 1) * complete_image.width + complete_image.width - j - 1));
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
  var button_name = "Set White";
  if(drawMode == 1)
    button_name = "Set Black";
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
  encoded_number = encoded_number.multiply(17);
  document.getElementById('k_value').value = encoded_number.toString(10);
}

function sanitize(str) {
  return str.replace(/\W/g, '');
}

function updateKFromEntry() {
  var input = sanitize(document.getElementById('k_value').value);
  document.getElementById('k_value').value = input;
  var entry = BigInteger.parse(input, 10);
  entry = entry.quotient(17);
  var columnwise_binary_string = entry.toString(2);
  while(columnwise_binary_string.length < 106 * 17) {
    columnwise_binary_string = "0" + columnwise_binary_string;
  }
  var new_map = [];
  for(var i = 16; i >= 0; i--) {
    for(var j = 0; j < 106; j++) {
      new_map.push(parseInt(columnwise_binary_string[17 * j + i], 2));
    }
  }
  bit_map = new_map.slice();
  drawCanvas();
}

//-----Initialization-----

function initializeGrid() {
  canvas = document.getElementById('drawingCanvas');
  context = canvas.getContext("2d");
  bg_grid = context.createImageData(106 * pixel_size + 107 * pixel_break_size, 17 * pixel_size + 18 * pixel_break_size);

  for(var i = 0; i < bg_grid.height; i++) {
    for(var j = 0; j < bg_grid.width; j++) {
      if(i % (pixel_size + pixel_break_size) <= pixel_break_size ||
         j % (pixel_size + pixel_break_size) <= pixel_break_size) {
        bg_grid.data.set(grey, 4 * (i * bg_grid.width + j));
      }
    }
  }
  var tupper = "9609393799189588849716729621278527547150043396601293066515055192717028023952664" +
               "2468964284217435071812126715378277062335599323728087414430789132596394133772348" +
               "7857735749823926629715517173716995165232890538221612403238855866184013235585136" +
               "0488286933379024914542292886670810961844960917051834540678277315517054053816273" +
               "8096760256562501698148208341878316384911559022561000365235137034387446184837873" +
               "7238198224849863465033159410054974700593138339226497249461751545728366702369745" +
               "461014655997933798537483143786841806593422227898388722980000748404719";
  document.getElementById('k_value').value = tupper;
  updateKFromEntry();
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
document.getElementById('k_value').addEventListener("keyup", updateKFromEntry);

initializeGrid();
drawCanvas();