const startGame = function () {
  fadeOut(mainMenu, fadeOutTime);
  htmlLevel.innerHTML = "STAGE " + (gameLevel + 1);
  fadeIn(gameArea, fadeInTime, "block");
  if (playing === false) playing = true;
  drawGame();
}
const drawGame = function () {
  const gameSizeX = (function () {
    let maxSizeX = 0;
    for (let i = 0; i < wallsData[gameLevel].length; i++) {
      if (wallsData[gameLevel][i][0] > maxSizeX) maxSizeX = wallsData[gameLevel][i][0];
    }
    return pixelSize * (maxSizeX + 1);
  })();
  const gameSizeY = (function () {
    let maxSizeY = 0;
    for (let i = 0; i < wallsData[gameLevel].length; i++) {
      if (wallsData[gameLevel][i][1] > maxSizeY) maxSizeY = wallsData[gameLevel][i][1];
    }
    return pixelSize * (maxSizeY + 1);
  })();
  canvas.width = gameSizeX;
  canvas.height = gameSizeY;
  context.clearRect(0, 0, gameSizeX, gameSizeY);
  for (let i = 0; i < wallsData[gameLevel].length; i++) {
    context.drawImage(wallImage, wallsData[gameLevel][i][0] * pixelSize, wallsData[gameLevel][i][1] * pixelSize, pixelSize, pixelSize);
  }
  for (let i = 0; i < ballsData[gameLevel].length; i++) {
    context.drawImage(ballImage, ballsData[gameLevel][i][0] * pixelSize, ballsData[gameLevel][i][1] * pixelSize, pixelSize, pixelSize);
  }
  for (let i = 0; i < goalsData[gameLevel].length; i++) {
    context.drawImage(goalImage, goalsData[gameLevel][i][0] * pixelSize, goalsData[gameLevel][i][1] * pixelSize, pixelSize, pixelSize);
  }
  context.drawImage(playerImage, playerData[gameLevel][0] * pixelSize, playerData[gameLevel][1] * pixelSize, pixelSize, pixelSize);
  if (solved(ballsData[gameLevel], goalsData[gameLevel])) {
    levelUp();
  }
}
const keyboardInput = function (key) {
  if (playing === false) return;
  if (key.keyCode < 37 || key.keyCode > 40) return;
  canMove(wallsData[gameLevel], ballsData[gameLevel], playerData[gameLevel], key.keyCode);
}
const canMove = function (wallArray, ballArray, playerArray, key) {
  const [x, y] = (function () {
    if (key === 37) return [-1, 0];
    if (key === 38) return [0, -1];
    if (key === 39) return [1, 0];
    if (key === 40) return [0, 1];
    else return [0, 0];
  })();
  for (let i = 0; i < wallArray.length; i++) {
    if (wallArray[i][0] === playerArray[0] + x && wallArray[i][1] === playerArray[1] + y) return;
  }
  for (let i = 0; i < ballArray.length; i++) {
    if (ballArray[i][0] === playerArray[0] + x && ballArray[i][1] === playerArray[1] + y) {
      const ballMoveX = i;
      for (let j = 0; j < wallArray.length; j++) {
        if (wallArray[j][0] === playerArray[0] + 2 * x && wallArray[j][1] === playerArray[1] + 2 * y) return;
      }
      for (let j = 0; j < ballArray.length; j++) {
        if (ballArray[j][0] === playerArray[0] + 2 * x && ballArray[j][1] === playerArray[1] + 2 * y) return;
      }
      movePlayer(playerArray, x, y, ballArray[ballMoveX]);
      return;
    }
  }
  movePlayer(playerArray, x, y);
}
const movePlayer = function (playerArray, x, y, ballMoveArray) {
  // if (5 <= previousMove.length) previousMove.shift(); // limit undo
  previousMove.push([playerArray[0], playerArray[1]]);
  if (arguments.length === 4) {
    previousMove[previousMove.length - 1].push(ballMoveArray);
    ballMoveArray[0] += x;
    ballMoveArray[1] += y;
  }
  playerArray[0] += x;
  playerArray[1] += y;
  drawGame();
  if (solved(ballsData[gameLevel], goalsData[gameLevel]) === true) levelUp();
}
const undoMove = function () {
  if (previousMove.length === 0) return;
  const undo = previousMove.pop();
  if (undo.length === 3) {
    for (let i = 0; i < ballsData[gameLevel].length; i++) {
      if (ballsData[gameLevel][i][0] === undo[2][0] && ballsData[gameLevel][i][1] === undo[2][1]) {
        ballsData[gameLevel][i][0] = playerData[gameLevel][0];
        ballsData[gameLevel][i][1] = playerData[gameLevel][1];
      }
    }
  }
  playerData[gameLevel][0] = undo[0];
  playerData[gameLevel][1] = undo[1];
  drawGame();
}
const resetLevel = function (level) {
  if (arguments.length === 0) level = gameLevel;
  for (let i = 0; i < initialLevel[level][0].length; i++) {
    ballsData[level][i][0] = initialLevel[level][0][i][0];
    ballsData[level][i][1] = initialLevel[level][0][i][1];
  }
  playerData[level][0] = initialLevel[level][1][0];
  playerData[level][1] = initialLevel[level][1][1];
  previousMove.length = 0;
  if (playing === true) drawGame();
}
const solved = function (ballArray, goalArray) {
  let count = 0;
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = 0; j < goalArray.length; j++) {
      if (goalArray[j][0] === ballArray[i][0] && goalArray[j][1] === ballArray[i][1]) count++;
    }
  }
  if (count === goalArray.length) return true;
  return false;
}
const levelUp = function () {
  if (playing === false || solved(ballsData[gameLevel], goalsData[gameLevel]) === false) return;
  playing = false;
  if (gameLevel === highestLevel) highestLevel++;
  else if (gameLevel > highestLevel) {
    console.log("Cheat Detected!");
    location.reload(true);
  }
  if (gameLevel + 1 === playerData.length) {
    playing = true;
    fadeOut(gameArea, fadeOutTime);
    fadeIn(gameFinished, fadeInTime, "block");
  }
  else {
    goToStageButton.item(gameLevel + 1).style.background = "rgb(255, 225, 50)";
    fadeOut(gameArea, fadeOutTime);
    fadeIn(nextLevel, fadeInTime, "block");
  }
}


