var game = new Phaser.Game(900, 900, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
var cursors;
var player;
var travelDist = 53.5;
var movementInput = "";
var time = 0;
var timeText;
var inputText;
var msgText;
var maxTime = 0;
var socket;
function preload() {
    // add our logo image to the assets class under the
    // key 'logo'. We're also setting the background colour
    // so it's the same as the background colour in the image
    game.stage.backgroundColor = 0xffffff;
    this.game.load.image('grid', "Graphics/2151465-grid.jpg");
    this.game.load.image('player', "Graphics/greendude.png");
    cursors = this.game.input.keyboard.createCursorKeys();
    window.setInterval(submitMove, 3000);
    window.setInterval(updateTimer, 300);
    socket = io();
}
function create() {
    // add the 'logo' sprite to the game, position it in the
    // center of the screen, and set the anchor to the center of
    // the image so it's centered properly. There's a lot of
    // centering in that last sentence
    var style = { font: "32px Arial" };
    timeText = game.add.text(100, 0, "0", style);
    inputText = game.add.text(100, 50, "", style);
    msgText = game.add.text(100, 100, "", style);
    var grid = this.game.add.sprite(0, 100, 'grid');
    player = this.game.add.sprite(0, 100, 'player');
    player.scale.setTo(0.05, 0.05);
    socket.on('move', function(msg)
    {
        timeText.setText(msg);
        msgText.setText(msg);
    });
}
function updateTimer() {
    time += 300;
    timeText.setText(time);
}
function submitMove() {
    if (movementInput == "right")
        player.x += travelDist;
    else if (movementInput == "left")
        player.x -= travelDist;
    else if (movementInput == "up")
        player.y -= travelDist;
    else if (movementInput == "down")
        player.y += travelDist;
    movementInput = "";
    time = 0;
}
function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        movementInput = "down";
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        movementInput = "up";
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        movementInput = "left";
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        movementInput = "right";
    }
    if(movementInput.length > 0) {
        socket.emit('move', movementInput, function(received) {});
        movementInput = "";
    }
    inputText.setText(movementInput);
}
//# sourceMappingURL=game.js.map