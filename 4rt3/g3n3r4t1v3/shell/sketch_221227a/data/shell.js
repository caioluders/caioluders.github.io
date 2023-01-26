var p,n;

function setup() {
  createCanvas(windowWidth, windowHeight);
  p = random(0,windowHeight);
  n = random(0,windowWidth/10);
  console.log(p);
  console.log(n);
  background(233,219,206);
  for (var i = 0; i < windowHeight+200; i += 1.5) {
    noFill();
    stroke(110, 113, 146 , i * 5); //shell
    strokeWeight(noise(i)*1.5);
    beginShape();
    vertex(i, 0);
    bezierVertex(n/2, i, n, i, n, p);
    endShape();
  }  
}

