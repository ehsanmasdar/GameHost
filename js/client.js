var socket = io();

socket.on('hello', function (data) {
  console.log('hello:', data);
  $('#id').text(function(i, oldText) {
     return data.id;
    });
});

socket.on('gamerecieve', function (data) {
  console.log('gamerecieve:', data);
  GAME.tic.inputMove(data);
});

socket.on('message', function (data) {
    console.log(data);
});

socket.on('connection', function (data) {
  console.log('connection:', data);
  $('#connection').text(function(i, oldText) {
    return "Connected to room "  + data.room.name + " (" + data.room.ID + ") as player " + data.id;
  });
  document.getElementById("canvas").style.visibility="visible"; 
});
$("#join").submit(function(event)
{
  event.preventDefault(); // disable normal form submit behavior
  socket.emit('join', {'name': 'tictactoe', 'players': 2});
  return false; // prevent further bubbling of event
});
