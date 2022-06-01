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
    
    let controls = {
        ArrowUp: "up",
        ArrowLeft: "left",
        ArrowDown: "down",
        ArrowRight: "right",
    };
    
    let x;
    let y;
    for (let i in keys) {
        if (!keys[i]) continue;

        let control = controls[i];
        if (!control) continue;

        if (control == "up") {
            y = -1;
        }
        else if (control == "left") {
            x = -1;
        }
        else if (control == "down") {
            y = 1;
        }
        else if (control == "right") {
            x = 1;
        }
    }

    if (x && y) return {x: vel.x + x / Math.SQRT2, y: vel.y + y / Math.SQRT2};
    if (x) return {x: vel.x + x, y: vel.y};
    if (y) return {x: vel.x, y: vel.y + y};
    return vel;
}
