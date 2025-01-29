const canvas = document.getElementById("football-field");
const context = canvas.getContext("2d");

let scorePlayer1 = 9, scorePlayer2 = 0;
let scoreBoard = document.querySelector('.score-board');
let scoredBall = document.querySelector('.scored-ball');
let playTime = document.querySelector('.play-time');
const topBorder = 50, bottomBorder = 650, rightBorder = 1300, leftBorder = 200;
let timer = 60;
let set = document.querySelector('.settings');
let setMenu = document.querySelector('.settings-menu');
let logout = document.querySelector('.logout');
let gameName = document.querySelector('.game-name')
let dailyMode = document.querySelector('.daily-mode');
let createBtn = document.querySelector('.btn');
let windowWelcome = document.querySelector('.welcome');
let init = requestAnimationFrame(startGame);
let timePeriodChosen = document.querySelector('.time-period')
let wasLoggedOut = false;

function startGame() {
    renderFootballField();
    renderBall();
    renderPlayers();

    movePlayer();
    playersKeyboards();
    moveBall();

    playerBorder();
    ballBorder();
    collisionBallPlayer();
    collisionPlayers();

    changeGameScore();
    requestAnimationFrame(startGame);
}

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

timePeriodChosen.onclick = function(event) {
    let inp = event.target.closest('input');
    timer = inp.getAttribute('value');
    timer = timer.slice(0, timer.length - 1);
}

function changeElementsPosition() {
    windowWelcome.style.left = document.documentElement.clientWidth / 2  - windowWelcome.offsetWidth / 2 + 'px';
    windowWelcome.style.top = document.documentElement.clientHeight / 2  - windowWelcome.offsetHeight / 2 + 'px';
    playTime.style.left = document.documentElement.clientWidth / 2  - scoreBoard.offsetWidth / 2  - 45 + "px";
    playTime.style.top = document.documentElement.clientHeight - 50 + "px";
    scoreBoard.style.left = document.documentElement.clientWidth / 2  - scoreBoard.offsetWidth / 2  - 45 + "px";
    scoreBoard.style.top = 5 + "px";
}

createBtn.addEventListener('click', () => {
    windowWelcome.classList.toggle('hide');
    scoreBoard.classList.toggle('hide');
    set.classList.toggle('hide');
    playTime.classList.toggle('hide');
    canvas.classList.toggle('hide');
    scorePlayer1 = 0, scorePlayer2 = 0;
    gameName.classList.toggle('hide');
    wasLoggedOut = false;
    gameTime();
    reset();
});

document.addEventListener('DOMContentLoaded', changeElementsPosition);

set.addEventListener('click', () => {setMenu.classList.toggle('hide');});

logout.addEventListener('click', () => {
    windowWelcome.classList.toggle('hide');
    canvas.classList.toggle('hide');
    set.classList.toggle('hide');
    setMenu.classList.toggle('hide');
    playTime.classList.toggle('hide');
    gameName.classList.toggle('hide');
    scoreBoard.classList.toggle('hide');
    wasLoggedOut = true;
    timer = 60;
});

class FieldObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.acceleration = 0.5;
        this.deceleration = 0.5;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.size = 20;
    }
}

class Player extends FieldObject {
    constructor(x, y) {
        super(x, y);
        this.score = 0;
        this.acceleration = 0.5;
        this.deceleration = 0.5;
        this.maxSpeed = 4;
        this.size = 35;
        this.up = false;
        this.down = false;
        this.right = false;
        this.left = false;
    }
}

class Ball extends FieldObject {
    constructor(x, y) {
        super(x, y);
        this.acceleration = 0.5;
        this.deceleration = 0.035;
        this.size = 20;
    }
}

let players = [new Player(650, 350-17.5), new Player(750 + 100 - 17.5, 350-17.5)];
let ball = new Ball(740, 340);

function gameTime() {
    if (!wasLoggedOut) {
        playTime.innerHTML = timer;
        timer--;
        if (timer < 0) {
            alert((scorePlayer1 > scorePlayer2) ? "Игрок 1 выиграл" : ((scorePlayer1 < scorePlayer2) ? "Игрок 2 выиграл": 'Ничья'));
            location.reload(true);
        }
        else {
            setTimeout(gameTime, 1000);
        }
    }
    else {
        wasLoggedOut = false;
    }
}

