var r, a;
var waves = [];
var yp = -200;

function setup() {
	createCanvas(windowWidth, windowHeight); 
	r = random(0,windowWidth) ;
	a = random(100,windowHeight);
}

function draw() {
   
	background(233,219,206);//sand
  
	for ( var i = 0 ; i < waves.length ; i++) {
		stroke(200,216,191);
		noFill();
		bezier(waves[i][0],waves[i][1],waves[i][2],waves[i][3],waves[i][4],waves[i][5],waves[i][6],waves[i][7]);
	}
  
	frameCount += 1;
	fill(153,170,182,a-(frameCount%windowHeight)); //water
	noStroke();
	beginShape();
	if ( a-(frameCount%windowHeight) < 30 ) {
		waves.push([yp,yp+frameCount%windowHeight,yp+r,yp+frameCount%windowHeight, r/3, yp+(frameCount%windowHeight)+300, windowWidth, yp+frameCount%windowHeight]);  
		r = random(0,windowWidth) ;
		frameCount = 0;
		a = random(100,windowHeight);
	}
	vertex(yp,yp+frameCount%windowHeight);
	rect(0,yp,windowWidth,(frameCount%windowHeight));
	bezierVertex(yp+r,yp+frameCount%windowHeight, r/3, yp+(frameCount%windowHeight)+300, windowWidth, yp+frameCount%windowHeight);
 	endShape();
}

