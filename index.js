//Config
const GridSize = 10; //n by n Grid
const drawWaitTime = 50; // Update Wait Timer (in ms)
const allowCallStackDraw = false // Set to true to Draw the CallStack
const charset = 1; // 0 or 1 (0:  ■ for unvisited, ▣ for Visited, ☼ for returned | 1: ▓ for unvisited, ▒ for Visited, ░ for returned) Symbols used my maze walker

//Statics
let visitedMap = []; // Keep Cache of Visted Cells
let callStack = []; // CallStack itself

const utils = {
	getRandom: function(min, max) { // Generate random number from min to max INCLUSIVE
		return Math.floor(Math.random() * max+1) + min;
	},
	getChildren: function (parent) {
		let strBuild = "";
		let children = [];
		if (parent == undefined) { return []}

		if (parent.x-1 >= 0 && visitedMap[parent.y] && visitedMap[parent.y][parent.x-1] == 0) {
			children.push({
				x: parent.x-1,
				y: parent.y
			});
			strBuild += "W: "+visitedMap[parent.y][parent.x-1]+", "
		}
		if (parent.x+1 <= GridSize-1 && visitedMap[parent.y]  && visitedMap[parent.y][parent.x+1] == 0) {
			children.push({
				x: parent.x+1,
				y: parent.y
			});
			strBuild += "E: "+visitedMap[parent.y][parent.x+1]+", "
		}
		if (parent.y-1 >= 0 && visitedMap[parent.y-1][parent.x] == 0) {
			children.push({
				x: parent.x,
				y: parent.y-1
			});
			strBuild += "N: "+visitedMap[parent.y-1][parent.x]+", "
		}
		if (parent.y+1 <= GridSize-1 && visitedMap[parent.y+1][parent.x] == 0) {
			children.push({
				x: parent.x,
				y: parent.y+1
			});
			strBuild += "S: "+visitedMap[parent.y+1][parent.x]+", "
		}
		//console.log(strBuild);
		//console.log("Unvisited Neighbours:", children)

		return children;
	},
	getRndChild: function(parent) {
		let children = utils.getChildren(parent);
		let rndNum = utils.getRandom(0, children.length-1)
		//console.log("rndNum:",rndNum);
		return children.length == 1 ? children[0] : children[rndNum];
	},
	hasUnvisitedChilds: function (parent) {
		let childs = utils.getChildren(parent);
		if (childs.length > 0) {return true;}
		return false;
	}
}

function drawLab(gridSize, currCoors) {
	console.clear();
	console.log("=====================");
	console.log("Labrind Draw");
	if(currCoors != undefined){
		console.log("Next Position: X: "+currCoors.x+" Y: "+currCoors.y);
	}else  {
		console.log("!Maze Ended!")
	}
	
	let strBuild = "";
	for (var i = 0; i < gridSize; i++) {
		for (var j = 0; j < gridSize; j++) {
			if(visitedMap[i][j] == 2){
				strBuild += charset == 0 ? "☼": "░";
			}else if (visitedMap[i][j] == 1) {
				strBuild += charset == 0 ? "▣": "▒";
			}else{
				strBuild += charset == 0 ? "■": "▓";
			}
		}
		strBuild += "\n";
	}
	console.log(strBuild);
	

	let stackStrBuild = "";
	for (var i = callStack.length - 1; i >= 0; i--) {
		stackStrBuild += callStack[i]+"\n"
	}

	if (allowCallStackDraw) {
		console.log("=====================");
		console.log("CallStack Draw");
		console.log(callStack);
	}
	
	console.log("=====================\n");
}

function drawLabrinth(gridSize) {

/*

Pseudo-code (Source: Wikipedia)
Make the initial cell the current cell and mark it as visited
While there are unvisited cells
	If the current cell has any neighbours which have not been visited
		Choose randomly one of the unvisited neighbours
		Push the current cell to the stack
		Remove the wall between the current cell and the chosen cell
		Make the chosen cell the current cell and mark it as visited
	Else if stack is not empty
		Pop a cell from the stack
		Make it the current cell

"Codie" Pseudo-Code
var currCell = initalCell;
while(unvisited){
	if(currCell has unvisited Neighbours){
		var rndNeihbour = some neighbour
		callstack += rndNeihbour
		removedoor between currCell and rndNeihbour
		currCell = rndNeihbour
	}else{
		callstack.splice(length-1, 1)
		currCell = callstack[length]
	}
}
*/

	const initCoords = {
		x: utils.getRandom(0, gridSize-1),
		y: utils.getRandom(0, gridSize-1)
	}
	callStack[callStack.length] = initCoords;
	let unvisitedNeighbours = true;
	let currCoors = initCoords;
	let canShutdown = false;
	let intervalID;
	let lastRun = false;
	intervalID = setInterval(function () { // Use Interval just to change speed of update (Better Drawings!! :D )
		drawLab(gridSize, currCoors);
		//console.log(currCoors)
		//console.log("Starting Point:", "Y:", "("+currCoors.y+")", "X:", "("+alphabet[currCoors.x-1]+") ("+currCoors.x+")\n");
		//console.log(visitedMap)
		if(utils.hasUnvisitedChilds(currCoors)){
			var rndNeighbour = utils.getRndChild(currCoors);
			//console.log("Selected Child Point:", "Y:", "("+rndNeighbour.y+")", "X:", "("+alphabet[rndNeighbour.x-1]+") ("+rndNeighbour.x+")\n");
			callStack[callStack.length] = rndNeighbour;
			visitedMap[currCoors.y][currCoors.x] = 1;
			//console.log("Cell Value:",visitedMap[currCoors.y][currCoors.x])
			currCoors = rndNeighbour;
		}else{
			//console.log("Going Back!");
			callStack.splice(callStack.length-1, 1);
			if (currCoors != undefined) {
				visitedMap[currCoors.y][currCoors.x] = 2;
			}
			currCoors = callStack[callStack.length-1];

		}
		if(lastRun){
			clearInterval(intervalID);
			return;
		}
		if(canShutdown && callStack.length == 0){
			lastRun = true;
		}

		canShutdown = true;
	}, drawWaitTime);
}


function prepareVars(gridSize) {
	for (var i = 0; i < gridSize; i++) {
		visitedMap[i] = [];
		for (var j = 0; j < gridSize; j++) {
			visitedMap[i][j] = 0;
		}
	}
}

function runMaze (gridSize) {
	prepareVars(gridSize);
	drawLabrinth(gridSize);
}
runMaze(GridSize);