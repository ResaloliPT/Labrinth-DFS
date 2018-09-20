//Config
const GridSize = 25; //n by n Grid
const drawWaitTime = 1; // Update Wait Timer (in ms)
const allowCallStackDraw = false; // Set to true to Draw the CallStack
const charset = 0; // 0 or 1 (0:  ■ for unvisited, ▣ for Visited, ☼ for returned | 1: ▓ for unvisited, ▒ for Visited, ░ for returned) Symbols used my maze walker

//Statics
let visitedMap = []; // Keep Cache of Visted Cells
let callStack = []; // CallStack itself
let TreeList = []; // Contains the tree

const labrinthSectorParts= {
	 horonzontal: " --- ", // Normal walls
	 closedSides: "|   |",
	    leftSide: "|    ",
	   rightSide: "    |",
	     noWalls: "     ",
	closedSidesR: "| R |", // Walls for Root
	   leftSideR: "| R  ",
	  rightSideR: "  R |",
		noWallsR: "  R  ",
	closedSidesD: "| D |", // Walls for Destination
	   leftSideD: "| D  ",
	  rightSideD: "  D |",
		noWallsD: "  D  ",
	closedSidesP: "| P |", // Walls for Maze Path
	   leftSideP: "| P  ",
	  rightSideP: "  P |",
		noWallsP: "  P  "
}

const utils = {
	getRandom: function(min, max) { // Generate random number from min to max INCLUSIVE
		let rnd = Math.floor(Math.random() * max+1) + min;
		return rnd
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
		if (parent.x+1 < GridSize && visitedMap[parent.y]  && visitedMap[parent.y][parent.x+1] == 0) {
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
		if (parent.y+1 < GridSize && visitedMap[parent.y+1][parent.x] == 0) {
			children.push({
				x: parent.x,
				y: parent.y+1
			});
			strBuild += "S: "+visitedMap[parent.y+1][parent.x]+", "
		}
		children.find(function (item, i) {
			if(!(item.x < GridSize) || !(item.y < GridSize)){
				throw "Child out of Bounds!"
			}
		});
		return children;
	},
	getRndChild: function(parent) {
		let children = utils.getChildren(parent);
		let rndNum = utils.getRandom(0, children.length-1)
		return children.length == 1 ? children[0] : children[rndNum];
	},
	hasUnvisitedChilds: function (parent) {
		let childs = utils.getChildren(parent);
		if (childs.length > 0) {return true;}
		return false;
	},
	findNodeByID: function (idIn) {
		for (var i = 0; i < TreeList.length; i++) {
			if (TreeList[i].id == idIn) {
				return TreeList[i];
			}
		}
		return null;
	},
	findNodeTreeByCoords: function (coordsIn) {
		for (var i = 0; i < TreeList.length; i++) {
			if (TreeList[i].coords.x == coordsIn.x && TreeList[i].coords.y == coordsIn.y ) {
				return TreeList[i];
			}
		}
		return null;
	},
	hasChildWCoords: function (parent, coordsIn) {
		if(	((coordsIn.x < 0) || (coordsIn.x >= GridSize)) ||
			((coordsIn.y < 0) || (coordsIn.y >= GridSize))){
			return null;
		}else if (parent == null) {
			return null;
		}

		for (var i = 0; i < TreeList.length; i++) {
			if ((TreeList[i].coords.x == coordsIn.x && TreeList[i].coords.y == coordsIn.y) && TreeList[i].parent == parent.id) {
				return TreeList[i];
			}
		}
		return null;
	},
	hasParentWCoords: function(child, coordsIn){
		for (var i = 0; i < TreeList.length; i++) {
			if ((TreeList[i].coords.x == coordsIn.x && TreeList[i].coords.y == coordsIn.y) && TreeList[i].id == child.parent) {
				return TreeList[i];
			}
		}
		return null;
	},
	compareCoords: function (coords1, coords2) {
		if (coords1.x == coords2.x && coords1.y == coords2.y) {
			return true;
		}
		return false;
	}
}
const initCoords = {
	x: utils.getRandom(0, GridSize-1),
	y: utils.getRandom(0, GridSize-1)
}
const exitCoords = {
	x: utils.getRandom(0, GridSize-1),
	y: utils.getRandom(0, GridSize-1)
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
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			if(visitedMap[i][j] == 2){
				strBuild += charset == 0 ? "☼": "░";
			}else if (visitedMap[i][j] == 1) {
				strBuild += charset == 0 ? "▣": "▒";
			}else if (visitedMap[i][j] == 3) {
				strBuild += "@";
			}else{
				strBuild += charset == 0 ? "■": "▓";
			}
		}
		strBuild += "\n";
	}
	console.log(strBuild);


	let stackStrBuild = "";
	for (var i = 0; i < callStack.length; i++) {
		stackStrBuild += callStack[i]+"\n"
	}

	if (allowCallStackDraw) {
		console.log("=====================");
		console.log("CallStack Draw");
		console.log(callStack);
	}

	console.log("=====================");
}

