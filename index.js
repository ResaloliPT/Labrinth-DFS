//Config
const GridSize = 10;

//Statics
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "K", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"]

let callStack;

let mazeDraw = [];







/*
Types:
1 = Node
2 = Leaf

Directions:
0 = None
1 = down
2 = top
3 = left
4 = right
*/

const LabrinthRecur = {
	"type": 1, // Root Here
	"dir": 0, // Cord
	"visited": 0, // if cell was visited
	"children": [
		{
			"type": 1,
			"dir": 4,
			"visited": 0, // if cell was visited
			"children": [
				{
					"type": 1,
					"dir": 1,
					"visited": 0, // if cell was visited
					"children": [
						{
							"type": 1,
							"dir": 1,
							"visited": 0, // if cell was visited
							"children": [
								{
									"type": 1,
									"dir": 4,
									"visited": 0, // if cell was visited
									"children": [

									]
								}
							]
						}
					]
				}
			]
		}
	]
}



const labrinthSectorParts= {
	topLines: " ---",
	DownLines: " ---",
	closedSides: "|   |",
	leftSide: "|   ",
	lastWall: "|",
	root: "| R ",
	destination: "",
	arrowTop: "| ↑ ",
	arrowDown: "| ↓ ",
	arrowLeft: "| → ",
	arrowRight: "| ← "

};

const labrinthSectorsTypes = [
	{
		type: 1, // Aberto Esquerda
		walls: {
			top: labrinthSectorParts.topLines,
			Down: labrinthSectorParts.DownLines,
			sides: "    "
		}
	},
	{
		type: 2, // Aberto Direita
		walls: {
			top: labrinthSectorParts.topLines,
			Down: labrinthSectorParts.DownLines,
			sides: labrinthSectorParts.leftSide
		}

	},
	{
		type: 3, // Aberto Cima
		walls: {
			top: "    ",
			Down: labrinthSectorParts.DownLines,
			sides: labrinthSectorParts.leftSide
		}

	},
	{
		type: 4, // Aberto Baixo
		walls: {
			top: labrinthSectorParts.topLines,
			Down: "    ",
			sides: labrinthSectorParts.leftSide
		}

	},
	{
		type: 5, // Aberto Lados
		walls: {
			top: labrinthSectorParts.topLines,
			Down: labrinthSectorParts.DownLines,
			sides: "    "
		}

	},
	{
		type: 6, // Aberto cima-esquerda
		walls: {
			top: "    ",
			Down: labrinthSectorParts.DownLines,
			sides: "   |"
		}

	},
	{
		type: 7, // Aberto baixo-direita
		walls: {
			top: labrinthSectorParts.topLines,
			Down: "    ",
			sides: "   |"
		}

	},
	{
		type: 8, // Aberto lados-baixo
		walls: {
			top: labrinthSectorParts.topLines,
			Down: "    ",
			sides: "~~~~"
		}

	},
	{
		type: 9, // Root
		walls: {
			top: labrinthSectorParts.topLines,
			Down: labrinthSectorParts.DownLines,
			sides: labrinthSectorParts.root
		}

	},
	{
		type: 10, // Destination
		walls: {
			top: labrinthSectorParts.topLines,
			Down: "    ",
			sides: labrinthSectorParts.root
		}

	},
];

const utils = {
	getSectorType: function (type) {
		for (let i = 0; i < labrinthSectorsTypes.length; i++) {
			if (labrinthSectorsTypes[i].type == type) {
				return labrinthSectorsTypes[i].walls;
			}
		}
	},
	getRandom: function(min, max) {
		return Math.floor(Math.random() * max) + min;
	},
	getChildren: function (parent) {
		let children = [];
		if (parent.x-1 >= 1) {
			children.push({
				x: parent.x-1,
				y: parent.y
			});
		}
		if (parent.x+1 <= GridSize) {
			children.push({
				x: parent.x+1,
				y: parent.y
			});
		}
		if (parent.y-1 >= 1) {
			children.push({
				x: parent.x,
				y: parent.y-1
			});
		}
		if (parent.y+1 <= GridSize) {
			children.push({
				x: parent.x,
				y: parent.y+1
			});
		}
		return children;
	},
	getRndChild: function(children) {
		return getRandom(0, children.length-1);
	}
}

function drawGrid(gridSize) {
	let topDown = "";
	let sides = "";
	let letters = "";
	for (let i = 0; i < gridSize; i++) {
		topDown += labrinthSectorParts.topLines
	}
	topDown = "    " + topDown;
	for (let i = 0; i < gridSize; i++) {
		if (i == (gridSize-1)) {
			sides += labrinthSectorParts.leftSide + "|   |"
		}else if (i == 0) {
			//sides +=  labrinthSectorParts.leftSide + "|"
		} else {
			sides += labrinthSectorParts.leftSide
		}
		letters += "  " + alphabet[i] + " ";
	}

	letters = "    " + letters;
	console.log(letters); // Draw Top Letters
	console.log(topDown); // Draw Top Wall
	for (let i = 0; i < gridSize; i++) {
		if (i >= 9) {
			console.log((" " + (i+1) + " ") + sides); // Draw Sector Side Walls
		}else{
			console.log((" " + (i+1) + "  ") + sides); // Draw Sector Side Walls
		}
		console.log(topDown); // Draw Walls inBetween Sectors
	}
}

function drawLabrinth(gridSize) {
	const initCoords = {
		x: utils.getRandom(1, gridSize),
		y: utils.getRandom(1, gridSize)
	}

	console.log("Starting Point:", "Y:", "("+initCoords.y+")", "X:", "("+alphabet[initCoords.x-1]+")\n");

	let mazeGenerated = false;
	let counter = 0;
	while (!mazeGenerated) {
		let children = utils.getChildren(initCoords);
		let parent = counter == 0 ? undefined : counter-1;

		mazeDraw.push({
			id: counter,
			parent: parent,
			children: children
		});


		for (var i = 0; i < children.length; i++) {
			console.log("Child Point:", "Y:", "("+children[i].y+")", "X:", "("+alphabet[children[i].x-1]+")\n");
		}


		counter++;
		mazeGenerated = true;
	}


}


function drawAll(gridSize) {
	if (gridSize > alphabet.length) {
		console.log("Grid Size to Big max is ", alphabet.length);
		return;
	}
	console.log("======== Drawing Basic Grid ========\n");
	drawGrid(gridSize);
	console.log("\n======== Basic Grid Labrinth ========\n");
	console.log("R = Root");
	console.log("E = Exit\n")
	drawLabrinth(gridSize);
}
drawAll(GridSize); // Draw Grid 6 by 6
