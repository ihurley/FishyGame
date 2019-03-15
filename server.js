var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var players = {};
var fishes = {};
var numPlayers = 0;

for (var i =0; i<10; i++){
    fishes[i] = {
    direction: (Math.floor(Math.random() * 2) == 0) ? 'left' : 'right',
    height: Math.floor(Math.random() * 700) + 50,
    speed: (Math.random()*50), //
    size: Math.floor(Math.random() * 700) + 50,
    playerId: "ai"+i

}}


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  numPlayers = numPlayers+1;
  // create a new player and add it to our players object
  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    score: Math.random()*100
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // send the current scores
  //socket.emit('scoreUpdate', scores);
  console.log(fishes)
  socket.emit('fishLocation', fishes);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);

  });
  //disconnect a player if they run into another bigger player


  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('fishEaten', function (eatenID) {
if (!(eatenID.substring(0,2).equals("ai"))){
  io.emit('disconnect', eatenID);
    socket.emit('currentPlayers', players);
}
else fishes.delete([eatenID.substring(3)]);
    });

  });


server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