function playersKeyboards() {
    for (let player of players) {
        if (player.up) {
            if (player.ySpeed > -player.maxSpeed) {
                player.ySpeed -= player.acceleration;
            }
            else {
                player.ySpeed = -player.maxSpeed;
            }
        }
        else {
            if (player.ySpeed < 0) {
                player.ySpeed += player.deceleration;
                if (player.ySpeed > 0) {
                    player.ySpeed = 0;
                }
            }
        }

        if (player.down) {
            if (player.ySpeed < player.maxSpeed) {
                player.ySpeed += player.acceleration;
            }
            else {
                player.ySpeed = player.maxSpeed;
            }
        }
        else {
            if (player.ySpeed > 0) {
                player.ySpeed -= player.deceleration;
                if (player.ySpeed < 0) {
                    player.ySpeed = 0;
                }
            }
        }

        if (player.left) {
            if (player.xSpeed > -player.maxSpeed) {
                player.xSpeed -= player.acceleration;
            }
            else {
                player.xSpeed = -player.maxSpeed;
            }
        }
        else {
            if (player.xSpeed < 0) {
                player.ySpeed += player.deceleration;
                if (player.ySpeed > 0) {
                    player.xSpeed = 0;
                }
            }
        }

        if (player.right) {
            if (player.xSpeed < player.maxSpeed) {
                player.xSpeed += player.acceleration;
            }
            else {
                player.xSpeed = player.maxSpeed;
            }
        }
        else {
            if (player.xSpeed > 0) {
                player.xSpeed -= player.deceleration;
                if (player.xSpeed < 0) {
                    player.xSpeed = 0;
                }
            }
        }
    }
}

function movePlayer() {
    for (let player of players) {
        player.x += player.xSpeed;
        player.y += player.ySpeed;
    }
}

function moveBall() {
    if (ball.xSpeed !== 0) {
        if (ball.xSpeed > 0) {
            ball.xSpeed -= ball.deceleration;
            if (ball.xSpeed < 0) ball.xSpeed = 0;
        }
        else {
            ball.xSpeed += ball.deceleration;
            if (ball.xSpeed > 0) ball.xSpeed = 0;
        }
    }
    if (ball.ySpeed !== 0) {
        if (ball.ySpeed > 0) {
            ball.ySpeed -= ball.deceleration;
            if (ball.ySpeed < 0) ball.ySpeed = 0;
        }
        else {
            ball.ySpeed += ball.deceleration;
            if (ball.ySpeed > 0) ball.ySpeed = 0;
        }
    }

    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
}

function playerBorder() {
    for (let player of players) {
        if (player.x < leftBorder) {
            player.x = leftBorder;
            player.xSpeed *= -0.3;
        }
        if (player.x + player.size > rightBorder) {
            player.x = rightBorder - player.size;
            player.xSpeed *= -0.3;
        }
        if (player.y < topBorder) {
            player.y = topBorder;
            player.ySpeed *= -0.3;
        }
        if (player.y + player.size > bottomBorder) {
            player.y = bottomBorder - player.size;
            player.ySpeed *= -0.3;
        }
    }
}

function ballBorder() {
    if (ball.x < leftBorder) {
        if (ball.y > 300 && (ball.y + ball.size) < 400) {
            scorePlayer2++;
            reset();
            return;
        }
        ball.x = leftBorder;
        ball.xSpeed *= -1.5;
    }
    if (ball.x + ball.size > rightBorder) {
        if (ball.y > 300 && (ball.y + ball.size) < 400) {
            scorePlayer1++;
            reset();
            return;
        }
        ball.x = rightBorder - ball.size;
        ball.xSpeed *= -1.5;
    }
    if (ball.y < topBorder) {
        ball.y = topBorder;
        ball.ySpeed *= -1.5;
    }
    if (ball.y + ball.size > bottomBorder) {
        ball.y = bottomBorder - ball.size;
        ball.ySpeed *= -1.5;
    }
}

function collide(player_copy, ball_copy) {
    const dx = (ball_copy.x - player_copy.x) / ball_copy.size;
    const dy = (ball_copy.y - player_copy.y) / ball_copy.size;
    player_copy.xSpeed = -dx;
    player_copy.ySpeed = -dy;
    ball_copy.xSpeed = dx;
    ball_copy.ySpeed = dy;
}

