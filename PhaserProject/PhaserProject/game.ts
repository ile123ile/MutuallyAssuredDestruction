var game = new Phaser.Game(900, 900, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var cursors;
var player;
var travelDist = 53.5;
var movementInput = "";
var time = 0;
var timeText;
var inputText;
var maxTime = 0;
var enemyArray = [];
var occupied = []; // xcoord + 1000000* ycoord
var role = "shooting";
var bullets;
var bulletVel = 900;
var field = [15][15];
var canvas = <HTMLCanvasElement>document.getElementById("canvas");
var ctx = canvas.getContext("2d");



function preload() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // add our logo image to the assets class under the
    // key 'logo'. We're also setting the background colour
    // so it's the same as the background colour in the image
    game.stage.backgroundColor = 0xffffff;
    this.game.load.image('grid', 'Graphics/2151465-grid.jpg');
    this.game.load.image('player', 'Graphics/greendude.png');
    this.game.load.image('bullet', 'Graphics/bullet.png');
    this.game.load.image('redEnemy', "Graphics/redenemy.jpg");

    this.game.load.image('grid', "Graphics/2151465-grid.jpg");
    this.game.load.image('player', "Graphics/greendude.png");
    this.game.load.image('redEnemy', "Graphics/redenemy.jpg");
    cursors = this.game.input.keyboard.createCursorKeys();
    window.setInterval(submitMove, 3000);
    window.setInterval(updateTimer, 300);
}

function create() {
    // add the 'logo' sprite to the game, position it in the
    // center of the screen, and set the anchor to the center of
    // the image so it's centered properly. There's a lot of
    // centering in that last sentence
    //  console.log("hi");

    var style = { font: "32px Arial" };
    timeText = game.add.text(100, 0, "0", style);
    inputText = game.add.text(100, 50, "", style);
    var grid = this.game.add.sprite(0, 100, 'grid');
    player = this.game.add.sprite(0, 100, 'player');

   

    player.scale.setTo(0.05, 0.05);


    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    cursors = this.game.input.keyboard.createCursorKeys();
}

function updateTimer() {
    time += 300;
    timeText.setText(time);
}

function setup() {
    //init enemies
    for (var i = 0; i < 8; i++) {
        var a = Math.random();
        var b = Math.random();
        while (field[a][b] != 0) {
            var a = Math.random();
            var b = Math.random();
        }
        field[a][b] = 2;
    }
}

function submitMove() {
    moveEnemy();

    time = 0;
    if (role == "moving") {
        if (movementInput == "right")
            player.x += travelDist;
        else if (movementInput == "left")
            player.x -= travelDist;
        else if (movementInput == "up")
            player.y -= travelDist;
        else if (movementInput == "down")
            player.y += travelDist;
    }
    else if (role == "shooting") {

        if (movementInput != "") {

            var bullet = bullets.getFirstDead();


            bullet.reset(player.x + player.width / 2 - bullet.width / 2, player.y + player.height / 2 - bullet.height / 2);

            if (movementInput == "right")
                bullet.body.velocity.x = bulletVel;
            else if (movementInput == "left")
                bullet.body.velocity.x = -1 * bulletVel;
            else if (movementInput == "up")
                bullet.body.velocity.y = -bulletVel;
            else if (movementInput == "down")
                bullet.body.velocity.y = bulletVel;
        }
    }

    movementInput = "";


    if (movementInput == "right")
        player.x += travelDist;
    else if (movementInput == "left")
        player.x -= travelDist;
    else if (movementInput == "up")
        player.y -= travelDist;
    else if (movementInput == "down")
        player.y += travelDist;
    movementInput = "";
    for (var r = 0; r < enemyArray.length; r++) {
        if ((Math.abs(player.x - enemyArray[r].x) <= 5) && (Math.abs(player.y - enemyArray[r].y) <= 5)) {
            player.kill(); //remove player from grid
            for (var v = 0; v < enemyArray.length; v++)
                enemyArray[v].kill();
        }
    }
    time = 0;
    var send = { player, enemyArray };
    send.player = { x: 2, y: 2 };
    send.enemyArray = [{ x: 4, y: 4 }, { x: 7, y: 7 }, { x: 8, y: 8 }, { x: 10, y: 10 }];
    updateData(send);


}

