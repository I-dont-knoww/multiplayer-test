const {FRAME_RATE, FRICTION} = require("./constants.js");

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity
};

function createGameState() {
    return {
        players: [
            {
                pos: {x: 20, y: 20},
                vel: {x: 0, y: 0},
                keys: {}
            }
        ]
    };
}

function gameLoop(state) {
    const {players} = state;
    for (let i in players) {
        players[i].pos.x += players[i].vel.x;
        players[i].pos.y += players[i].vel.y;
        
        players[i].vel.x *= FRICTION;
        players[i].vel.y *= FRICTION;
        
        players[i].vel = getUpdatedVelocity(players[i]);
    }
}

function getUpdatedVelocity(player) {
    const {vel, keys} = player;
    if (keys["ArrowLeft"]) return {x: vel.x - 1, y: vel.y};
    if (keys["ArrowUp"]) return {x: vel.x, y: vel.y - 1};
    if (keys["ArrowRight"]) return {x: vel.x + 1, y: vel.y};
    if (keys["ArrowDown"]) return {x: vel.x, y: vel.y + 1};
    return vel;
}