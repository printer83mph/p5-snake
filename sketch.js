function Grid(xPos,yPos,xLen,yLen,blockSize) {
	this.position = new p5.Vector(xPos,yPos);
	this.xLen = xLen;
	this.yLen = yLen;
	this.blockSize = blockSize;
	this.players = [];
	this.playerTrails = [];
	this.pellets = [];
	this.draw = function() {
		stroke(0);
		strokeWeight(2);
		fill(255);
		rect(this.position.x,this.position.y,this.xLen*this.blockSize,this.yLen*this.blockSize)
	}
}

Pellet = function(grid,xPos,yPos) {
	
}

Player = function(grid,xPos,yPos) {
	this.position = createVector(xPos,yPos);
	this.nextStep = createVector(1,0);
	this.move = function() {
		this.position.add(this.nextStep);
	}
	this.draw = function() {
		if(frameCount % 5 === 0) {
			this.move();
			if(this.position.x > grid.xLen-1) {
				this.position.x = 0;
			} else if(this.position.x < 0) {
				this.position.x = grid.xLen-1;
			} else if(this.position.y > grid.yLen-1) {
				this.position.y = 0;
			} else if(this.position.y < 0) {
				this.position.y = grid.yLen-1;
			} 
		}
		noStroke();
		fill(255,0,0);
		rect(grid.position.x + this.position.x * grid.blockSize, grid.position.y + this.position.y * grid.blockSize,grid.blockSize,grid.blockSize);
	}
}

function setup() {
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	smooth();
	game = new Grid(width/2 - 200,height/2 - 200,10,10,40);
	game.start = function() {
		game.players.push(new Player(game,0,0));
	}
	game.start();
}

function draw() {
	background(255);
	game.draw();
	game.players[0].draw();
}

function keyPressed() {
	if(key === "W") {
		game.players[0].nextStep.set(0,-1);
	} if(key === "S") {
		game.players[0].nextStep.set(0,1);
	} if(key === "D") {
		game.players[0].nextStep.set(1,0);
	} if(key === "A") {
		game.players[0].nextStep.set(-1,0);
	} 
}