function moveEnemy() {
    //update enemies' moves
    var tempXpos, tempYpos;
    for (var count = 0; count < enemyArray.length; count++) {
        tempXpos = enemyArray[count].x;
        tempYpos = enemyArray[count].y;
        if (Math.abs(player.y - enemyArray[count].y) < 5) {
            if (enemyArray[count].x > player.x)
                enemyArray[count].x -= (travelDist - .1);
            else
                enemyArray[count].x += (travelDist - .1);
        }
        else if (Math.abs(player.x - enemyArray[count].x) < 5) {
            if (enemyArray[count].y > player.y)
                enemyArray[count].y -= (travelDist - .1);
            else
                enemyArray[count].y += (travelDist - .1);
        }
        else if (Math.abs(Math.atan((player.y - enemyArray[count].y) / (player.x - enemyArray[count].x))) > (Math.PI / 4)) {
            if (enemyArray[count].y < player.y)
                enemyArray[count].y += (travelDist - .1);
            else
                enemyArray[count].y -= (travelDist - .1);
        }
        else {
            if (enemyArray[count].x < player.x)
                enemyArray[count].x += (travelDist - .1);
            else
                enemyArray[count].x -= (travelDist - .1);
        }
        //make sure no two enemies occupy the same location
        for (var c = 0; c < enemyArray.length; c++) {
            if (c != count)
                occupied[c] = enemyArray[c].x + 1000000 * enemyArray[c].y;
            else
                occupied[c] = -1;
        }
        var limitedOccupied = [];
        for (var cou = 0; cou < count; cou++) {
            limitedOccupied[cou] = enemyArray[cou].x + 1000000 * enemyArray[cou].y;
        }
        var tries = 0;

        while (contains(limitedOccupied, enemyArray[count].x + 1000000 * enemyArray[count].y)) {
            if (tries == 0) {
                enemyArray[count].x = tempXpos - (travelDist - .1);//move it sideways -- add checking for out of bounds
                enemyArray[count].y = tempYpos;
            }
            else if (tries == 1) {

                enemyArray[count].x = tempXpos + (travelDist - .1);
                enemyArray[count].y = tempYpos;
            }
            else if (tries == 2) {
                enemyArray[count].y = tempYpos - (travelDist - .1);
                enemyArray[count].x = tempXpos;
            }
            else if (tries == 3) {
                enemyArray[count].y = tempYpos + (travelDist - .1);
                enemyArray[count].x = tempXpos;
            }
            else {
                enemyArray[count].x = tempXpos;
                enemyArray[count].y = tempYpos;
            }
            tries++;
        }
        occupied[count] = enemyArray[count].x + 1000000 * enemyArray[count].y;
    }
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - obj) < 3) {
            return true;
        }
    }
    return false;
}
/*var contains = function (needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    }
    else {
        indexOf = function (needle) {
            var i = -1, index = -1;
            for (i = 0; i < this.length; i++) {
                var item = this[i];
                if ((findNaN && item !== item) || item === needle) {
                   index = i;
                    break;
                }
            }
            return index;
        };
    }
    */
function resetBullet(bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

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
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        if (role == "moving")
            role = "shooting";
        else if (role == "shooting")
            role = "moving";
    }
    inputText.setText(movementInput + "   " + role);
}

function updateData(data) {
    player.x = data.player.x * travelDist;
    player.y = 100 + data.player.y * travelDist;
    for (var i = 0; i < enemyArray.length; i++) {
        enemyArray[i].x = data.enemyArray[i].x * travelDist;
        enemyArray[i].y = 100 + data.enemyArray[i].y * travelDist;
    }
}
