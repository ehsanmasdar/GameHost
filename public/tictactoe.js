function tictactoe(playerIDs){
  this.gameBoard = new Array(3);
  this.player = playerIDs;
  for (var i = this.gameBoard.length - 1; i >= 0; i--) {
    this.gameBoard[i] = new Array(3)
    for (var z = this.gameBoard[i].length - 1; z >= 0; z--) {
      this.gameBoard[i][z] = 0;
    };
  };
  this.inputMove = function(input){
    if(this.isMoveValid(input)&&this.player[0]==input.playerID||this.player[1]==input.playerID){
      console.log(this.player[0] + " " + input.playerID)
      var toke = ((this.player[0]==input.playerID)?"#44accf":"#ee3e64")
      this.gameBoard[input.row][input.column]=toke;
      return true;
    }
    else{
      return false;
    }
  }
  this.isMoveValid = function(input){
    
    if (this.gameBoard[input.row][input.column]==0) {
      return true;
    } else { 
      return false;
    }
  }

  this.hasWin = function(){
    var g = this.gameBoard;
     for (var i = 2; i >= 0; i--) {
       if (g[i][0]==g[i][1] && g[i][1]==g[i][2] && g[i][0]==g[i][2]) {
          return g[i][0];
       };
     };
     for (var i = 2; i >= 0; i--) {
       if (g[0][i]==g[1][i] && g[1][i]==g[2][i] && g[0][i]==g[2][i]) {
          return g[0][i];
       };
     };
     if (g[0][0]==g[1][1] && g[1][1]==g[2][2] && g[0][0]==g[2][2]) {
      return g[0][0];
     };

  }
  this.draw = function(){
    for (var i = this.gameBoard.length - 1; i >= 0; i--) {
     for (var z = this.gameBoard[i].length - 1; z >= 0; z--) {
        GAME.ctx.fillStyle = ((this.gameBoard[i][z]==0)?"#E0E0E0":this.gameBoard[i][z] )
        GAME.ctx.fillRect(10+z*110,10+i*110,100,100)
      }; 
    };
  }

  this.act = function(){
    this.draw();
  }
}