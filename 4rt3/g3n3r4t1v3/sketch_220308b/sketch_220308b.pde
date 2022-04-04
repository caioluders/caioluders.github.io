void setup() {
  size(1024,1024) ;
  noSmooth();
  background(0);
  stroke(255);
}                                                                 

void draw() {
  background(0);
  
  int f = frameCount%width;
  
  translate(width/2,height/2);
  
  for( int n = 0 ; n < width ; n++) {
    for( int i = 0 ; i < 360 ; i+= 4 ) {      
      float xx = sin(radians(i+noise(i+n+frameCount)*(400)+n))*n;
      float yy = cos(radians(i+n))*i*3;
      //stroke(map(i,0,300,0,255));
      point(xx,yy/2);
    } 
  }
  
}
