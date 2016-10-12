var gameState = 0;

function Grid(xPos,yPos,xLen,yLen,blockSize) {
	this.position = new p5.Vector(xPos,yPos);
	this.xLen = xLen;
	this.yLen = yLen;
	this.blockSize = blockSize;
	this.players = [];
	this.tailParts = [];
	this.pellets = [];
	this.draw = function() {
		stroke(0);
		strokeWeight(2);
		fill(0);
		rect(this.position.x,this.position.y,this.xLen*this.blockSize,this.yLen*this.blockSize)
	}
}

TailPart = function(grid,ply,xPos,yPos) {
	this.position = createVector(xPos,yPos);
	this.player = ply;
	this.initialStep = ply.stepCount;
	this.color = [200,100,0];
	this.draw = function() {
	  fill(this.color[0],this.color[1],this.color[2]);
	  noStroke();
	  rect(grid.position.x + (this.position.x*grid.blockSize), grid.position.y + (this.position.y*grid.blockSize), grid.blockSize, grid.blockSize);
	}
	this.isDone = function() {
    if(ply.stepCount - this.initialStep > ply.tailLength) {
      return true;
    } else {
      return false;
    }
  }
}

Player = function(grid,xPos,yPos) {
	this.position = createVector(xPos,yPos);
	this.nextStep = createVector(1,0);
	this.lastStep = createVector(1,0);
	this.stepCount = 0;
	this.tailLength = 20;
	this.headColor = [255,0,0];
	this.tailColor = [200,100,0];
	this.alive = true;
	this.move = function() {
	  grid.tailParts.push(new TailPart(grid,this,this.position.x,this.position.y));
	  grid.tailParts[grid.tailParts.length-1].color = this.tailColor;
		if((this.nextStep.x * -1 === this.lastStep.x) && (this.nextStep.y * -1 === this.lastStep.y)) {
			this.nextStep.mult(-1);
		}
		this.position.add(this.nextStep);
		this.lastStep.set(this.nextStep);
		this.stepCount ++;
		var tp = grid.tailParts.length;
		while(tp--) {
		  if(grid.tailParts[tp].isDone()) {
		    grid.tailParts.splice(tp,1);
		  }
		}
	}
	this.draw = function() {
		if((frameCount - game.startFrame) % 5 === 0) {
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
		fill(this.headColor[0],this.headColor[1],this.headColor[2]);
		rect(grid.position.x + this.position.x * grid.blockSize, grid.position.y + this.position.y * grid.blockSize,grid.blockSize,grid.blockSize);
	}
}

function setup() {
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	smooth();
	game = new Grid(0,0,40,40,20);
	game.start = function() {
	  gameState = 0;
	  game.tailParts = [];
	  game.players = [];
		game.startFrame = frameCount;
		game.players.push(new Player(game,0,13));
		game.players[0].headColor = [0,0,255];
		game.players[0].tailColor = [0,100,255];
		game.players.push(new Player(game,0,27));
		game.players[1].headColor = [255,0,0];
		game.players[1].tailColor = [255,100,0];
	}
	game.start();
}

function draw() {
	background(255,0);
	game.draw();
	var ply = game.players.length;
	while(ply--) {
		if(game.players[ply].alive) {
			game.players[ply].draw();
		}
	}
	if((frameCount - game.startFrame) % 5 === 0) {
  	if((frameCount - game.startFrame) % 100 === 0) {
			var ply = game.players.length;
  	  while(ply--) {
    	  game.players[ply].tailLength += 2;
  	  }
		}
		var tp = game.tailParts.length;
  	while(tp--) {
  	  var ply = game.players.length;
  	  while(ply--) {
    	  if(game.tailParts[tp].position.x == game.players[ply].position.x && game.tailParts[tp].position.y == game.players[ply].position.y) {
    	    game.players[ply].alive = false;
    	  }
  	  }
  	}
	}
	var tp = game.tailParts.length;
	while(tp--) {
    game.tailParts[tp].draw();
	}
}

function keyPressed() {
	if(game.players[0].alive) {
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
	if(game.players[1].alive) {
		if(keyCode === UP_ARROW) {
			game.players[1].nextStep.set(0,-1);
		} if(keyCode === DOWN_ARROW) {
			game.players[1].nextStep.set(0,1);
		} if(keyCode === RIGHT_ARROW) {
			game.players[1].nextStep.set(1,0);
		} if(keyCode === LEFT_ARROW) {
			game.players[1].nextStep.set(-1,0);
		}
	}
	if(keyCode === RETURN) {
	  game.start();
	}
}