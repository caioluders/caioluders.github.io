void setup() {
  size(1200, 675);
  noSmooth();
  background(0);
  //colorMode(RGB, 360, 100, 100, 100);
}

void draw() {
  background(240, 80, 5); // Deep blue background
  
  // Create a subtle nebula effect
  loadPixels();
  for (int i = 0; i < width * height; i++) {
    float n = noise(i * 0.001, frameCount ) * 100;
    pixels[i] = color(280 + n, 70, 20, 20);
  }
  updatePixels();
  
  int f = frameCount % width;
  
  translate(width/2, height/2);
  
  // Main spiral pattern
  for (int n = 0; n < width/2; n += 2) {
    for (int i = 0; i < 360; i += 3) {
      float spiralNoise = noise(i * 0.01, n * 0.005, f * 0.01);
      float xx = sin(radians(i + spiralNoise * 180 + f * 0.1)) * n;
      float yy = cos(radians(i + n * 0.2)) * n;
      
      
      // Varying point size for depth effect
      float pointSize = map(noise(frameCount * 0.01, yy * 0.01), 0, 1, 1, 3);
      strokeWeight(pointSize);
      
      point(xx * 0.8, yy * 0.5);
    }
  }
  
}

void mousePressed() {
  // Save the frame when mouse is pressed
  saveFrame("space-art-####.jpg");
}
