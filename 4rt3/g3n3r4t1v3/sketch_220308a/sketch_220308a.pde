void setup() {
  size(1024,1024) ;
  noSmooth();
  background(0);
  stroke(255);
}                                                                 

void draw() {
  background(0);
  
  int f = frameCount%(width/4);
  
  translate(width/2,height/2);
  float t = 0;
  for( int n = 0 ; n < width ; n++) {
    for( int i = 0 ; i < 360 ; i+= 12 ) {
      float xx = sin(radians(noise(n-frameCount)*n+i))*n;
      float yy = cos(radians(i+n))*n;
      point(xx,yy/2);
      t += xx + yy ;
      
    } 
  }
  
  
}
