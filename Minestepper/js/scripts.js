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
var FS4 = "checking";

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
 *  Difficulty is Number
 *  interp. percentage of cells to fill with mines
 */
var EASY = 0.1; // 10%
var STND = 0.2; // 20%
var DIFF = 0.3; // 30%

var difficulty = STND; // set inital difficulty to standard

/**
 *  Function Definitions
 *  ====================
 */

/**
 *  Initialize variables and minefield
 *  
 */
function initialize() {
	canvas = document.getElementById('gameboard');
	ctx = canvas.getContext('2d');
	canvas.addEventListener('click', handleClick, false);
	
	resizeCanvas(); // sets size of canvas
	
	// set up arrays for game play
	drawInitMinefield(ctx, SIZE);
	minefield = populateMinefield();
	minecount = countMines(minefield);
	flags = initArray(SIZE, FS0);
	
	mines = Math.floor((SIZE * SIZE) * difficulty);
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
	var rc = getRowCol(event);

	// return if we've already revealed this cell
	if (flags[rc.row][rc.col] == FS3) {
		return;
	}
	
	// clear the cell and set it's state to cleared
	clearRect(rc);
	flags[rc.row][rc.col] = FS3;
	
	// 
	if (minefield[rc.row][rc.col]) {
		game = GO_T;
		drawMine(rc);
		gameOver();
	} else {
		safeStep(rc);
		clear--;
		if (clear == 0) {
			game = GO_T;
			gameWon();
		}
	}
}

/**
 * 	Event -> Image
 *  changes the square status from blank to question mark and back
 */

