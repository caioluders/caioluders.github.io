int crc = 0;
int[] firstPixels;

void exitIfLoop() {
  if ( frameCount == 1 ) {
    loadPixels();
    firstPixels = pixels;
  } else {
    loadPixels();
    if ( pixels == firstPixels ) {
      exit();
    }
  }
}

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
      //stroke(map(i,0,300,0,255));
      float xx = sin(radians(noise(n+frameCount)*(500)))*n;
      float yy = cos(radians(i+n))*n;
      point(xx,yy/2);
      t += xx + yy ;
      
    } 
  }
  
  saveFrame();
  println(f);
  if (f == 1 && crc == 1) {
    exit();
  }
  
  crc = 1;
  
  
}
