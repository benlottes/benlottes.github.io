//CONNECT FOUR SPECIFIC OBJECTS

//Object to store as the red/blue/empty tokens
class PlayerColor {
	constructor(color) {
		if(color == "Red" || color == "Blue" || color == "Empty"){
			this.color = color;
		} else {
			throw "Invalid Color Assignment";
		}
	}
	getColor(){
		return(this.color);
	}
	setColor(newColor){
		this.color = newColor;
	}
	flipColor(){
		if (this.color == 'Red') {
			this.color = 'Blue';
		} else if (this.color == 'Blue') {
			this.color = 'Red';
		} else {
			this.color = 'Empty';
		}
	}
	notColor(){
		if(this.color == 'Red'){
			return 'Blue';
		}
		else if (this.color == 'Blue'){
			return 'Red';
		} else {
			return 'Empty';
		}
		
	}
}

// Board Class
// Building background array with empty PlayerColors.
// Functions to manipulate array, access variables, and check for winner
class Board {
	constructor(){
		this.cols  = 7;
		this.rows  = 6;
		this.redWins = 0;
		this.blueWins = 0;
		this.turn = new PlayerColor('Red');
		this.hasWinner = false;
		this.board = new Array(this.rows).fill().map(() => (new Array(this.cols).fill().map(() => (new PlayerColor('Empty')))));

	}
	// Gets Red Wins
	getRedWins(){
		return this.redWins;
	}
	// Gets Blue Wins
	getBlueWins(){
		return this.blueWins;
	}
	// Adds win to given color 
	addWin(color){
		if(color == 'Red'){
			this.redWins++;
		} else if(color == 'Blue'){
			this.blueWins++;
		}
	}
	
	// Clears the board when called
	clearBoard(){
		this.board.forEach( elem =>
			elem.forEach( e => e.setColor('Empty') ));
	}
	
	// Sets this.hasWinner to true after called.
	setWon(){
		this.hasWinner = true;
	}
	
	// Sets this.hasWinner to false after called
	resetWon(){
		this.hasWinner = false;
	}
	
	/* Inserts the color from the object PlayerColor into the
	   next available row of the column, returns [-1,-1] on fail */
	takeTurn(colIndex, playerColor){
		for(let rowIndex = this.rows-1; rowIndex >= 0; rowIndex--){
			if (this.board[rowIndex][colIndex].getColor() == 'Empty'){
				this.board[rowIndex][colIndex].setColor(this.turn.getColor());
				return [rowIndex,colIndex];
			}
		}
		return [-1,-1];
	}
	
	//Printing connect four board to the console for debugging
	printBoardConsole(){
		for(let rowIndex = 0; rowIndex < this.rows; rowIndex++){
			for(let colIndex = 0; colIndex < this.cols; colIndex++){
				let b = this.board[rowIndex][colIndex];
				switch(true){
					case (b.getColor() == 'Empty'):
						console.log('O');
						break;
					case (b.getColor() == 'Red'):
						console.log('R');
						break;
					case (b.getColor() == 'Blue'):
						console.log('B');
						break;
				}
			}
			console.log('\n');
		}
	}
	
	//return current turn color, flip the turn after array and screen are updated.
	getTurn(){
		let currentTurn = new PlayerColor(this.turn.getColor());
		this.turn.flipColor();
		return currentTurn;
	}
	
	//return color at index
	getColor(rowIndex, colIndex){
		return this.board[rowIndex][colIndex].getColor();
	}
	
	//Not most efficent but checks only current row column, and diagonal X.
	checkWinner(rowIndex,colIndex){
		// Horizontal cases
		let colorCounter = 0;
		for(let col = 0; col < this.cols; col++){
			if(this.board[rowIndex][col].getColor() == this.turn.notColor()){
				colorCounter++;
				if(colorCounter == 4){
					return 1;
				}
			} else {
				colorCounter = 0;
			}
			
		}
		
		// Vertical cases
		colorCounter = 0;
		for(let row = 0; row < this.rows; row++){
			if(this.board[row][colIndex].getColor() == this.turn.notColor()){
				colorCounter++;
				if(colorCounter == 4){
					return 1;
				}
			} else {
				colorCounter = 0;
			}
		}
		
		// Left Diagonal Case, I observed that the indexes (row - col) is a constant value for each 
		// left leaning diagonal. from bottom left to top right 5, 4, 3, 2, 1, 0, -2, -3, -4, -5, -6
		// I do not need to look at the first and last three diagonals since they don't have four in a row
		// I map the row and col to the highest index in the diagonal so I can work my way down
		colorCounter = 0;
		if(((rowIndex-colIndex) < 3) && ((rowIndex-colIndex) > -4)){
			let convert = (r, c) => {
				if(rowIndex-colIndex < 0){
					return [0, Math.abs(rowIndex - colIndex)];
				} else if (rowIndex-colIndex >= 0){
					return [rowIndex - colIndex, 0];
				}
			}
			let newIndex = convert(rowIndex,colIndex);
			let r = newIndex[0];
			let c = newIndex[1];
			for(let row = r, col = c; (row < this.rows) && (col < this.cols); row++, col++){
				if(this.board[row][col].getColor() == this.turn.notColor()){
					colorCounter++;
					if(colorCounter == 4){
						return 1;
					}
				} else {
					colorCounter = 0;
				}
			}
		}		
		
		// Right Diagonal Case, I observed that the indexes (row + col) is a constant value for each 
		// right leaning diagonal. from bottom right to top left 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
		// I do not need to look at the first and last three diagonals since they don't have four in a row
		// I map the row and col to the lowest value in the diagonal so I can work my way up
		colorCounter = 0;
		if(((rowIndex + colIndex) > 2) && ((rowIndex + colIndex) < 9)){
			let convert = (r, c) => {
				if(rowIndex+colIndex <= 6){
					return [0, rowIndex + colIndex];
				} else if (rowIndex+colIndex > 6){
					return [Math.floor((rowIndex+colIndex)/4), 6];
				}
			}
			let newIndex = convert(rowIndex,colIndex);
			let r = newIndex[0];
			let c = newIndex[1];
			for(let row = r, col = c; (row < this.rows) && (col >= 0); row++, col--){
				if(this.board[row][col].getColor() == this.turn.notColor()){
					colorCounter++;
					if(colorCounter == 4){
						return 1;
					}
				} else {
					colorCounter = 0;
				}
			}
		}			
	}
}



