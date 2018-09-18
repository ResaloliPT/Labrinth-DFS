

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "K", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"] // User to Top Coordinates

let mazeDraw = [];

let utils = {
	getSectorType: function (type) {
		for (let i = 0; i < labrinthSectorsTypes.length; i++) {
			if (labrinthSectorsTypes[i].type == type) {
				return labrinthSectorsTypes[i].walls;
			}
		}
	}
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
		if (i == 0) {
			sides += labrinthSectorParts.leftSide + "|   "
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
}
drawAll(GridSize);