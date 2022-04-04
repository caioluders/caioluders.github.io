int pressed = 0 ;

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
      float xx = sin(radians(f+noise(n+i+(i+n^127))*1000))*n;
      float yy = cos(radians(i+n+f+f))*n;
      //stroke(map(i,0,300,0,255));
      if (n>350) { 
        strokeWeight(random(0.1,3));
      } else {
        strokeWeight(random(0.1,1));
      }
      point(xx,yy);
    } 
  }
  
}

void keyPressed() {
  if (key == 'a') {
    pressed += 1 ;
  }
}