function changeState(event) {
	var rc = getRowCol(event);

	// use switch/case statement??
	switch (flags[rc.row][rc.col]) {
	// if current status is unknown, chanage to definite and display mine on top of square
	case FS0:
		flags[rc.row][rc.col] = FS2;
		drawRect('gray', rc);
		drawMine(rc);
		mines--;
		updateMines(mines);
		break;
	// if current status is maybe, change to unknown and redraw blank square
	case FS1:
		flags[rc.row][rc.col] = FS0;
		drawRect('gray', rc);
		break;
	// if current status is definite, change to maybe and display question mark on top of square
	case FS2:
		flags[rc.row][rc.col] = FS1;
		drawRect('gray', rc);
		drawNumber(rc, "?", 'black');
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
function resizeCanvas() {
	canvas.width = (SIZE * BOX_PXL) + ((SIZE + 1) * PADDING);
	canvas.height = canvas.width;
	
	// fill background of canvas for gridlines
	ctx.fillStyle = "lightgray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

}

/**
 *  Canvas Natural -> Image
 *  draws the boxes on the minefield
 */

function drawInitMinefield(size) {
	var rc = {"row": 0, "col": 0};
	for (rc.row = 0; rc.row < SIZE; rc.row++) {
		for (rc.col = 0; rc.col < SIZE; rc.col++) {
			drawRect('gray', rc);
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
	var mines = Math.floor((SIZE * SIZE) * difficulty);
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

function drawRect(color, rc) {
	ctx.fillStyle = color;
	ctx.fillRect(rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 *  Canvas String Natual Natural -> Image
 *  adds a rectangle to the canvas
 */

function clearRect(rc) {
	ctx.clearRect(rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 * Canvas Natural Natural -> Image
 * draws the image of the mine onto the canvas at the given row and column
 *
 */
function drawMine(rc) {
	ctx.drawImage(mineImg, rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 *  Context Natural Natural -> Image
 *  draws the number of mines around a box as an image
 *
 */

function drawNumber(rc, character, color) {
	ctx.fillStyle = color;
	ctx.font = 'bold ' + (BOX_PXL - (PADDING * 2)) + 'px san-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(character, (rctop(rc.col) + (BOX_PXL / 2)), (rctop(rc.row) + (BOX_PXL / 2)));
}

/**
 *  Event -> Natural
 *  Returns a row and column based on the point clicked on the canvas.
 * 
 *  TODO - Need to refine formula as it keeps being off by 1 when near the right/bottom edge of a square
 */
function getRowCol(event) {
	var clicked = {
		row : 0,
		col : 0
	};

	// subtracting 15 to accomodate row margin and border
	// var xx = (event.x - canvas.offsetParent.offsetLeft - 15);
	// var yy = (event.y - canvas.offsetParent.offsetTop);
	var rect = canvas.getBoundingClientRect();
	var xx = event.clientX - rect.left;
	var yy = event.clientY - rect.top;
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

function safeStep(rc) {
	// one or more mines as a neighbor, so just print how many and return
	if (minecount[rc.row][rc.col] > 0) {
		drawNumber(rc, minecount[rc.row][rc.col], colors[minecount[rc.row][rc.col]]);
		return;
	}

	// no mines as a neighbor, so check if any other neighbors have zero as well and clear those cells
	// TODO - remove (just added in so routine will work for now...)
	console.log("{" + rc.row + "," + rc.col + "} [false, false, false, false] - Initial call to clearZeros.");
	clearZeros(rc, [false, false, false, false]);
	return;
}

/**
 *  Canvas Context -> String
 *  displays game over message
 * @param {Object} canvas
 * @param {Object} context
 */

function gameOver() {
	
	// display game over message on canvas
	ctx.fillStyle = 'red';
	ctx.font = 'bold 40px san-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText("Game Over!!", (canvas.width / 2), (canvas.height / 2));
	
	ctx.fillStyle = 'black';
	ctx.font = '12px serif';
	ctx.fillText("(Click to play again.)", (canvas.width / 2), (canvas.height - 20));
	
	return;
}

/**
 *  Canvas Context -> String
 *  displays game over message
 * @param {Object} canvas
 * @param {Object} context
 */

function gameWon() {
	
	// display game over message on canvas
	ctx.fillStyle = 'blue';
	ctx.font = 'bold 40px san-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText("You won!!", (canvas.width / 2), (canvas.height / 2));
	
	ctx.fillStyle = 'black';
	ctx.font = '12px serif';
	ctx.fillText("(Click to play again.)", (canvas.width / 2), (canvas.height - 20));
	
	return;
}

/**
 *  Object Object -> Object
 *  Clear cells with minecount of zero and adjacent cells
 * 
 * TODO - Call clearZeros when finding a zero while clearing neighboring cells..
 */

function clearZeros(cell, dirs) {
	console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - First call to clear zeros."); // TODO - Remove
	// check if dirs is all true
	if (dirs[0] && dirs[1] && dirs[2] && dirs[3]) {
		return;
	}

	console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Setting status to checking."); // TODO - Remove
	flags[cell.row][cell.col] = FS4;
	
	// set-up lookup table
	var move = [{r: -1, c: 0, d: 2},	// Above
				{r: 0, c: 1, d: 3}, 	// Right
				{r: 1, c: 0, d: 0}, 	// Below
				{r: 0, c: -1, d: 1}];	// Left
	
	// begin checking each direction for another zero
	for (var i=0; i < move.length; i++) {
		console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Trying direction " + i); // TODO - Remove
		if (dirs[i]) {
			console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Direction has been tried."); // TODO - Remove
			continue;
		}
		
		dirs[i] = true;

		var rc =	{row: cell.row + move[i].r,
					col: cell.col + move[i].c};

		// Make sure the cell to be checked is in-bounds and hasn't previously been cleared already
		console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Checking for 0 at {" + rc.row + "," + rc.col + "}"); // TODO - Remove
		if ((rc.row < 0) || (rc.row >= SIZE) || (rc.col < 0) || (rc.col >= SIZE) || (flags[rc.row][rc.col] == FS3) || (flags[rc.row][rc.col] == FS4)) {
			console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Cell out of bounds or cleared."); // TODO - Remove
			continue;
		}
		
		// Found a zero count, so call the function again with the new cell coordinates
		if (minecount[rc.row][rc.col] == 0) {
			var j = [false, false, false, false];
			j[move[i].d] = true;
			clearRect(rc);
			flags[rc.row][rc.col] = FS3;
			clear--;
			console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " Zero found. Calling new clearZeros with: {" + rc.row + "," + rc.col + "} " + JSON.stringify(j)); // TODO - remove
			clearZeros(rc, j);
		}
	};

	console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - All directions tried. Clearing cell neighbors."); // TODO - Remove
	
	// Finished checking all directions. Clear all neighbors (including diagonals).
	for (var x = Math.max(0, cell.row - 1); x <= Math.min(cell.row + 1, SIZE-1); x++) {
		for (var y = Math.max(0, cell.col - 1); y <= Math.min(cell.col + 1, SIZE-1); y++) {
			if (x !== cell.row || y !== cell.col) {
				console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Checking neighbor {" + x + "," + y + "}."); // TODO - Remove
				if ((flags[x][y] == FS0) && (minecount[x][y] != 0)) {
					console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Clearing neighbor {" + x + "," + y + "}."); // TODO - Remove
					clear--;
					clearRect({row: x, col: y});
					flags[x][y] = FS3;
					drawNumber({row: x, col: y}, minecount[x][y], colors[minecount[x][y]]);
				}
			}
		}
	}
	
	// All done. Set cell to cleared and return.
	flags[cell.row][cell.col] = FS3;

	console.log("{" + cell.row + "," + cell.col + "} " + JSON.stringify(dirs) + " - Neighbors cleared. Returning."); // TODO - Remove
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

function changeDiff() {
	switch (event.target.id) {
		case "easy":
			document.getElementById("easy").classList.toggle("btn-primary", true);
			document.getElementById("stnd").classList.toggle("btn-primary", false);
			document.getElementById("diff").classList.toggle("btn-primary", false);
			difficulty = EASY;
			initialize();
			break;
		case "stnd":
			document.getElementById("easy").classList.toggle("btn-primary", false);
			document.getElementById("stnd").classList.toggle("btn-primary", true);
			document.getElementById("diff").classList.toggle("btn-primary", false);
			difficulty = STND;
			initialize();
			break;
		case "diff":
			document.getElementById("easy").classList.toggle("btn-primary", false);
			document.getElementById("stnd").classList.toggle("btn-primary", false);
			document.getElementById("diff").classList.toggle("btn-primary", true);
			difficulty = DIFF;
			initialize();
			break;
	}
}

function changeSize() {
	SIZE = Number(document.getElementById("size").value);
	initialize();
	return;
}
