const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});
const {createGameState, gameLoop, getUpdatedVelocity} = require("./game.js");
const {makeid} = require("./utils.js");
const {FRAME_RATE} = require("./constants.js");

const state = {};
const clientRooms = {};

io.on("connection", client => {
    client.on("keydown", handleKeydown);
    client.on("keyup", handleKeyup);
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);
    
    function handleNewGame() {
        let roomName = makeid(5);
        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);
        
        state[roomName] = createGameState();
        
        client.join(roomName);
        client.number = 0;
        client.emit("init", 0);
        
        startGameInterval(roomName);
    }
    
    function handleJoinGame(gameCode) {
        const arr = Array.from(io.sockets.adapter.rooms);
        let numClients;
        
        for (let i in arr) {
            if (arr[i][0] == gameCode) {
                numClients = arr[i][1].size;
            }
        }
        
        if (numClients == 0) {
            client.emit("unknownGame");
            return;
        }
        
        state[gameCode].players.push({pos: {x: 20, y: 20}, vel: {x: 0, y: 0}, keys: {}});
        clientRooms[client.id] = gameCode;
        client.join(gameCode);
        client.number = numClients;
        client.emit('init', client.number);
    }
    
    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id];
        if (!roomName) return;
        
        state[roomName].players[client.number].keys[keyCode] = true;
    }
    
    function handleKeyup(keyCode) {
        const roomName = clientRooms[client.id];
        if (!roomName) return;
        
        state[roomName].players[client.number].keys[keyCode] = false;
    }
});

function startGameInterval(roomName) {
    setInterval(_ => {
        gameLoop(state[roomName]);
        
        emitGameState(roomName, state[roomName]);
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
    io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

io.listen(3000);