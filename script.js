const game = document.querySelector(".game");
const dino = document.getElementById("dino");

let isJumping = false;
let isGameOver = false;
let score = 0;
const scoreDisplay = document.getElementById("score");

document.addEventListener("keydown", () => {
  if (isGameOver) {
    restartGame();
    return;
  }

  if (!isJumping) {
    jump();
  }
});

function jump() {
  isJumping = true;
  dino.classList.add("jump");
  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
  }, 500);
}

let lastObstacleTime = 0;

function createObstacle() {
  if (isGameOver) return;

  const now = Date.now();
  const timeSinceLast = now - lastObstacleTime;

  // Tempo mínimo de 1.2 segundos entre obstáculos
  if (timeSinceLast < 1200) {
    const waitTime = 1200 - timeSinceLast;
    setTimeout(createObstacle, waitTime);
    return;
  }

  lastObstacleTime = now;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  game.appendChild(obstacle);

  let obstacleLeft = game.offsetWidth;
  let obstacleInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(obstacleInterval);
      obstacle.remove();
      return;
    }

    obstacleLeft -= 5;
    obstacle.style.left = obstacleLeft + "px";

    const dinoBottom = parseInt(getComputedStyle(dino).getPropertyValue("bottom"));

    if (
      obstacleLeft > 50 &&
      obstacleLeft < 90 &&
      dinoBottom < 30
    ) {
      clearInterval(obstacleInterval);
      gameOver();
    }

    if (obstacleLeft < -30) {
        clearInterval(obstacleInterval);
        obstacle.remove();
      
        score++;
        scoreDisplay.textContent = "Pontuação: " + score;
      }
      
  }, 20);

  // Gera o próximo obstáculo com um tempo aleatório adicional
  const nextTime = Math.random() * 1500 + 1000; // entre 1s e 2.5s
  setTimeout(createObstacle, nextTime);
}

function gameOver() {
  isGameOver = true;
  score = 0;
  alert("Game Over! Pressione qualquer tecla para recomeçar.");
}

function restartGame() {
  isGameOver = false;
  document.querySelectorAll(".obstacle").forEach(o => o.remove());
  createObstacle();
}

createObstacle();