includeJs("levelData.js");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const stageSelectButton = document.getElementById("stageSelectButton");
const stageSelect = document.getElementById("stageSelect");
const backToMenuButton = document.getElementById("backToMenuButton");
const backToTitleButton = document.getElementById("backToTitleButton");
const nextLevelButton = document.getElementById("nextLevelButton");
const nextLevel = document.getElementById("nextLevel");
const htmlLevel = document.getElementById("gameLevel");
const htmlGameVersion = document.getElementById("gameVersion");
const goToStageButton = document.getElementsByClassName("goToStageButton");
const gameFinished = document.getElementById("gameFinished");
const gameFinishedButton = document.getElementById("gameFinishedButton");
const gameSize = document.body.clientWidth * 0.72;
const gameVersion = "dlatl_rkdnl"
const fadeOutTime = 200;
const fadeInTime = 600;
const pixelSize = document.body.clientWidth * 0.08;
const wallImage = new Image();
const ballImage = new Image();
const goalImage = new Image();
const playerImage = new Image();
var playing = false;
var gameLevel = 0;
var highestLevel = 0;
wallImage.src = "images/wallImage.png";
ballImage.src = "images/ballImage.png";
goalImage.src = "images/goalImage.png";
playerImage.src = "images/playerImage.png";


if (document) {
  htmlGameVersion.innerHTML = gameVersion;
  goToStageButton.item(0).style.background = "rgb(255, 225, 50)";
  for (var i = 0; i < goToStageButton.length; i++) {
    goToStageButton.item(i).innerHTML = i + 1;
    goToStageButton.item(i).addEventListener("click", function() {
      if (this.innerHTML - 1 <= highestLevel) {
        fadeOut(stageSelect, fadeOutTime);
        gameLevel = this.innerHTML - 1;
        startGame(gameSize);
      }
    });
  }
  fadeIn(mainMenu, fadeInTime);
  startButton.addEventListener("click", function () {
    startGame(gameSize);
  });
  document.addEventListener("keydown", keyboardInput, false);
  stageSelectButton.addEventListener("click", function () {
    fadeOut(mainMenu, fadeOutTime);
    fadeIn(stageSelect, fadeInTime);
    // move to selected level
  });
  backToMenuButton.addEventListener("click", function () {
    if (playing === true) {
      playing = false;
      fadeOut(gameArea, fadeOutTime);
      fadeIn(mainMenu, fadeInTime);
    }
  });
  backToTitleButton.addEventListener("click", function () {
    if (playing == true) playing = false;
    playing = false;
    fadeOut(stageSelect, fadeOutTime);
    fadeIn(mainMenu, fadeInTime);
  });
  nextLevelButton.addEventListener("click", function () {
    fadeOut(nextLevel, fadeOutTime);
    startGame(gameSize);
  })
  gameFinishedButton.addEventListener("click", function() {
    fadeOut(gameFinished, fadeOutTime);
    fadeIn(mainMenu, fadeInTime);
  })
}


function startGame(size) {
  fadeOut(mainMenu, fadeOutTime);
  htmlLevel.innerHTML = "STAGE " + (gameLevel + 1);
  fadeIn(gameArea, fadeInTime, "block");
  canvas.width = size;
  canvas.height = size;
  if (playing === false) playing = true;
  drawGame(size);
}
function keyboardInput(key) {
  if (playing === false) return;
  if (key.keyCode === 37) {
    // left
    console.log('left');
  }
  else if (key.keyCode === 38) {
    // up
    console.log('up');
  }
  else if (key.keyCode === 39) {
    // right
    console.log('right');
  }
  else if (key.keyCode === 40) {
    // down
    console.log('down');
  }
}
function drawGame(size) {
  context.clearRect(0, 0, size, size);
  for (var i = 0; i < wallsData[gameLevel].length; i++) {
    context.drawImage(wallImage, wallsData[gameLevel][i][0] * pixelSize, wallsData[gameLevel][i][1] * pixelSize, pixelSize, pixelSize);
  }
  for (var i = 0; i < ballsData[gameLevel].length; i++) {
    context.drawImage(ballImage, ballsData[gameLevel][i][0] * pixelSize, ballsData[gameLevel][i][1] * pixelSize, pixelSize, pixelSize);
  }
  for (var i = 0; i < goalsData[gameLevel].length; i++) {
    context.drawImage(goalImage, goalsData[gameLevel][i][0] * pixelSize, goalsData[gameLevel][i][1] * pixelSize, pixelSize, pixelSize);
  }
  context.drawImage(playerImage, playerData[gameLevel][0] * pixelSize, playerData[gameLevel][1] * pixelSize, pixelSize, pixelSize);
  if (solved(ballsData[gameLevel], goalsData[gameLevel])) {
    levelUp();
  }
}
function solved(ballArray, goalArray) {
  var count = 0;
  for (var i = 0; i < ballArray.length; i++) {
    for (var j = 0; j < goalArray.length; j++) {
      if (goalArray[j][0] === ballArray[i][0] && goalArray[j][1] === ballArray[i][1]) count++;
    }
  }
  if (count === goalArray.length) return true;
  return false;
}
function levelUp() {
  if (playing === false) return;
  playing = false;
  if (++gameLevel > highestLevel) highestLevel = gameLevel;
  if (gameLevel === wallsData.length) {
    fadeOut(gameArea, fadeOutTime);
    gameLevel = 0;
    fadeIn(gameFinished, fadeInTime, "block");
  }
  else {
    goToStageButton.item(gameLevel).style.background = "rgb(255, 225, 50)";
    fadeOut(gameArea, fadeOutTime);
    htmlLevel.innerHTML = "STAGE " + gameLevel + 1;
    fadeIn(nextLevel, fadeInTime, "block");
  }
}


function fadeIn(object, ms, displayStyle) {
  if (!object) return;
  // if (object.style.display !== "none") return;
  if (arguments.length === 2) displayStyle = "inline-block";
  object.style.opacity = 0;
  object.style.filter = "alpha(opacity=0)";
  object.style.display = displayStyle;
  object.style.visibility = "visible";
  if (ms) {
    var opacity = 0;
    const timer = setInterval(function () {
      opacity += 50 / ms;
      if (opacity >= 1) {
        clearInterval(timer);
        opacity = 1;
      }
      object.style.opacity = opacity;
      object.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }, 50);
  }
  else {
    object.style.opacity = 1;
    object.style.filter = "alpha(opacity=1)";
  }
}
function fadeOut(object, ms) {
  if (!object) return;
  if (object.style.display === "none") return;
  if (ms) {
    var opacity = 1;
    const timer = setInterval(function () {
      opacity -= 50 / ms;
      if (opacity <= 0) {
        clearInterval(timer);
        opacity = 0;
        object.style.display = "none";
        object.style.visibility = "hidden";
      }
      object.style.opacity = opacity;
      object.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }, 50);
  }
  else {
    object.style.opacity = 0;
    object.style.filter = "alpha(opacity=0)";
    object.style.display = "none";
    object.style.visibility = "hidden";
  }
}
function includeJs(filePath) {
  const js = document.createElement("script");
  js.type = "text/javascript";
  js.src = filePath;
  document.body.appendChild(js);
}