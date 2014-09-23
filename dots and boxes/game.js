var GAME;

window.onload = function(){

  var canvas = document.getElementById("canvas")

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

 window.addEventListener("mousedown", onMousedown, false);
//  window.addEventListener("mousemove", onMousemove, false);

  GAME = new game_core(canvas);

  act();
}

function game_core(canvas){   
  this.grid = new grid(4,4)
  this.ctx = ((canvas.getContext)?canvas.getContext("2d"):undefined)
  this.players = [0,1]
  this.turn = 0;
}

function act(){
  GAME.ctx.clearRect(0,0,1000,1000)
  GAME.grid.act();
  requestAnimFrame(act);
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();