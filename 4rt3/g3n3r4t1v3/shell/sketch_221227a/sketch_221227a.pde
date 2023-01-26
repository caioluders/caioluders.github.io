import processing.svg.*;

void setup() {
  size(1000,1000);
  float p = random(0,500);
  float n = random(0,500/10);
  background(255);
  beginRecord(SVG,"shell.svg");
  for (var i = 0; i < 500+200; i += 1.5) {
    noFill();
    stroke(110, 113, 146 , i * 5); //shell
    strokeWeight(noise(i)*1.5);
    beginShape();
    vertex(i, 0);
    bezierVertex(n/2, i, n, i, n, p);
    endShape();
  }
  endRecord();
}
