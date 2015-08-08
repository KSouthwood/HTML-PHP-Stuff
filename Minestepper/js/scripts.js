/****************************************************************************
 * scripts.js
 *
 * Computer Science 50
 * Final Project
 *
 * Play the game of Minestepper (Minesweeper clone).
 ****************************************************************************/

/****************************************************************************
 * 
 *  Constants
 *  =========
 * 
 ****************************************************************************/

var BOX_PXL = 25;	// size of boxes to draw on canvas in pixels
var PADDING = 2;	// size of padding between boxes in pixels
var OFFSET = BOX_PXL + PADDING;

/****************************************************************************
 * 
 *  Data Definitions
 *  ================
 * 
 ****************************************************************************/

/**
 *	Size is Natural
 *	interp. size of minefield
 */

// object for the grid size of the minefield
var SIZES = {
		sml: 10,
		med: 15,
		lrg: 20
};

// object to hold the current size for the game while in play
var size = {
		lvl: SIZES.sml,
		lbl: "sml"
};

/**
 *	Mine is Boolean
 *	interp. true if it's an active mine
 */

var MINE = {
		armed: true,	// active mine
		unarm: false	// inactive mine
};

/**
 * Minefield is Array of Mine
 * interp. array to hold grid of mine locations
 */

var MF1 = [[MINE.armed, MINE.unarm], 
           [MINE.unarm, MINE.armed]];

/**
 * Minecount is Array of Natural
 * interp. array to hold count of mines around a given minefield cell
 */

var MC1 = [[0, 2], 
           [0, 1]];

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

var colors = ['cyan',
              'lightskyblue',
              'deepskyblue',
              'blue',
              'darkblue',
              'forestgreen',
              'darkgreen',
              'orangered',
              'red'];

/**
 *  FlagState is Enumeration
 *  interp. players status of what's in a square
 */

var FLAG = {
		unk: "unknown",
		may: "maybe",
		def: "definite",
		clr: "cleared",
		chk: "checking"
};

/**
 *  Flags is Array of FlagState
 *  array to hold the players status of what's in a square
 */
var F1 = [[FLAG.unk, FLAG.may], 
          [FLAG.def, FLAG.clr]];

/**
 *  GameOver is Boolean
 *  interp. boolean flag to indicate if the game is over
 *  (either found all the mines or stepped on one)
 */
var GO_T = true;
var GO_F = false;

var game = GO_F;

/**
 *  Difficulty is Number
 *  interp. percentage of cells to fill with mines
 */
var DIFF = {
		easy: 0.1, 
		stnd: 0.2, 
		diff: 0.3
}; // 10%, 20% 30% respectively

var difficulty = {
	lvl : DIFF.stnd,
	lbl : "stnd"
}; // set initial difficulty to standard

/****************************************************************************
 * 
 *  Function Definitions
 *  ====================
 * 
 ****************************************************************************/

/**
 *  Initialize variables and arrays
 *  
 */
function initialize() {
	canvas = document.getElementById('gameboard');
	ctx = canvas.getContext('2d');
	canvas.addEventListener('click', handleClick, false);
	
	resizeCanvas(); // sets size of canvas
	
	// 
	mines = Math.floor((size.lvl * size.lvl) * difficulty.lvl);
	clear = (size.lvl * size.lvl) - mines;
	updateMines(mines);
	
	// set up arrays for game play
	drawInitMinefield();
	minefield = populateMinefield(mines);
	minecount = countMines(minefield);
	flags = initArray(size.lvl, FLAG.unk);
	
	document.getElementById("message1").innerHTML = "";
	document.getElementById("message2").innerHTML = "";
}

/**
 *  Event -> NULL
 *  handles mouse click and calls appropriate function based on 
 *  state of ctrl key
 * 
 */

