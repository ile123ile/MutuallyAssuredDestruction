var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/test.html');
});
/*function routeGameFile(URI, fileName) {
	app.get(URI, function(req, res){
		res.sendFile(__dirname + '/PhaserProject/PhaserProject/' + fileName);
	});
}
routeGameFile('/game.html', 'index.html');
routeGameFile('/game.js', 'game.js');
routeGameFile('/phaser.js', 'phaser.js');
routeGameFile('/TitleScreenState.js', 'TitleScreenState.js');
routeGameFile('/GameObjects/Player.js', '/GameObjects/Player.js');*/
app.use(express.static(__dirname + '/PhaserProject/PhaserProject/Public'));
var id = 0;
var playerWait;

function randomRange(min, max)
{
	return Math.floor(Math.random()*(max-min+1)+min);
}

function makeEnemies(game, numEnemies, min, max)
{
	game.enemyArray = [];
	for (var i = 0; i < numEnemies; i++) {
    	//generate random coordinates
        a = randomRange(min, max);
        b = randomRange(min, max);
        for (var count = 0; count < game.enemyArray.length; count++) {
            while ((game.enemyArray[count].x == a && game.enemyArray[count].y == b)) {
                a = randomRange(min, max);
                b = randomRange(min, max);
            }
        }
        var enemy = {x: a, y: b, isDying: false, isDead: false, name: 'redEnemy'};
        game.enemyArray.push(enemy);
    }
}

function createGame(headPid, bodyPid, level)
{
	game = {head: headPid, body: bodyPid, level: level, hasBegun: false};
	game.player = {x: 0, y: 0};
	makeEnemies(game, 8, 5, 14);
	return game;
}

function movePlayer(game)
{
	if(game.moves.body == 'left')
	{
		game.player.x--;
	}
	else if(game.moves.body == 'right')
	{
		game.player.x++;
	}
	else if(game.moves.body == 'down')
	{
		game.player.y++;
	}
	else if(game.moves.body == 'up')
	{
		game.player.y--;
	}
}

function moveEnemy(game, enemyId)
{
	var player = game.player;
	var enemy = game.enemyArray[enemyId];
	if(enemy.isDead || enemy.isDying)
	{
		return;
	}
	var tempX = enemy.x;
	var tempY = enemy.y;
	var xDist = player.x-enemy.x;
	var yDist = player.y-enemy.y;
	if(Math.abs(xDist)>Math.abs(yDist))
	{
		if(xDist > 0)
		{
			tempX++;
		}
		else
		{
			tempX--;
		}
	}
	else
	{
		if(yDist > 0)
		{
			tempY++;
		}
		else
		{
			tempY--;
		}
	}
	for(var i = 0; i < game.enemyArray.length; i++)
	{
		if(i==enemyId)
			continue;
		var other = game.enemyArray[i];
		if(tempX==other.x&&tempY==other.y&&!(other.isDead||other.isDying))
		{
			return false;
		}
	}
	enemy.x = tempX;
	enemy.y = tempY;
	if(enemy.x == player.x && enemy.y == player.y)
	{
		player.isDead = true;
	}
	return true;
}

function moveEnemies(game)
{
	var enemyArray = game.enemyArray;

	var somethingMoved=true;
	var moved = [];
	while(somethingMoved)
	{
		somethingMoved = false;
	    for(var i = 0; i < enemyArray.length; i++)
    	{
    		if(moved[i])
    			continue;
	    	if(moveEnemy(game, i))
    		{
    			somethingMoved = true;
    			moved[i] = true;
 	   		}
    	}
	}
}

function killEnemies(game)
{
	var dir = game.moves.head;
	var player = game.player;
	var closest = null;
	var closestDist = 1000000;
	for(var i = 0; i < game.enemyArray.length; i++)
	{
		var enemy = game.enemyArray[i];
		if(enemy.isDying)
		{
			enemy.isDead = true;
			enemy.isDying = false;
			continue;
		}
		if(enemy.isDead)
		{
			continue;
		}
		if(dir == 'left')
		{
			if(enemy.y == player.y && player.x > enemy.x && player.x - enemy.x < closestDist)
			{
				closest = enemy;
			}
		}
		else if(dir == 'right')
		{
			if(enemy.y == player.y && player.x < enemy.x && enemy.x - player.x < closestDist)
			{
				closest = enemy;
			}
		}
		else if(dir == 'down')
		{
			if(enemy.x == player.x && player.y < enemy.y && enemy.y - player.y < closestDist)
			{
				closest = enemy;
			}
		}
		else if(dir == 'up')
		{
			if(enemy.x == player.x && player.y > enemy.y && player.y - enemy.y < closestDist)
			{
				closest = enemy;
			}
		}
	}
	if(closest != null)
	{
		closest.isDying = true;
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

function updateGame(game)
{
	movePlayer(game);
	moveEnemies(game);
	killEnemies(game);
}

io.on('connection', function(socket){
	var pid = id++;
	var player = {socket: socket, pid: pid, move: ''};
	var moveInterval;
	if(playerWait == null)
	{
		playerWait = player;
	}
	else
	{
		socket.emit('message', 'You are head. You connected with body ' + playerWait.pid);
		playerWait.socket.emit('message', 'You are body. You connected with head ' + pid);
		player.partner = playerWait;
		playerWait.partner = player;
		var game = createGame(player.pid, playerWait.pid, 1);
		player.game = game;
		playerWait.game = game;
		player.isHead = true;
		playerWait.isBody = true;
		console.log(player.pid+' connected with '+playerWait.pid);
		console.log(game);

		playerWait = null;
		moveInterval = setInterval(function(){
			if(!game.hasBegun)
			{
				game.hasBegun = true;
				player.socket.emit('begin', game);
				player.partner.socket.emit('begin', game);
			}
			moves = {'head':player.move, 'body':player.partner.move};
			game.moves = moves;
			updateGame(game);
			player.socket.emit('move', game);
			player.partner.socket.emit('move', game);
			player.move = '';
			player.partner.move = '';
			if (game.player.isDead) {
			    console.log('entered section');
			    player.socket.emit('message', 'You lost');
			    player.partner.socket.emit('message', 'You also lost');    
			    clearInterval(moveInterval);
			}
		}, 3*1000);
	}
	console.log(pid+': a user connected');
	socket.on('disconnect', function(){
		console.log(pid+': a user disconnected');
		if(player.partner != null)
		{
			player.partner.socket.emit('message', 'Warning: haha you fucker ducker');
		}
		if(playerWait != null && playerWait.pid === player.pid)
		{
			playerWait = null;
		}
		if(player.isHead === true)
		{
			clearInterval(moveInterval);
		}
	});
	/*socket.on('move', function(msg, fn){
		console.log('message: '+msg);
		player.move = msg;
		if(player.partner != null){
			if(player.partner.move != null){
				player.socket.emit('move', player.partner.move);
				player.partner.socket.emit('move', player.move);
				console.log('you both moved you fux');
				player.partner.move = null;
				player.move = null;
			}
			else{
				player.partner.socket.emit('message', 'Your partner has moved');
				fn('received');
			}
		}
	});*/
	socket.on('move', function(msg){
		player.move = msg;
	});
});



http.listen((process.env.PORT || 3000), function(){
  console.log('listening on *: '+ (process.env.PORT || 3000));
});
