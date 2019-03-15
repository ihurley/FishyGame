var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('fish1', 'assets/badfish.png');
  this.load.image('fish2', 'assets/badfish copy.png');
  this.load.image('youfish', 'assets/fish.png');
}

function create() {
  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });



  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });


  this.cursors = this.input.keyboard.createCursorKeys();

      



function addPlayer(self, playerInfo) {
  self.fish1 = self.physics.add.image(playerInfo.x, playerInfo.y, 'fish1').setOrigin(0.5, 0.5).setDisplaySize(10, 10);
  self.fish1.setDrag(100);
  self.fish1.setDrag(100);
  self.fish1.setMaxVelocity(200);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.fish2(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(10, 10);
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);

  self.physics.add.overlap(self.fish1, otherPlayer, function () {
if (self.fish1.score > otherPlayer.score){
  self.fish1.score += otherPlayer.score;
 this.socket.emit('fishEaten', otherPlayer.playerId);

}
else { otherPlayer.score += self.fish1.score;
   this.socket.emit('fishEaten', self.fish1.playerId);
}}, null, self);



function update() {
  //move all your other ai fish
  if (this.fish1) {
    if (this.cursors.left.isDown) {
      this.fish1.setVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.fish1.setVelocity(150);
    } else {
      this.fish1.setVelocity(0);
    }
  
    if (this.cursors.up.isDown) {
      this.fish1.setAcceleration(0);
    }
  
    this.physics.world.wrap(this.fish1, 5);

    // emit player movement
    var x = this.fish1.x;
    var y = this.fish1.y;
    if (this.fish1.oldPosition && (x !== this.fish1.oldPosition.x || y !== this.fish1.oldPosition.y || r !== this.fish1.oldPosition.rotation)) {
      this.socket.emit('playerMovement', { x: this.fish1.x, y: this.fish1.y});
    }
    // save old position data
    this.fish1.oldPosition = {
      x: this.fish1.x,
      y: this.fish1.y,

    }}









