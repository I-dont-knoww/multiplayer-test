const BG_COLOR = "#111111";
const PLAYER_COLOR = "#dd5555";

const socket = io("http://localhost:3000");

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const gameCodeDisplayHolder = document.getElementById("gameCodeDisplayHolder");
const errorDisplay = document.getElementById("errorDisplay");

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

function newGame() {
    socket.emit("newGame");
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    gameCodeDisplayHolder.style.display = "none";
    socket.emit("joinGame", code);
    init();
}

function handleUnknownGame() {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "unknown game";
}

let canvas, ctx;
let playerNumber;

function init() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx = canvas.getContext("2d");
    
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    document.addEventListener('keydown', e => {
        socket.emit('keydown', e.key);
    });
    
    document.addEventListener('keyup', e => {
        socket.emit('keyup', e.key);
    });
}

function paintGame(state) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const {players} = state;
    
    for (let i in players) {
        ctx.fillStyle = PLAYER_COLOR;
        ctx.beginPath();
        ctx.arc(players[i].pos.x, players[i].pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
    }
    
}

function handleInit(number) {
    playerNumber = number;
    console.log(number);
}

function handleGameState(gameState) {
    gameState = JSON.parse(gameState);
    requestAnimationFrame(_ => paintGame(gameState));
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerHTML = gameCode;
}