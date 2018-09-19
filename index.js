//Config
const GridSize = 5; //n by n Grid
const drawWaitTime = 50; // Update Wait Timer (in ms)
const allowCallStackDraw = false; // Set to true to Draw the CallStack
const charset = 0; // 0 or 1 (0:  ■ for unvisited, ▣ for Visited, ☼ for returned | 1: ▓ for unvisited, ▒ for Visited, ░ for returned) Symbols used my maze walker

//Statics
let visitedMap = []; // Keep Cache of Visted Cells
let callStack = []; // CallStack itself
let DFSTree = [[]]; // Contains the tree

/*
	DFS Tree Struct

	[{ 
		"id": 0, // Cell ID
		"parent": null, // Cell Parent
		"x": 0000, // Cell x Coordinates
		"y": 0000, // Cell y Coordinates
		"childs": [ ... ] // Cell Children
	},
	...]
*/

const labrinthSectorParts= {
	 horonzontal: " --- ",
	 closedSides: "|   |",
	    leftSide: "|    ",
	   rightSide: "    |",
	     noWalls: "     "
}


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
	findNodeByID: function (nodesIn, idIn) {
		for (var i = 0; i < nodesIn.length; i++) {
			if(nodesIn[i]["id"] == idIn){
				return nodesIn[i];
			}else{
				let foundInChild = utils.findNodeByID(nodesIn[i]["childs"], idIn);
				if(foundInChild){
					return foundInChild;
				}
			}
		}
		return null;
	},
	findNodeTreeByCoords: function (nodesIn, coordsIn) {
		for (var i = 0; i < nodesIn.length; i++) {
			if(nodesIn[i]["x"] == coordsIn.x && nodesIn[i]["y"] == coordsIn.y){
				return nodesIn[i];
			}else{
				let foundInChild = utils.findNodeTreeByCoords(nodesIn[i]["childs"], coordsIn);
				if(foundInChild){
					return foundInChild;
				}
			}
		}
		return null;
	},
	hasChildWCoords: function (parent, coordsIn) {
		if(	((coordsIn.x < 0) || (coordsIn.x >= GridSize)) ||
			((coordsIn.y < 0) || (coordsIn.y >= GridSize))){
			return null;
		}

		for (var i = 0; i < parent["childs"].length; i++) {
			if (parent["childs"][i]["x"] == coordsIn.x && parent["childs"][i]["y"] == coordsIn.y) {
				return parent["childs"][i];
			}
		}
		return null;
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
	for (var i = callStack.length - 1; i >= 0; i--) {
		stackStrBuild += callStack[i]+"\n"
	}

	if (allowCallStackDraw) {
		console.log("=====================");
		console.log("CallStack Draw");
		console.log(callStack);
	}
	
	console.log("=====================");
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
	const exitCoords = {
		x: utils.getRandom(0, gridSize-1),
		y: utils.getRandom(0, gridSize-1)
	}
	let idCounter = 0;
	let lastIdCounter = 0;
	let unvisitedNeighbours = true;
	let currCoors = initCoords;
	let canShutdown = false;
	let intervalID;
	let lastRun = false;
	let foundExit = true;

	
	callStack[callStack.length] = initCoords;
	DFSTree[0][idCounter.toString()] = {
			"id": idCounter,
			"parent": null,
			"x": currCoors.x,
			"y": currCoors.y,
			"childs": []
		}

	intervalID = setInterval(function () { // Use Interval just to change speed of update (Better Drawings!! :D )
		drawLab(gridSize, currCoors);
		//console.log(JSON.stringify(DFSTree[0]))
		if(utils.hasUnvisitedChilds(currCoors)){
			if(!(currCoors.x < gridSize) || !(currCoors.y < gridSize)){
				throw "Child out of Bounds!"
			}
			idCounter++;
			var rndNeighbour = utils.getRndChild(currCoors);
			callStack[callStack.length] = rndNeighbour;
			visitedMap[currCoors.y][currCoors.x] = 1;
			currCoors = rndNeighbour;

			let lastNode = utils.findNodeByID(DFSTree[0], lastIdCounter);
			lastNode["childs"].push({
				"id": idCounter,
				"parent": lastIdCounter,
				"x": currCoors.x,
				"y": currCoors.y,
				"childs": []
			});
			lastIdCounter++;
		}else{
			console.log("Going Back!");
			callStack.splice(callStack.length-1, 1);
			if (currCoors != undefined) {
				visitedMap[currCoors.y][currCoors.x] = 2;
			}

			if (currCoors == exitCoords) {
				currCoors = undefined;
				console.log("Found Exit!");
				clearInterval(intervalID);

				prettyDraw(gridSize, currCoors);
				return;
			}else{
				currCoors = callStack[callStack.length-1];
			}
			lastIdCounter--;
		}
		if (currCoors != undefined) {
			visitedMap[currCoors.y][currCoors.x] = 3;
		}

		if(lastRun){
			clearInterval(intervalID);
			prettyDraw(gridSize, currCoors);
			return;
		}
		if(canShutdown && callStack.length == 0){
			lastRun = true;
		}

		canShutdown = true;


		console.log("Pretty Draw\n");
	}, drawWaitTime);
}

function prettyDraw(gridSize, currCoors) {
	let strBuild = "";
	for (var i = 0; i < gridSize; i++) {
		for (var j = 0; j < gridSize; j++) {
			strBuild += labrinthSectorParts.horonzontal;
		}
		strBuild += "\n"
		if(false){
			for (var j = 0; j < gridSize; j++) {
				//strBuild += labrinthSectorParts.horonzontal;
			}
			strBuild += "\n"
		}else{
			for (var j = 0; j < gridSize; j++) {
				var node = utils.findNodeTreeByCoords(DFSTree[0], {x: j, y: i});
				var hasChildBehind = utils.hasChildWCoords(node, {x: j-1, y: i});

				var hasChildForward = utils.hasChildWCoords(node, {x: j+1, y: i});
				hasChildForward = hasChildForward == undefined ? null : hasChildForward; // Change from undefined too null
				var tempPB = utils.findNodeByID(DFSTree[0], node["parent"]);
				var hasParentBehind = null;
				if (tempPB != null && tempPB["x"] == j-1 && tempPB["y"] == i) {
					hasParentBehind = tempPB
				}
				var tempPF = utils.findNodeByID(DFSTree[0], node["parent"]);
				var hasParentForward = null;
				if (tempPF != null && tempPF["x"] == j+1 && tempPB["y"] == i) {
					hasParentForward = tempPF
				}

				if(hasChildBehind != null && hasChildForward != null || hasParentBehind != null && hasParentForward != null ){
					strBuild += labrinthSectorParts.noWalls;
				}else if(hasChildBehind != null || hasParentBehind != null){
					strBuild += labrinthSectorParts.rightSide;
				}else if(hasChildForward != null || hasParentForward != null){
					strBuild += labrinthSectorParts.leftSide;
				}else{
					strBuild += labrinthSectorParts.closedSides
				}
			}
			strBuild += "\n";
		}
	}
	for (var j = 0; j < gridSize; j++) {
			strBuild += labrinthSectorParts.horonzontal;
		}
		strBuild += "\n"
	console.log(strBuild);
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