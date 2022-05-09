void setup() {
  size(1024,1024) ;
  //fullScreen();
  noSmooth();
  background(0);
  stroke(255);
}                                                                 

void draw() {
  background(0);
  
  int f = frameCount%width;
  
  translate(width/2,height/2);
  
  for( int n = 0 ; n < width ; n++) {
    for( int i = 0 ; i < 360 ; i+= 8 ) {      
      float xx = sin(radians((i^(128))+n+noise(n+f)*20))*n;
      float yy = cos(radians(i+n))*n;
      if (i>300) { 
        strokeWeight(random(0.1,4));
      } else {
        strokeWeight(random(0.1,1));
      }
      point(xx,yy/2);
    } 
  }
  
}
