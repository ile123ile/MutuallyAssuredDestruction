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
function preload() {
    // add our logo image to the assets class under the
    // key 'logo'. We're also setting the background colour
    // so it's the same as the background colour in the image
    game.stage.backgroundColor = 0xffffff;
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
    //init enemies
    var a = Math.random();
    var b = Math.random();
    for (var i = 0; i < 3; i++) {
        //generate random coordinates
        a = Math.random();
        b = Math.random();
        for (var count = 0; count < enemyArray.length; count++) {
            while ((enemyArray[count].x == a && enemyArray[count].y == b) || (a == player.x && b == player.y)) {
                a = Math.random();
                b = Math.random();
            }
        }
        //  var tempEnemy = (this.game.add.sprite(travelDist * randomX, travelDist * randomY+100, 'redEnemy'));
        occupied[i] = 4 + (travelDist - .1) * Math.round(a * 14) + 1000000 * (100 + 4 + (travelDist - .1) * Math.round(b * 14));
        var tempEnemy = (this.game.add.sprite(4 + (travelDist - .1) * Math.round(a * 14), 100 + 4 + (travelDist - .1) * Math.round(b * 14), 'redEnemy'));
        tempEnemy.scale.setTo(0.3, 0.3);
        enemyArray.push(tempEnemy);
        occupied.push(0);
    }
    player.scale.setTo(0.05, 0.05);
}
function updateTimer() {
    time += 300;
    timeText.setText(time);
}
function submitMove() {
    moveEnemy();
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
        if ((Math.abs(player.x - enemyArray[r].x) <= 10) && (Math.abs(player.y - enemyArray[r].y) <= 10)) {
            player.kill(); //remove player from grid
        }
    }
    time = 0;
}
function moveEnemy() {
    //update enemies' moves
    var tempXpos, tempYpos;
    for (var count = 0; count < enemyArray.length; count++) {
        tempXpos = enemyArray[count].x;
        tempYpos = enemyArray[count].y;
        if (Math.abs(player.y - enemyArray[count].y) < 10) {
            if (enemyArray[count].x > player.x)
                enemyArray[count].x -= (travelDist - .1);
            else
                enemyArray[count].x += (travelDist - .1);
        }
        else if (Math.abs(player.x - enemyArray[count].x) < 10) {
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
        var tries = 0;
        while (contains.call(occupied, enemyArray[count].x + 1000000 * enemyArray[count].y)) {
            if (tries == 0)
                enemyArray[count].x = tempXpos - (travelDist - .1); //move it sideways -- add checking for out of bounds
            else if (tries == 1)
                enemyArray[count].x = tempXpos + (travelDist - .1);
            else if (tries == 2)
                enemyArray[count].y = tempYpos - (travelDist - .1);
            else if (tries == 3)
                enemyArray[count].y = tempYpos + (travelDist - .1);
            else {
                enemyArray[count].x = tempXpos;
                enemyArray[count].y = tempYpos;
            }
            tries++;
        }
        occupied[count] = enemyArray[count].x + 1000000 * enemyArray[count].y;
    }
}
var contains = function (needle) {
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
    return indexOf.call(this, needle) > -1;
};
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
    inputText.setText(movementInput);
}
//# sourceMappingURL=game.js.map