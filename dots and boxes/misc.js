function onMousedown(e){
  var pos = getMousePos(canvas, e);
  var x = Math.floor((pos.x - 10)/GAME.grid.edge_length);
  var y = Math.floor((pos.y - 10)/GAME.grid.edge_length);
  if(pos.y<10+GAME.grid.edge_length*y+GAME.grid.edge_width&&GAME.grid.grid[x][y][0]==false){
      GAME.grid.grid[x][y][0] = true
      GAME.grid.grid[x][y-1][2] = true
      GAME.turn=(GAME.turn+1)%GAME.players.length +1
  }   
  else if(pos.x<10+GAME.grid.edge_length*x+GAME.grid.edge_width&&GAME.grid.grid[x][y][3]==false){
      GAME.grid.grid[x][y][3] = true
      GAME.grid.grid[x-1][y][1] = true
      GAME.turn=(GAME.turn+1)%GAME.players.length +1
  }   

  GAME.grid.closed_square();
  console.log(GAME.turn)
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
    
/*
function onMousemove(e){
  var pos = getMousePos(canvas, e);
  //console.log(GAME.boids.length)
    for (var i = GAME.ui.buttons.length - 1; i >= 0; i--) {
      if (GAME.ui.buttons[i].isClicked(pos.x,pos.y)) {
        GAME.ui.buttons[i].fillStyle = "rgb(80,80,80)";
      }
      else
        GAME.ui.buttons[i].fillStyle = "rgb(50,50,50)";
    };
  

}
*/