function generateLabrinth(gridSize) {

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
let currCell = initalCell;
while(unvisited){
	if(currCell has unvisited Neighbours){
		let rndNeihbour = some neighbour
		callstack += rndNeihbour
		removedoor between currCell and rndNeihbour
		currCell = rndNeihbour
	}else{
		callstack.splice(length-1, 1)
		currCell = callstack[length]
	}
}
*/
	let idCounter = 1;
	let lastIdCounter = 0;
	let unvisitedNeighbours = true;
	let currCoors = initCoords;
	let canShutdown = false;
	let intervalID;
	let lastRun = false;
	let foundExit = true;
	let lastCoords = currCoors;
	let walkedBack = false;
	let walkedBackD = 0;
	callStack[callStack.length] = initCoords;
	visitedMap[currCoors.y][currCoors.x] = 1;
	TreeList.push({coords: currCoors, forward: true, id: idCounter, parent: null});
	
	intervalID = setInterval(function () { // Use Interval just to change speed of update (Better Drawings!! :D )
		drawLab(GridSize, currCoors);
		if(utils.hasUnvisitedChilds(currCoors)){
			if(!(currCoors.x < GridSize) || !(currCoors.y < GridSize)){
				throw "Child out of Bounds!"
			}
			idCounter++;
			lastIdCounter++;
 			let rndNeighbour = utils.getRndChild(currCoors);
			currCoors = rndNeighbour;
			let lastNode = utils.findNodeTreeByCoords(lastCoords);
			callStack[callStack.length] = rndNeighbour;
			visitedMap[currCoors.y][currCoors.x] = 1;
			TreeList.push({coords: currCoors, forward: true, id: idCounter, parent: lastIdCounter});

			if(walkedBack ==  true){
				lastIdCounter = idCounter-1;
				walkedBack =  false;
			}
		}else{
			walkedBack = true;
			if (currCoors != undefined) {
				visitedMap[callStack[callStack.length-1].y][callStack[callStack.length-1].x] = 2;
				lastIdCounter--;
			}
			callStack.splice(callStack.length-1, 1);
			currCoors = callStack[callStack.length-1];
		}
		lastCoords = currCoors;
		if(lastRun){
			clearInterval(intervalID);
			verifyTree();
			drawLabrinth();
			return;
		}
		if(canShutdown && callStack.length == 0){
			lastRun = true;
		}

		canShutdown = true;
	}, drawWaitTime);
}

function verifyTree() {
	for (var i = 0; i < TreeList.length; i++) {
		for (var j = 0; j < TreeList.length; j++) {
			if (TreeList[i].id == TreeList[j].parent) {
				if(!(TreeList[i].x == TreeList[j].x || TreeList[i].y == TreeList[j].y)){
					throw "Node Tree Invalid!"
				}
			}
		}
	}
}