// GLOBAL VARS
let mainBoard = new Board();
let windowBuilder;


// HELPER FUNCTION
// Round x value to nearest multiple of 80, this makes the mouse event listener cleaner
function toNearestEighty(x) {
	let i = 1;
	while(x % 80 != 0){
		if(x < 80*i){
			return (80*i);
		}
		i++;
	}
	// If it is already rounded return
	return(x);
}


// DRAWING CLASSES

// Drawing Window, and handling tile placement
class BuildWindow {
	constructor(can,con){
		this.canvas = can;
		this.context = con;
		this.board = mainBoard;
	}
	
	drawWins(){
		this.context.clearRect(400, 490, 560, 545);
		
		this.context.font = '24px Helvetica';
		this.context.fillStyle = 'Black';
		this.context.fillText(('Wins:'), 400, 510); 
		this.context.fillStyle = 'Red';
		this.context.fillText((this.board.getRedWins()), 480, 510); 
		this.context.fillStyle = 'Blue';
		this.context.fillText((this.board.getBlueWins()), 520, 510);
	}
	
	playAgain(){
		this.drawWins();
		this.context.beginPath();
		this.context.rect(5,485, 265, 55);
		this.context.fillStyle = "Black";
		this.context.fill();
		
		this.context.font = '45px Helvetica';
		this.context.fillStyle = 'White';
		this.context.fillText(("Play Again?"), 15, 525); 
	}
	
	winSequence(color){
		this.board.addWin(color);
		this.board.setWon();
		
		this.context.beginPath();
		this.context.rect(10,10, 240, 50);
		this.context.fillStyle = "Gray";
		this.context.fill();
		
		this.context.font = '45px Helvetica';
		this.context.fillStyle = 'White';
		this.context.fillText((color.concat(' Wins!')), 25, 50); 
		
		this.playAgain();
	}
	
	drawGrid(){
		for(let i = 0; i <= 560; i += 80){
			this.context.beginPath();
			this.context.moveTo(i, 0);
			this.context.lineTo(i, 480);
			this.context.stroke();
		}
		for(let i = 0; i <= 480; i += 80){
			this.context.beginPath();
			this.context.moveTo(0, i);
			this.context.lineTo(560, i);
			this.context.stroke();
		}
	}
	
	createNewChip(xCoord, yCoord){
		this.context.beginPath();
		this.context.arc(xCoord, yCoord, 36, 0, 2*Math.PI);
		this.context.fillStyle = this.board.getTurn().getColor();
		this.context.fill();
	}	

	placeChip(rowIndex, colIndex){
		// Also check for full col, if so do nothing.
		if(rowIndex != -1 && colIndex != -1){
			this.createNewChip(40 + 80*(colIndex), 40 + 80*(rowIndex));
			if(this.board.checkWinner(rowIndex,colIndex) == 1){
				this.winSequence(this.board.getColor(rowIndex, colIndex));
			} 
		}
	}
	
	resetWindow(){
		this.context.clearRect(0, 0, 560, 545);
		this.drawGrid();
		this.drawWins();
	}
}

// EVENT LISTENERS

// Checking for mouse clicks.
// The switch statement has funny syntax! This way each case has it's own scope and I can reuse row and col
function clickEvent(e){
	const [x,y] = [e.offsetX,e.offsetY];
	let b = mainBoard;
	let w = windowBuilder;
	if(b.hasWinner != true){
				if(y < 481){
			switch(toNearestEighty(x)){
				case 80: {
					let [row,col] = b.takeTurn(0);
					w.placeChip(row,col);
					break;
				}
				case 160: {
					let [row,col] = b.takeTurn(1);
					w.placeChip(row,col);
					break;
				}
				case 240: {
					let [row,col] = b.takeTurn(2);
					w.placeChip(row,col);
					break;
				}
				case 320: {
					let [row,col] = b.takeTurn(3);
					w.placeChip(row,col);
					break;
				}
				case 400: {
					let [row,col] = b.takeTurn(4);
					w.placeChip(row,col);
					break;
				}
				case 480: {
					let [row,col] = b.takeTurn(5);
					w.placeChip(row,col);
					break;
				}
				case 560: {
					let [row,col] = b.takeTurn(6);
					w.placeChip(row,col);
					break;
				}
				default:
					console.log('Out of bounds');
			}
		} else {
			console.log('Out of bounds');
		}
	} else if(x < 265  && y > 480){
		b.clearBoard();
		b.resetWon();
		w.resetWindow();
	}
}

document.addEventListener("click", clickEvent)

// Help windowbuilder to store canvas and context
document.addEventListener("DOMContentLoaded", () => { 
	canvas = document.querySelector("#myCanvas")
	windowBuilder = new BuildWindow(canvas, canvas.getContext('2d'));
	console.log("Canvas and Context Loaded");
	windowBuilder.drawGrid();
	windowBuilder.drawWins();
})