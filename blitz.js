const easyColors = ["green", "red", "yellow", "blue"];
const hardColors = ["green", "red", "yellow", "blue", "orange", "purple"];
let currentColors = easyColors;
let gameMode = "easy";

const sounds = {
    green: new Audio("audio/green.mp3"),
    red: new Audio("audio/red.mp3"),
    yellow: new Audio("audio/yellow.mp3"),
    blue: new Audio("audio/blue.mp3"),
    orange: new Audio("audio/orange.mp3"),
    purple: new Audio("audio/purple.mp3"),
    wrong: new Audio("audio/wrong.mp3")
};

let gamePattern = [];
let playerPattern = [];
let playerLevel = 0;
let gameStarted = false;
let playerTurn = false;

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const tryAgainButton = document.getElementById("try-again-button");

tryAgainButton.addEventListener("click", function () {

    stopAllSounds();

    document.getElementById("game-over-screen").style.display = "none";

    startGame();

});

function updateBoard() {
    const grid = document.querySelector(".grid-container");

    if (gameMode === "easy") {
        document.getElementById("orange").style.display = "none";
        document.getElementById("purple").style.display = "none";

        grid.classList.remove("hard-mode");
        grid.classList.add("easy-mode");
    } else {
        document.getElementById("orange").style.display = "block";
        document.getElementById("purple").style.display = "block";

        grid.classList.remove("easy-mode");
        grid.classList.add("hard-mode");
    }
}

startButton.addEventListener("click", function () {

    const selectedMode = document.querySelector(
        'input[name="game-mode"]:checked'
    ).value;

    if (selectedMode === "easy") {
        gameMode = "easy";
        currentColors = easyColors;
    } else {
        gameMode = "hard";
        currentColors = hardColors;
    }

    updateBoard();
    startGame();

});

function startGame() {
    gameStarted = true;
    playerTurn = false;
    gamePattern = [];
    playerPattern = [];
    playerLevel = 0;

    startScreen.style.display = "none";

    nextSequence();
}

function nextSequence() {
    playerLevel++;

    const randomNumber = Math.floor(Math.random() * currentColors.length);
    const randomColor = currentColors[randomNumber];

    gamePattern.push(randomColor);

    playSequence();
}

async function playSequence() {

    await sleep(500);

    for (let i = 0; i < gamePattern.length; i++) {

        const color = gamePattern[i];

        await flashColor(color);

        await sleep(250);
    }

    playerTurn = true;

    console.log("Your turn!");
}



function flashColor(color) {

    return new Promise((resolve) => {

        const button = document.getElementById(color);

        sounds[color].currentTime = 0;
        sounds[color].play();

        button.classList.add("pressed");

        button.style.filter = "brightness(2)";
        button.style.boxShadow = "0 0 40px 15px white";

        // Turn off the glow
        setTimeout(() => {

            button.classList.remove("pressed");

            button.style.filter = "";
            button.style.boxShadow = "";

            resolve();

        }, 400);
    });
}


document.querySelectorAll(".btn").forEach(function (button) {

    button.addEventListener("click", function () {

        if (!playerTurn) {
            return;
        }

        const clickedColor = this.id;

        playerFlash(clickedColor);

        playerPattern.push(clickedColor);

        checkAnswer(clickedColor);
    });

});

function checkAnswer(clickedColor) {

    const currentPosition = playerPattern.length - 1;

    if (clickedColor !== gamePattern[currentPosition]) {
        gameOver();
        return;
    }

    if (playerPattern.length === gamePattern.length) {

        playerTurn = false;

        setTimeout(function () {
            playerPattern = [];
            nextSequence();
        }, 1000);
    }
}

function playerFlash(color) {

    const button = document.getElementById(color);

    sounds[color].currentTime = 0;
    sounds[color].play();

    button.classList.add("pressed");

    button.style.filter = "brightness(1.8)";
    button.style.boxShadow = "0 0 30px 10px white";

    setTimeout(function () {

        button.classList.remove("pressed");

        button.style.filter = "";
        button.style.boxShadow = "";

    }, 200);
}


function gameOver() {

    playerTurn = false;
    gameStarted = false;


    stopAllSounds();

    sounds.wrong.currentTime = 0;
    sounds.wrong.play();


    document.body.classList.add("game-over");

    setTimeout(function () {
        document.body.classList.remove("game-over");
    }, 500);



    setTimeout(function () {

        document.getElementById("game-over-screen").style.display = "flex";

    }, 500);
}

function stopAllSounds() {

    Object.values(sounds).forEach(function (sound) {
        sound.pause();
        sound.currentTime = 0;
    });

}

function sleep(milliseconds) {

    return new Promise(resolve => setTimeout(resolve, milliseconds));

}