function collisionBallPlayer() {
    for (let player of players) {
        let distanceBallPlayer = getDistance(player.x, player.y, ball.x, ball.y);
//        if ((player.x + player.size <= ball.x) || (player.y + player.size <= ball.y)) {
//            distanceBallPlayer -= player.size + 5;
//        }
//        // Если игрок находится справа или снизу от мяча
//        else {
//            distanceBallPlayer -= ball.size;
//        }
        if (player.x + player.size < ball.x && player.y <= (ball.y + ball.size) && (player.y + player.size) >= ball.y) distanceBallPlayer -= player.size + 5;
        else if (player.y + player.size > ball.y) distanceBallPlayer -= ball.size;
        if (distanceBallPlayer < 0) collide(player, ball);
    }
}

function collisionPlayers() {
    const distancePlayers = getDistance(players[0].x, players[0].y, players[1].x, players[1].y) - players[1].size;
    if (distancePlayers < 0) collide(players[0], players[1]);
}

function reset() {
    players = [new Player(650, 350-17.5), new Player(750 + 100 - 17.5, 350-17.5)];
    ball = new Ball(740, 340);
}

document.addEventListener('keydown', function(event) {
    switch(event.code) {
        case "KeyW":
            players[0].up = true;
            break;
        case "KeyA":
            players[0].left = true;
            break;
        case "KeyS":
            players[0].down = true;
            break;
        case "KeyD":
            players[0].right = true;
            break;
        case "ArrowUp":
            players[1].up = true;
            break;
        case "ArrowLeft":
            players[1].left = true;
            break;
        case "ArrowDown":
            players[1].down = true;
            break;
        case "ArrowRight":
            players[1].right = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.code) {
        case "KeyW":
            players[0].up = false;
            break;
        case "KeyA":
            players[0].left = false;
            break;
        case "KeyS":
            players[0].down = false;
            break;
        case "KeyD":
            players[0].right = false;
            break;
        case "ArrowUp":
            players[1].up = false;
            break;
        case "ArrowLeft":
            players[1].left = false;
            break;
        case "ArrowDown":
            players[1].down = false;
            break;
        case "ArrowRight":
            players[1].right = false;
            break;
    }
});


function changeGameScore() {
    scoreBoard.innerHTML = scorePlayer1 + " : " + scorePlayer2;
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function renderFootballField() {
    context.save();

    context.strokeStyle = "white";
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.strokeRect(200, 50, 1100, 600);
    context.fillStyle = "green";
    context.fillRect (203, 53, 1094, 594);

    context.beginPath();
    context.moveTo(750, 50);
    context.lineTo(750, 650);
    context.stroke();
    context.beginPath();
    context.arc(750, 350, 50, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(750, 350, 5, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(200, 50);
    context.arc(200, 50, 20, 0, Math.PI/2, false);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(200, 650);
    context.arc(200, 650, 20, Math.PI * 3/2, 0, false);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(1300, 650);
    context.arc(1300, 650, 20, Math.PI, Math.PI * 3/2, false);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(1300, 50);
    context.arc(1300, 50, 20, Math.PI / 2, Math.PI, false);
    context.closePath();
    context.stroke();

    context.strokeRect(200, 275, 50, 150);
    context.strokeRect(200, 200, 150, 300);
    context.strokeRect(170, 300, 30, 100);
    context.beginPath();
    context.moveTo(350, 315);
    context.quadraticCurveTo(390, 340, 350, 385)
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(300, 350, 3, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();

    context.strokeRect(1250, 275, 50, 150);
    context.strokeRect(1150, 200, 150, 300);
    context.strokeRect(1300, 300, 30, 100);
    context.beginPath();
    context.moveTo(1150, 315);
    context.quadraticCurveTo(1110, 340, 1150, 385)
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(1200, 350, 3, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();

    context.restore();
}

function renderBall() {
    context.save();

    context.imageSmoothingEnabled = true;
    const img = new Image();
    img.src = "https://en.js.cx/clipart/ball.svg";
    context.drawImage(img, ball.x, ball.y, ball.size, ball.size);

    context.restore();
}

function renderPlayers() {
    context.save();

    context.imageSmoothingEnabled = true;
    const img1 = new Image();
    const img2 = new Image();
    img1.src = "players_images/character.png";
    img2.src = "players_images/rectangle.png";
    context.drawImage(img1, players[0].x, players[0].y, players[0].size, players[0].size);
    context.drawImage(img2, players[1].x, players[1].y, players[1].size, players[1].size);

    context.restore();
}