function drawLabrinth() {
	console.log("Maze Draw\n");
	let strBuild = "";
	//Draw top line
	for (let i = 0; i < GridSize; i++) {
		strBuild += labrinthSectorParts.horonzontal;
	}
	strBuild += "\n"

	for (var lineIDx = 0; lineIDx < GridSize; lineIDx++) { // For each 2 Lines (Cell line and wall line)
		for (var columnIDx = 0; columnIDx < GridSize; columnIDx++) { // For each Column in Cell line
			let node = utils.findNodeTreeByCoords({x: columnIDx, y: lineIDx}); // Get Cell by Coords
			let childToLeft = utils.hasChildWCoords(node, {x: columnIDx-1, y: lineIDx}) != null ? true : false;
			let childToRight = utils.hasChildWCoords(node, {x: columnIDx+1, y: lineIDx}) != null ? true : false;
			let parentToLeft = utils.hasParentWCoords(node, {x: columnIDx-1, y: lineIDx}) != null ? true : false;
			let parentToRight = utils.hasParentWCoords(node, {x: columnIDx+1, y: lineIDx}) != null ? true : false;

			if(utils.compareCoords(node.coords, initCoords)){ // If current node is the Root Node
				if((childToLeft && childToRight) || (parentToLeft && parentToRight) || (parentToLeft && childToRight) || (childToLeft && parentToRight)){
					strBuild += labrinthSectorParts.noWalls;
				} else if (childToLeft || parentToLeft) {
					strBuild += labrinthSectorParts.rightSideR;
				} else if (childToRight || parentToRight) {
					strBuild += labrinthSectorParts.leftSideR;
				} else {
					strBuild += labrinthSectorParts.closedSidesR;
				}
			} else if (utils.compareCoords(node.coords, exitCoords)) { // If corrent node is Destination
				if((childToLeft && childToRight) || (parentToLeft && parentToRight) || (parentToLeft && childToRight) || (childToLeft && parentToRight)){
					strBuild += labrinthSectorParts.noWalls;
				} else if (childToLeft || parentToLeft) {
					strBuild += labrinthSectorParts.rightSideD;
				} else if (childToRight || parentToRight) {
					strBuild += labrinthSectorParts.leftSideD;
				} else {
					strBuild += labrinthSectorParts.closedSidesD;
				}
			} else{ // Not Root Node
				if((childToLeft && childToRight) || (parentToLeft && parentToRight) || (parentToLeft && childToRight) || (childToLeft && parentToRight)){
					strBuild += labrinthSectorParts.noWalls;
				} else if (childToLeft || parentToLeft) {
					strBuild += labrinthSectorParts.rightSide;
				} else if (childToRight || parentToRight) {
					strBuild += labrinthSectorParts.leftSide;
				} else {
					strBuild += labrinthSectorParts.closedSides;
				}
			}
		}
		strBuild += "\n";
		for (var columnIDx = 0; columnIDx < GridSize; columnIDx++) { // For each Column in Wall line
			let node = utils.findNodeTreeByCoords({x: columnIDx, y: lineIDx}); // Get Cell by Coords
			let childOnBottom = utils.hasChildWCoords(node, {x: columnIDx, y: lineIDx+1}) != null ? true : false;
			let parentOnBottom = utils.hasParentWCoords(node, {x: columnIDx, y: lineIDx+1}) != null ? true : false;

			if(childOnBottom || parentOnBottom){
				strBuild += labrinthSectorParts.noWalls;
			} else {
				strBuild += labrinthSectorParts.horonzontal;
			}
		}
		strBuild += "\n";
	}
	console.log(strBuild);
}

function prepareVars(gridSize) {
	for (let i = 0; i < gridSize; i++) {
		visitedMap[i] = [];
		for (let j = 0; j < gridSize; j++) {
			visitedMap[i][j] = 0;
		}
	}
}

function runMaze (gridSize) {
	prepareVars(gridSize);
	generateLabrinth(gridSize);
}
runMaze(GridSize);