void setup() {
  //size(1024,1024) ;
  fullScreen();
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
      float xx = sin(radians(f+random(0,0.5)+noise(i)*(500)))*n;
      float yy = cos(radians(i+n))*n;
      //stroke(map(i,0,300,0,255));
      point(xx,yy/2);
    } 
  }
  
}
