// GAME OF LIFE
int columns = 1024; // width of the gameboard
int rows = 1024; //height of the gameboard
int tile_size = 1; // size of the tiles
int tick = 1;
int tick_time = 1;
int[][] gameboard = new int[columns][rows];
int[][] next = new int[columns][rows];

void setup(){
  size(1024,1024);
  
  // Initialize the game board
  for (int x = 0; x < columns; x++){
    for (int y =0; y < rows; y++){
      if ( random(x*2<<y) > 300) {
        gameboard[x][y] = 1;
      } else {
        gameboard[x][y] = 0;
      }
      
      next[x][y] = gameboard[x][y];
    }
  }
  DrawBoard();
}
void draw(){
    TakeStep();
    DrawBoard();
}
void TakeStep(){
  // loop through the board in it's current state
  for (int y = 0; y < rows; y++){
    for (int x = 0; x < columns; x++){
      
      int n = CheckNeighbors(x,y);
      //print(n, " ");
      // if cell is alive
      if (gameboard[x][y] == 1){
        // if over or under populated, kill it
        if (n > 2 || n < 1){
          next[x][y] = 0;
        }
      }
      else if(gameboard[x][y] == 0){
        if (n < 3){
          next[x][y] = 1;
        }
      }
      else{
        next[x][y] = gameboard[x][y];
      }
    }
  }
  
  gameboard = next;
}

int CheckNeighbors(int x, int y) {
  int neighbors = 0;
  // loop through the 9possible neighbors 
  for (int i = -1; i < 2; i++){
    for (int j = -1; j < 2; j++){
      if (x + i < 0 || x + i > columns-1 || y + j < 0 || y + j > rows-1){
       // outside the bounds of the map. do nothing 
      }
      else if (i == 0 && j == 0){
        // don't count ourselves
      }
          
      else if (gameboard[x+i][y+j] == 1){
        neighbors++;
      }
    }
  }
    
  return neighbors;
}
void DrawBoard(){
  for (int i = 0; i < columns; i++){
    for (int j = 0; j < rows; j++){
      if (gameboard[i][j] == 1) fill(random(255),random(255),random(255));
      else fill(0);
      noStroke();
      rect(i*tile_size, j*tile_size, tile_size, tile_size);
    }
  }
}

void mouseClicked() {
  saveFrame() ;
}
