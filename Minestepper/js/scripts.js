/**
 * scripts.js
 *
 * Computer Science 50
 * Final Project
 *
 * Global JavaScript, if any.
 */

/**
 * Play the game of Minestepper (Minesweeper clone)
 */

/**
 * Constants
 * =========
 */

// size of boxes to draw on canvas in pixels
var BOX_PXL = 20;
// size of padding between boxes in pixels
var PADDING = 2;
var OFFSET = BOX_PXL + PADDING;

/**
 * Data Definitions
 * ================
 */

/**
 * Size is Natural
 * interp. size of gameboard
 */

var SIZE = 10;

/**
 *  Mine is Boolean
 *  interp. true if it's an active mine
 */

// active mine
var MA = true;
// inactive mine
var MI = false;

/**
 * Field is Array of Mine
 * interp. array to hold grid of mine locations
 */

var F1 = [[MA, MI], [MI, MA]];

/**
 * Score is Natural
 * interp. count of mines found
 */

var score = 0;
var SC1 = 5;
var SC2 = 10;

/**
 *  Function Definitions
 *  ====================
 */

/**
 *  Initialize variables and gameboard
 *  !!! - write function
 */
function initialize() {
	var canvas = document.getElementById('gameboard');
	canvas.addEventListener('mousedown', mouseClick, false);
	fitToContainer(canvas);
	drawInitGameboard(canvas, SIZE);
	var gameboard = initArray(SIZE, MI);
	populateGameboard(gameboard);
	var minecount = findMines(gameboard);
	console.log(gameboard);
	console.log(minecount);
}

/**
 *  Natural Number/String/Boolean -> Array
 *  defines the array for the gameboard and fills it with a default value
 *
 */
function initArray(size, fill) {
	var x = new Array(size);
	for (var i = 0; i < size; i++) {
		x[i] = new Array(size);
		for ( j = 0; j < size; j++) {
			// set array to all inactive mines (false)
			x[i][j] = fill;
		}
	}
	return x;
}

/**
 *  Canvas -> Canvas
 *  calculates the size os the canvas for the gameboard
 *
 */
function fitToContainer(canvas) {
	canvas.width = (SIZE * BOX_PXL) + ((SIZE + 1) * PADDING);
	canvas.height = canvas.width;
}

/**
 *  Canvas Natural -> Image
 *  draws the boxes on the gameboard
 */

function drawInitGameboard(canvas, size) {
	for (var i = 0; i < SIZE; i++) {
		for (var j = 0; j < SIZE; j++) {
			addRect(canvas, 'gray', i, j);
		};
	};
}

/**
 *  Array -> Array
 *  place mines randomly on the gameboard
 * 
 */
function populateGameboard(minefield) {
	// do mines in 20% of the gameboard
	var mines = Math.floor((SIZE * SIZE) * 0.2);
	while (mines > 0) {
		var placeMine = Math.floor(Math.random() * (SIZE * SIZE));
		var row = Math.floor(placeMine / SIZE);
		var col = placeMine % SIZE;
		if (minefield[row][col] == MI) {
			minefield[row][col] = MA;
			mines--;
		}
	}
}

/**
 *  Array -> Array
 *  iterate through gameboard and count up mines around each cell
 */
function findMines(minefield) {
	// create array for mine count
	var mc = initArray(SIZE, 0);
	var xlim = SIZE - 1;
	var ylim = SIZE - 1;
	
	// 
	for (var row = 0; row < SIZE; row++) {
		for (var col = 0; col < SIZE; col++) {
			// check all neighbors of minefield[row][col]
			for (var x = Math.max(0, row-1); x <= Math.min(row + 1, xlim); x++) {
				for (var y = Math.max(0, col - 1); y <= Math.min(col + 1, ylim); y++) {
					if (x !== row || y !== col) {
						if (minefield[x][y]) {
							mc[row][col]++;
						}
					}
				}
			}
		}
	}
	
	return mc;
}

/**
 *  Event -> ??
 *  handle mouse click on the canvas
 * !!! - not working - col keeps being off by 1
 */
function mouseClick(event) {
	var x = event.x;
	var y = event.y;
	var canvas = document.getElementById("gameboard");
	var xx = x - canvas.offsetParent.offsetLeft;
	var yy = y - canvas.offsetParent.offsetTop;

	// convert (x,y) into (row,col) of square that was clicked
	var row = Math.floor(xx / OFFSET);
	var col = Math.floor(yy / OFFSET);

	addRect(canvas, 'red', row, col);
}

/**
 *  Canvas String Natual Natural -> Image
 *  adds a rectangle to the canvas
 */

function addRect(canvas, color, x, y) {
	ctx = canvas.getContext('2d');
	ctx.fillStyle = color;
	ctx.fillRect((x * OFFSET + PADDING), (y * OFFSET + PADDING), BOX_PXL, BOX_PXL);
}
