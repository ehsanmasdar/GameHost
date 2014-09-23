function grid(rows, columns){
  this.edge_length = 50;
  this.edge_width = 13;
  this.grid;
  this.make_grid(rows, columns);
}
grid.prototype.make_grid = function(rows,columns) {
  this.grid = new Array(columns);
  for (var x = this.grid.length - 1; x >= 0; x--) {
    this.grid[x] = new Array(rows)
    for (var y = this.grid[x].length - 1; y >= 0; y--) {
      this.grid[x][y] = [false,false,false,false,false]
    };
  };  
};

grid.prototype.draw = function() {
 for (var x = this.grid.length-1; x >= 0; x--) {
    for (var y = this.grid[x].length-1; y >= 0; y--) {
      if (x<this.grid.length-1&&y<this.grid.length) {
        GAME.ctx.fillStyle = ((this.grid[x][y][0])?"black":"grey")
        GAME.ctx.fillRect(10+x*this.edge_length,10+y*this.edge_length- this.edge_width/2,this.edge_length, this.edge_width)//horizontal
      };
      if (x<this.grid.length&&y<this.grid.length-1) {
        GAME.ctx.fillStyle = ((this.grid[x][y][3])?"black":"grey")
        GAME.ctx.fillRect(10+x*this.edge_length- this.edge_width/2,10+y*this.edge_length, this.edge_width,this.edge_length)//vertical
      };

    };
  };  
 for (var x = this.grid.length-1; x >= 0; x--) {
    for (var y = this.grid[x].length-1; y >= 0; y--) {
      GAME.ctx.fillStyle = ((this.grid[x][y][3]||this.grid[x][y][0]||((y-1>=0)?this.grid[x][y-1][3]:false)||((x-1>=0)?this.grid[x-1][y][0]:false))?"black":"grey")
      GAME.ctx.fillRect(10+x*this.edge_length- this.edge_width/2,10+y*this.edge_length- this.edge_width/2,this.edge_width,this.edge_width)
    }
  }
  for (var x = this.grid.length-1; x >= 0; x--) {
    for (var y = this.grid[x].length-1; y >= 0; y--) {
      if (this.grid[x][y][4]!=false) {

        var colors = ["red","blue","green","purple","yellow"]
        GAME.ctx.fillStyle = colors[this.grid[x][y][4]];
        GAME.ctx.fillRect(10+x*this.edge_length + this.edge_width/2-1,10+y*this.edge_length + this.edge_width/2-1,this.edge_length+1-this.edge_width,this.edge_length+1-this.edge_width)
      };
    }
  }
};

grid.prototype.closed_square = function(){
   for (var x = this.grid.length-1; x >= 0; x--) {
    for (var y = this.grid[x].length-1; y >= 0; y--) {
      if ("" + this.grid[x][y][4]=='false' && this.grid[x][y][0]&&this.grid[x][y][1]&&this.grid[x][y][2]&&this.grid[x][y][3]) {
        
        this.grid[x][y][4] = GAME.turn;
        console.log(this.grid[x][y][4])
      };
    }
  }
}

grid.prototype.act = function(){
  this.draw();
}