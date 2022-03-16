void setup(){
  size(1080,1080);
  noSmooth();
  background(0);
  stroke(255);
  strokeWeight(2);
}

void draw(){
  background(0);
  int f = frameCount%width;
  translate(width/2,height/2);
  
  for ( int n = 0 ; n < width ; n++ ) {
    for ( int i = 0 ; i < 360 ; i+=12 ) {
      stroke(map(i,0,300,0,255));
      float x = sin(radians(i + noise(n+f)*100+n))*n ;
      float y = cos(radians(i+n))*n;
      point(x,y);
    }
  
  }
  saveFrame()
}
