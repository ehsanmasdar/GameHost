var socket = io();

socket.on('hello', function (data) {
  console.log('hello:', data);
  $('#id').text(function(i, oldText) {
     return data.id;
    });
});

socket.on('gamerecieve', function (data) {
  console.log('gamerecieve:', data);
});

socket.on('connection', function (data) {
  console.log('connection:', data);
  $('#connection').text(function(i, oldText) {
    return "Connected to room  "  + data.id;
  });
});
$("#join").submit(function(event)
{
  event.preventDefault(); // disable normal form submit behavior
  socket.emit('join');
  return false; // prevent further bubbling of event
});