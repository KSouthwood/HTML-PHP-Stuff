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
var BOX_PXL = 25;
// size of padding between boxes in pixels
var PADDING = 2;
var OFFSET = BOX_PXL + PADDING;

/**
 * Data Definitions
 * ================
 */

/**
 * Size is Natural
 * interp. size of minefield
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
 * Minefield is Array of Mine
 * interp. array to hold grid of mine locations
 */

var MF1 = [[MA, MI], [MI, MA]];
var minefield;

/**
 * Minecount is Array of Natural
 * interp. array to hold count of mines around a given Minefield cell
 */

var MC1 = [[0, 2], [0, 1]];
var minecount;
/**
 * Score is Natural
 * interp. count of mines found
 */

var score = 0;
var SC1 = 5;
var SC2 = 10;

/**
 *  Colors is Enumeration
 *  interp. list of colors to use for displaying number of mines
 */

var colors = ['cyan', 'lightskyblue', 'deepskyblue', 'blue', 'darkblue', 'forestgreen', 'darkgreen', 'orangered', 'red'];

/**
 *  FlagState is Enumeration
 *  interp. players status of what's in a square
 */

var FS0 = "unknown";
var FS1 = "maybe";
var FS2 = "definite";
var FS3 = "cleared";
/**
 *  Flags is Array of FlagState
 *  array to hold the players status of what's in a square
 */
var F1 = [[FS0, FS1], [FS2, FS3]];
var flags;

/**
 * GameOver is Boolean
 * interp. boolean flag to indicate if the game is over (either found all the mines or stepped on one)
 */
var GO_T = true;
var GO_F = false;

var game = GO_F;

/**
 *  Function Definitions
 *  ====================
 */

/**
 *  Initialize variables and minefield
 *  
 */
function initialize() {
	var canvas = document.getElementById('gameboard');
	var ctx = canvas.getContext('2d');
	canvas.addEventListener('click', handleClick, false);
	
	resizeCanvas(canvas); // sets size of canvas
	
	// set up arrays for game play
	drawInitMinefield(ctx, SIZE);
	minefield = populateMinefield();
	minecount = countMines(minefield);
	flags = initArray(SIZE, FS0);
	
	mines = Math.floor((SIZE * SIZE) * 0.2);
	clear = (SIZE * SIZE) - mines;
	updateMines(mines);
}

/**
 *  Event
 *  handles mouse click and calls appropriate function based on state of ctrl key
 * 
 */

function handleClick(event) {
	if (game) {
		game = GO_F;
		initialize();
		return;
	}
	
	if (event.ctrlKey) {
		changeState(event);
	} else {
		reveal(event);
	}
}
/**
 *  Event -> Image
 *  handles double click on the canvas - reveals whats behind the square
 * !!! - not working - col keeps being off by 1
 */

function reveal(event) {
	var canvas = document.getElementById("gameboard");
	var ctx = canvas.getContext('2d');
	var rc = getRowCol(canvas, event);

	// return if we've already revealed this cell
	if (flags[rc.row][rc.col] == FS3) {
		return;
	}
	
	// clear the cell and set it's state to cleared
	clearRect(ctx, rc);
	flags[rc.row][rc.col] = FS3;
	
	// 
	if (minefield[rc.row][rc.col]) {
		game = GO_T;
		drawMine(ctx, rc);
		gameOver(canvas, ctx);
	} else {
		safeStep(ctx, rc);
		clear--;
		if (clear == 0) {
			game = GO_T;
			gameWon(canvas, ctx);
		}
	}
}

/**
 * 	Event -> Image
 *  changes the square status from blank to question mark and back
 */

function changeState(event) {
	var canvas = document.getElementById("gameboard");
	var context = canvas.getContext('2d');
	var rc = getRowCol(canvas, event);

	// use switch/case statement??
	switch (flags[rc.row][rc.col]) {
	// if current status is unknown, chanage to definite and display mine on top of square
	case FS0:
		flags[rc.row][rc.col] = FS2;
		drawRect(context, 'gray', rc);
		drawMine(context, rc);
		mines--;
		updateMines(mines);
		break;
	// if current status is maybe, change to unknown and redraw blank square
	case FS1:
		flags[rc.row][rc.col] = FS0;
		drawRect(context, 'gray', rc);
		break;
	// if current status is definite, change to maybe and display question mark on top of square
	case FS2:
		flags[rc.row][rc.col] = FS1;
		drawRect(context, 'gray', rc);
		drawNumber(context, rc, "?", 'black');
		mines++;
		updateMines(mines);
		break;
	// if current status is cleared, do nothing
	case FS3:
	default:
		break;
	}
}

/**
 *  Canvas -> Canvas
 *  calculates the size of the canvas for the minefield
 *
 */
function resizeCanvas(canvas) {
	canvas.width = (SIZE * BOX_PXL) + ((SIZE + 1) * PADDING);
	canvas.height = canvas.width;
	
	// fill background of canvas for gridlines
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "lightgray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

}

/**
 *  Canvas Natural -> Image
 *  draws the boxes on the minefield
 */

function drawInitMinefield(context, size) {
	var rc = {"row": 0, "col": 0};
	for (rc.row = 0; rc.row < SIZE; rc.row++) {
		for (rc.col = 0; rc.col < SIZE; rc.col++) {
			drawRect(context, 'gray', rc);
		};
	};
}

