var express = require('express');
var app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
var admin = require('firebase-admin');
const env = require('dotenv').config()


var serviceAccount = require("./private/sprawl-c51a2-firebase-adminsdk-4a1sv-2b9d93389f.json");
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sprawl-c51a2-default-rtdb.firebaseio.com"
});

var players = {};
var star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
};
var scores = {
    blue: 0,
    red: 0
};

var mapUpdates = []

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected: ', socket.id);
    // create a new player and add it to our players object
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 1860) + 50,
        y: Math.floor(Math.random() * 1020) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };

    socket.emit('mapInit', mapUpdates)
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // send the star object to the new player
    socket.emit('starLocation', star);
    // send the current scores
    socket.emit('scoreUpdate', scores);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        // emit a message to all players to remove this player
        // io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    socket.on('starCollected', function () {
        if (players[socket.id].team === 'red') {
            scores.red += 10;
        } else {
            scores.blue += 10;
        }
        star.x = Math.floor(Math.random() * 700) + 50;
        star.y = Math.floor(Math.random() * 500) + 50;
        io.emit('starLocation', star);
        io.emit('scoreUpdate', scores);
    });

    socket.on('mapUpdate', function (tile) {
        addToUpdateArray(tile)
        console.log("Updated tile", tile)
        socket.broadcast.emit('updateMap', tile)

    })

    socket.on('deleteTile', function (tile) {
        console.log("deleting tile: ", tile)
        removeFromUpdateArray(tile)
        socket.broadcast.emit('tileDeleted', tile)
    })
});

function removeFromUpdateArray(tileToRemove) {
    mapUpdates.forEach(tile => {
        if (tile.x == tileToRemove.x) {
            if (tile.y == tileToRemove.y) {
                tile.index = -1;
            }
        }
    });
}

function addToUpdateArray(newTile) {


    mapUpdates.push(newTile)
}

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