function handleClick(event) {
	if (game) {
		game = GO_F;
		initialize();
		return;
	}
	
	var key = (event.altKey * 4) + (event.shiftKey * 2) + (event.ctrlKey * 1);
	var rc = getRowCol(event);

	switch (key) {
	case 0:
		reveal(rc);
		break;
	case 1:
		stateToDef(rc);
		break;
	case 2:
		stateToMay(rc);
		break;
	default:
		}
}

/**
 * 	Object -> Image
 *  toggles the square from blank to mine and back
 */

function stateToDef(rc) {
	drawRect('gray', rc);
	
	switch (flags[rc.row][rc.col]) {
	case FLAG.unk:
	case FLAG.may:
		flags[rc.row][rc.col] = FLAG.def;
		drawMine(rc);
		mines--;
		break;
	case FLAG.def:
		flags[rc.row][rc.col] = FLAG.unk;
		mines++;
		break;
	default:
	}
	
	updateMines(mines);
}

/**
 * 	Object -> Image
 *  toggles the square from blank to mine and back
 */

function stateToMay(rc) {
	drawRect('gray', rc);
	
	switch (flags[rc.row][rc.col]) {
	case FLAG.def:
		flags[rc.row][rc.col] = FLAG.may;
		mines++;
		updateMines(mines);
		break;
	case FLAG.unk:
		flags[rc.row][rc.col] = FLAG.may;
		drawNumber(rc, "?", 'black');
		break;
	case FLAG.may:
		flags[rc.row][rc.col] = FLAG.unk;
		break;
	default:
	}
	
}

/**
 *	Object -> Image
 *	handles ctrl-click on the canvas - reveals what's behind the square
 * 
 */

function reveal(rc) {

	// return if we've already revealed this cell
	if (flags[rc.row][rc.col] == FLAG.clr) {
		return;
	}
	
	// clear the cell and set it's state to cleared
	clearRect(rc);
	flags[rc.row][rc.col] = FLAG.clr;
	
	// check if there is a mine...
	if (minefield[rc.row][rc.col]) {
		game = GO_T;	// ...game is over if there is...
		drawMine(rc);
		gameOver();
	} else {
		safeStep(rc);	// ...otherwise we continue on.
		clear--;
		if (clear == 0) {
			game = GO_T;
			gameWon();
		}
	}
}

/**
 *  Natural Number/String/Boolean -> Array
 *  defines an array and fills it with a supplied value
 *
 */
function initArray(dimension, fill) {
	var arr = new Array(dimension);
	for (var x = 0; x < dimension; x++) {
		arr[x] = new Array(dimension);
		for (var y = 0; y < dimension; y++) {
			arr[x][y] = fill;
		}
	}
	return arr;
}

/**
 *  Natural -> Array
 *  place some mines randomly on the minefield
 *
 */
function populateMinefield(numMines) {

	var mf = initArray(size.lvl, MINE.unarm);
		
	while (numMines > 0) {
		var placeMine = Math.floor(Math.random() * (size.lvl * size.lvl));
		var row = Math.floor(placeMine / size.lvl);
		var col = placeMine % size.lvl;
		if (mf[row][col] == MINE.unarm) {
			mf[row][col] = MINE.armed;
			numMines--;
		}
	}
	
	return mf;
}

/**
 *  Array -> Array
 *  iterate through minefield and count up mines around each cell
 */
