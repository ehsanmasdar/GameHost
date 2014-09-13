function onMousedown(e){
  var pos = getMousePos(canvas, e);
  for (var i = GAME.tic.gameBoard.length - 1; i >= 0; i--) {
    for (var z = GAME.tic.gameBoard[i].length - 1; z >= 0; z--) {
       if(z*100+10<pos.x && z*100+110>pos.x && i*100+10<pos.y && i*100+110>pos.y){
          var move = {playerID:0,row:i,column:z};

            socket.emit("gamesend", move);

       } 
     }; 
  };
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function onMousemove(e){
  var pos = getMousePos(canvas, e);
  //console.log(GAME.boids.length)
 

}