/**
 *  Natural Number/String/Boolean -> Array
 *  defines an array and fills it with a supplied value
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
 *  Array -> Array
 *  place mines randomly on the minefield
 *
 */
function populateMinefield() {
	// create minefield
	var mf = initArray(SIZE, MI);
		
	// do mines in 20% of the minefield
	var mines = Math.floor((SIZE * SIZE) * 0.2);
	while (mines > 0) {
		var placeMine = Math.floor(Math.random() * (SIZE * SIZE));
		var row = Math.floor(placeMine / SIZE);
		var col = placeMine % SIZE;
		if (mf[row][col] == MI) {
			mf[row][col] = MA;
			mines--;
		}
	}
	
	return mf;
}

/**
 *  Array -> Array
 *  iterate through minefield and count up mines around each cell
 */
function countMines(minefield) {
	// create array for mine count
	var mc = initArray(SIZE, 0);
	var xlim = SIZE - 1;
	var ylim = SIZE - 1;

	//
	for (var row = 0; row < SIZE; row++) {
		for (var col = 0; col < SIZE; col++) {
			// check all neighbors of minefield[row][col]
			for (var x = Math.max(0, row - 1); x <= Math.min(row + 1, xlim); x++) {
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
 *  Canvas String Natual Natural -> Image
 *  adds a rectangle to the canvas
 */

function drawRect(context, color, rc) {
	context.fillStyle = color;
	context.fillRect(rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 *  Canvas String Natual Natural -> Image
 *  adds a rectangle to the canvas
 */

function clearRect(context, rc) {
	context.clearRect(rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 * Canvas Natural Natural -> Image
 * draws the image of the mine onto the canvas at the given row and column
 *
 */
function drawMine(context, rc) {
	context.drawImage(mineImg, rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 *  Context Natural Natural -> Image
 *  draws the number of mines around a box as an image
 *
 */

function drawNumber(context, rc, character, color) {
	context.fillStyle = color;
	context.font = 'bold ' + (BOX_PXL - (PADDING * 2)) + 'px san-serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText(character, (rctop(rc.col) + (BOX_PXL / 2)), (rctop(rc.row) + (BOX_PXL / 2)));
}

/**
 *  Event -> Natural
 */
function getRowCol(canvas, event) {
	var clicked = {
		row : 0,
		col : 0
	};

	// subtracting 15 to accomodate row margin and border
	var xx = (event.x - canvas.offsetParent.offsetLeft - 15);
	var yy = (event.y - canvas.offsetParent.offsetTop);

	// convert (x,y) into (row,col) of square that was clicked
	clicked.row = Math.floor(yy / OFFSET);
	clicked.col = Math.floor(xx / OFFSET);

	// TODO - remove when complete - just for debugging purposes
	console.log('Clicked: {', event.x, ',', event.y, '} Canvas point: {', xx, ',', yy, '} Gameboard {', clicked.row, ',', clicked.col, '}');

	return clicked;
}

/**
 *  Natural -> Natural
 *  calculates the upper left pixel offset for a specified row or column
 */

function rctop(n) {
	return (PADDING + (n * BOX_PXL) + (n * PADDING));
}

/**
 *  Context Natural Natural -> ??
 *  safe step (found no mine), now we reveal how many mines are around us
 */

function safeStep(context, rc) {
	// one or more mines as a neighbor, so just print how many and return
	if (minefield[rc.row, rc.col] != 0) {
		drawNumber(context, rc, minecount[rc.row][rc.col], colors[minecount[rc.row][rc.col]]);
		return;
	}

	// no mines as a neighbor, so check if any other neighbors have zero as well and clear those cells
	drawNumber(context, rc, minecount[rc.row][rc.col], colors[minecount[rc.row][rc.col]]);
	// TODO - remove (just added in so routine will work for now...)
	return;
}

/**
 *  Canvas Context -> String
 *  displays game over message
 * @param {Object} canvas
 * @param {Object} context
 */

function gameOver(canvas, context) {
	
	// display game over message on canvas
	context.fillStyle = 'red';
	context.font = 'bold 40px san-serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText("Game Over!!", (canvas.width / 2), (canvas.height / 2));
	
	context.fillStyle = 'black';
	context.font = '12px serif';
	context.fillText("(Click to play again.)", (canvas.width / 2), (canvas.height - 20));
	
	return;
}

/**
 *  Canvas Context -> String
 *  displays game over message
 * @param {Object} canvas
 * @param {Object} context
 */

function gameWon(canvas, context) {
	
	// display game over message on canvas
	context.fillStyle = 'blue';
	context.font = 'bold 40px san-serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText("You won!!", (canvas.width / 2), (canvas.height / 2));
	
	context.fillStyle = 'black';
	context.font = '12px serif';
	context.fillText("(Click to play again.)", (canvas.width / 2), (canvas.height - 20));
	
	return;
}

function clearZeros() {
	return;
}

/**
 *  Natural -> String
 *  Updates the mines counter on the HTML page
 */

function updateMines(sc) {
	var elem = document.getElementById("mines");
	elem.innerHTML = sc;
	return;
}
