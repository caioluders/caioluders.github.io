int pressed = 1 ;
int efe = 2 ;
int rvers = 1 ;

int vaievolta(int w) {
  if (w%60==0||efe<=1) {
    rvers = rvers*-1;
  } 
  efe = efe+rvers ;
  return efe;
}

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
  
  int cc = vaievolta(frameCount);
  
  for( int n = 0 ; n < width ; n++) {
    for( int i = 0 ; i < 360 ; i+= 8 ) {      
      float xx = sin(radians(cc+i+n<<cc%8)*128)*n;
      float yy = cos(radians(i>>n/(cc)))*n;
      //stroke(map(i,0,300,0,255));
      if (n>300) { 
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