const fadeIn = function (object, ms, displayStyle) {
  if (!object) return;
  // if (object.style.display !== "none") return;
  if (arguments.length === 2) displayStyle = "inline-block";
  object.style.opacity = 0;
  object.style.filter = "alpha(opacity=0)";
  object.style.display = displayStyle;
  object.style.visibility = "visible";
  if (ms) {
    let opacity = 0;
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
const fadeOut = function (object, ms) {
  if (!object) return;
  if (object.style.display === "none") return;
  if (ms) {
    let opacity = 1;
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
const includeJs = function (filePath) {
  const js = document.createElement("script");
  js.type = "text/javascript";
  js.src = filePath;
  document.body.appendChild(js);
}


includeJs("levelData.js");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const stageSelectButton = document.getElementById("stageSelectButton");
const stageSelect = document.getElementById("stageSelect");
const backToMenuButton = document.getElementById("backToMenuButton");
const undoButton = document.getElementById("undoButton");
const resetStageButton = document.getElementById("resetStageButton");
const backToTitleButton = document.getElementById("backToTitleButton");
const nextLevelButton = document.getElementById("nextLevelButton");
const nextLevel = document.getElementById("nextLevel");
const htmlLevel = document.getElementById("gameLevel");
const htmlGameVersion = document.getElementById("gameVersion");
const goToStageButton = document.getElementsByClassName("goToStageButton");
const gameFinished = document.getElementById("gameFinished");
const gameFinishedButton = document.getElementById("gameFinishedButton");
const gameVersion = "dlatl_rkdnl"
const fadeOutTime = 200;
const fadeInTime = 600;
const wallImage = new Image;
const ballImage = new Image;
const goalImage = new Image;
const playerImage = new Image;
const previousMove = new Array;
const currentStage = new Array;
const pixelSize = document.body.clientWidth * 4 < document.body.clientHeight * 3 ? document.body.clientWidth * 0.078 : document.body.clientHeight * 0.065;
let playing = false;
let gameLevel = 0;
let highestLevel = 0;


if (document) {
  wallImage.src = "images/wallImage.png";
  ballImage.src = "images/ballImage.png";
  goalImage.src = "images/goalImage.png";
  playerImage.src = "images/playerImage.png";
  htmlGameVersion.innerHTML = gameVersion;
  goToStageButton.item(0).style.background = "rgb(255, 225, 50)";
  for (let i = 0; i < goToStageButton.length; i++) {
    goToStageButton.item(i).innerHTML = i + 1;
    goToStageButton.item(i).addEventListener("click", function () {
      if (playing === true) return;
      if (this.innerHTML - 1 <= highestLevel) {
        fadeOut(stageSelect, fadeOutTime);
        resetLevel();
        gameLevel = this.innerHTML - 1;
        resetLevel();
        startGame();
      }
    });
  }
  fadeIn(mainMenu, fadeInTime);
  startButton.addEventListener("click", function () {
    startGame();
  });
  document.addEventListener("keydown", keyboardInput, false);
  stageSelectButton.addEventListener("click", function () {
    fadeOut(mainMenu, fadeOutTime);
    fadeIn(stageSelect, fadeInTime);
  });
  backToMenuButton.addEventListener("click", function () {
    if (playing === true) {
      playing = false;
      fadeOut(gameArea, fadeOutTime);
      fadeIn(mainMenu, fadeInTime);
    }
  });
  undoButton.addEventListener("click", function () {
    if (playing === true) {
      undoMove();
    }
  });
  resetStageButton.addEventListener("click", function () {
    if (playing === true) {
      resetLevel();
    }
  })
  backToTitleButton.addEventListener("click", function () {
    if (playing === true) playing = false;
    playing = false;
    fadeOut(stageSelect, fadeOutTime);
    fadeIn(mainMenu, fadeInTime);
  });
  nextLevelButton.addEventListener("click", function () {
    if (playing === false) {
      fadeOut(nextLevel, fadeOutTime);
      resetLevel(++gameLevel);
      startGame();
      playing = true;
    }
  })
  gameFinishedButton.addEventListener("click", function () {
    if (playing === true) {
      fadeOut(gameFinished, fadeOutTime);
      fadeIn(mainMenu, fadeInTime);
      gameLevel = 0;
      resetLevel();
      playing = false;
    }
  })
}