function countMines(mf) {
	// create array for mine count
	var mc = initArray(size.lvl, 0);
	var xlim = size.lvl - 1;
	var ylim = size.lvl - 1;

	// outer loops iterate through the array col by col, row by row
	for (var row = 0; row < size.lvl; row++) {
		for (var col = 0; col < size.lvl; col++) {
			
			// check all neighbors of minefield[row][col]
			for (var x = Math.max(0, row - 1); x <= Math.min(row + 1, xlim); x++) {
				for (var y = Math.max(0, col - 1); y <= Math.min(col + 1, ylim); y++) {
					
					if (x !== row || y !== col) {
						if (mf[x][y]) {
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
 *  String Object -> Image
 *  adds a rectangle to the canvas
 */

function drawRect(color, rc) {
	ctx.fillStyle = color;
	ctx.fillRect(rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 *  Object -> Image
 *  adds a rectangle to the canvas
 */

function clearRect(rc) {
	ctx.clearRect(rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 * Object -> Image
 * draws the image of the mine onto the canvas at the given row and column
 *
 */
function drawMine(rc) {
	ctx.drawImage(mineImg, rctop(rc.col), rctop(rc.row), BOX_PXL, BOX_PXL);
}

/**
 *  Object String String -> Image
 *  draws character in a color at the given row and column
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
 */
function getRowCol(event) {
	var rect = canvas.getBoundingClientRect();
	
	var clicked = {
		row : Math.floor(Math.max((event.clientY - rect.top - 3),0) / OFFSET),
		col : Math.floor(Math.max((event.clientX - rect.left - 3),0) / OFFSET)
	};

	return clicked;
}

/**
 *  Natural -> Natural
 *  calculates the upper left pixel offset for a specified row or column
 */

function rctop(n) {
	return (PADDING + (n * OFFSET));
}

/**
 *  Object -> Image
 *  Found no mine, either print a number or clear cells.
 */

function safeStep(rc) {
	if (minecount[rc.row][rc.col] > 0) {
		drawNumber(rc, minecount[rc.row][rc.col], colors[minecount[rc.row][rc.col]]);
	} else {
		clearZeros(rc, [false, false, false, false]);
	}
	
	return;
}

/**
 *  NULL -> String
 *  player stepped on a mine. Show the mine locations and display a message.
 * 
 */

function gameOver() {

	// highlights all the still hidden mines
	var rc = {row: 0, col: 0};
	for (rc.row = 0; rc.row < size.lvl; rc.row++) {
		for (rc.col = 0; rc.col < size.lvl; rc.col++) {
			if ((flags[rc.row][rc.col] != FLAG.clr) && (minefield[rc.row][rc.col] == MINE.armed)) {
				drawRect('red', rc);
				drawMine(rc);
			}
		}
	}
	
	var m1 = document.getElementById("message1");
	m1.innerHTML = "Game Over!!";
	m1.style.fontSize = "40px";
	m1.style.fontWeight = "bold";
	m1.style.fontFamily = "Sansita One";
	m1.style.color = "red";
	var m2 = document.getElementById("message2");
	m2.innerHTML = "(Click to play again.)";
	m2.style.fontSize = "16px";
	m2.style.fontFamily = "Satisfy";
	m2.style.color = "black";
	
	return;
}

/**
 *  NULL -> String
 *  Player cleared all the mines. Congratulate them.
 * 
 */

function gameWon() {
		
	// highlights all the still hidden mines
	var rc = {row: 0, col: 0};
	for (rc.row = 0; rc.row < size.lvl; rc.row++) {
		for (rc.col = 0; rc.col < size.lvl; rc.col++) {
			if ((flags[rc.row][rc.col] != FLAG.clr) && (minefield[rc.row][rc.col] == MINE.armed)) {
				drawRect('dodgerblue', rc);
				drawMine(rc);
			}
		}
	}
	var m1 = document.getElementById("message1");
	m1.innerHTML = "You won!!";
	m1.style.fontSize = "40px";
	m1.style.fontWeight = "bold";
	m1.style.fontFamily = "Sansita One";
	m1.style.color = "blue";
	
	var m2 = document.getElementById("message2");
	m2.innerHTML = "(Click to play again.)";
	m2.style.fontSize = "16px";
	m2.style.fontFamily = "Satisfy";
	m2.style.color = "black";

	return;
}

/**
 *  Object Object -> Object
 *  Clear cells with minecount of zero and adjacent cells
 * 
 */

function clearZeros(cell, dirs) {
	// check if dirs is all true
	if (dirs[0] && dirs[1] && dirs[2] && dirs[3]) {
		return;
	}

	flags[cell.row][cell.col] = FLAG.chk; // set cell status to checking

	// set-up lookup table
	var move = [ {
		r : -1,
		c : 0,
		d : 2
	}, // Above
	{
		r : 0,
		c : 1,
		d : 3
	}, // Right
	{
		r : 1,
		c : 0,
		d : 0
	}, // Below
	{
		r : 0,
		c : -1,
		d : 1
	} ]; // Left

	// begin checking each direction for another zero
	for (var i = 0; i < move.length; i++) {
		if (dirs[i]) {
			continue;
		}

		dirs[i] = true;

		var rc = {
			row : cell.row + move[i].r,
			col : cell.col + move[i].c
		};

		// Make sure the cell to be checked is in-bounds and hasn't previously
		// been cleared already
		if ((rc.row < 0) || (rc.row >= size.lvl) || (rc.col < 0)
				|| (rc.col >= size.lvl) || (flags[rc.row][rc.col] == FLAG.clr)
				|| (flags[rc.row][rc.col] == FLAG.chk)) {
			continue;
		}

		// Found a zero count, so call the function again with the new cell
		// coordinates
		if (minecount[rc.row][rc.col] == 0) {
			var j = [ false, false, false, false ];
			j[move[i].d] = true;
			clearRect(rc);
			flags[rc.row][rc.col] = FLAG.clr;
			clear--;
			clearZeros(rc, j);
		}
	}
	;

	// Finished checking all directions. Clear all neighbors (including
	// diagonals).
	for (var x = Math.max(0, cell.row - 1); x <= Math.min(cell.row + 1,
			size.lvl - 1); x++) {
		for (var y = Math.max(0, cell.col - 1); y <= Math.min(cell.col + 1,
				size.lvl - 1); y++) {
			if (x !== cell.row || y !== cell.col) {
				if (flags[x][y] == FLAG.unk) {
					if (minecount[x][y] != 0) {
						clear--;
						clearRect({row : x, col : y});
						flags[x][y] = FLAG.clr;
						drawNumber({row : x, col : y}, minecount[x][y], colors[minecount[x][y]]);
					} else {
						clearRect({row : x, col : y});
						flags[x][y] = FLAG.clr;
						clear--;
						clearZeros({row : x, col : y}, [ false, false, false, false ]);
					}
				}
			}
		}
	}

	flags[cell.row][cell.col] = FLAG.clr; // All done. Set cell to cleared and return.

	return;
}

/**
 *	Canvas -> Canvas
 *	calculates the size of the canvas for the minefield
 * 
 */

function resizeCanvas() {
	canvas.width = (size.lvl * OFFSET) +  PADDING;
	canvas.height = canvas.width;
	
	// fill background of canvas for gridlines
	ctx.fillStyle = "lightgray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 *  Canvas Natural -> Image
 *  draws the boxes on the minefield
 */

function drawInitMinefield() {
	var rc = {"row": 0, "col": 0};
	for (rc.row = 0; rc.row < size.lvl; rc.row++) {
		for (rc.col = 0; rc.col < size.lvl; rc.col++) {
			drawRect('gray', rc);
		};
	};
}

/**
 *  Natural -> String
 *  Updates the mines counter on the HTML page
 */

function updateMines(sc) {
	document.getElementById("mines").innerHTML = sc;
	return;
}

/**
 *  Event -> Image
 *  Toggle the button for the difficulty level, updates the difficulty setting
 *  and re-starts the game
 */
function changeDiff() {
	document.getElementById(difficulty.lbl).classList.toggle("btn-primary", false);
	document.getElementById(event.target.id).classList.toggle("btn-primary", true);
	difficulty.lbl = event.target.id;
	difficulty.lvl = DIFF[event.target.id];
	initialize();
	return;
}

/**
 *  Event -> Image
 *  Toggle the button for the size setting, updates the size setting
 *  and re-starts the game
 */
function changeSize() {
	document.getElementById(size.lbl).classList.toggle("btn-primary", false);
	document.getElementById(event.target.id).classList.toggle("btn-primary", true);
	size.lvl = SIZES[event.target.id];
	size.lbl = event.target.id;
	initialize();
	return;
}
