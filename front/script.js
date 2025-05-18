const game = document.querySelector(".game-container");
const dino = document.getElementById("avatar");

let avatar = localStorage.getItem("avatarSelecionado");
let avatarWidth = parseInt(localStorage.getItem('avatarWidth'));
let avatarHeight = parseInt(localStorage.getItem('avatarHeight'));

if (avatar) {
  dino.style.backgroundImage = `url('${avatar}')`;

  if (avatarWidth && avatarHeight) {
    dino.style.width = avatarWidth + "px";
    dino.style.height = avatarHeight + "px";
  } else {
    dino.style.width = "150px";
    dino.style.height = "150px";
  }
} else {
  console.warn("Nenhum avatar carregado.");
}

let isJumping = false;
let isGameOver = false;
let score = 0;
let record = parseInt(localStorage.getItem("record")) || 0;

const scoreDisplay = document.getElementById("score");
const recordDisplay = document.getElementById("record");
recordDisplay.textContent = "Recorde: " + record;

document.addEventListener("keydown", (e) => {
  const popupAtivo = document.getElementById("popup").classList.contains("active");
  const nomeInputFocused = document.activeElement === document.getElementById("nomeInput");

  if (popupAtivo && nomeInputFocused) {
    return;
  }

  if (isGameOver) {
    restartGame();
    return;
  }
  if (!isJumping) jump();
});

function jump() {
  isJumping = true;
  dino.classList.add("jump");
  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
  }, 800);
}

let lastIndex = -1;

const imagensObstaculos = [
  { imagem: "../images/pedra1.png", width: 70, height: 70, tipo: "pedra" },
  { imagem: "../images/pedra2.png", width: 55, height: 60, tipo: "pedra" },
  { imagem: "../images/arbusto.png", width: 120, height: 70, tipo: "arbusto" },
  { imagem: "../images/tronco.png", width: 130, height: 65, tipo: "tronco" }
];

let lastObstacleTime = 0;

function createObstacle() {
  if (isGameOver) return;

  const now = Date.now();
  const delta = now - lastObstacleTime;
  if (delta < 1200) {
    setTimeout(createObstacle, 1200 - delta);
    return;
  }
  lastObstacleTime = now;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  let idx;
  let tentativas = 0;
  do {
    idx = Math.floor(Math.random() * imagensObstaculos.length);
    tentativas++;
  } while (
    lastIndex >= 0 &&
    (
      imagensObstaculos[lastIndex].tipo === imagensObstaculos[idx].tipo ||
      (
        (imagensObstaculos[lastIndex].tipo === "arbusto" && imagensObstaculos[idx].tipo === "tronco") ||
        (imagensObstaculos[lastIndex].tipo === "tronco" && imagensObstaculos[idx].tipo === "arbusto")
      )
    ) &&
    tentativas < 10
  );
  lastIndex = idx;

  const sel = imagensObstaculos[idx];
  obstacle.style.backgroundImage = `url('${sel.imagem}')`;
  obstacle.style.backgroundSize = "contain";
  obstacle.style.backgroundRepeat = "no-repeat";
  obstacle.style.backgroundPosition = "center";
  obstacle.style.width = `${sel.width}px`;
  obstacle.style.height = `${sel.height}px`;

  game.appendChild(obstacle);

  let obstacleLeft = game.offsetWidth;
  const interval = setInterval(() => {
    if (isGameOver) {
      clearInterval(interval);
      obstacle.remove();
      return;
    }
    obstacleLeft -= 5;
    obstacle.style.left = obstacleLeft + "px";

    const dinoBottom = parseInt(getComputedStyle(dino).bottom);

    if (
      obstacleLeft > 60 &&
      obstacleLeft < 100 &&
      dinoBottom < 150
    ) {
      clearInterval(interval);
      gameOver();
    }
    if (obstacleLeft < -sel.width) {
      clearInterval(interval);
      obstacle.remove();
      score++;
      scoreDisplay.textContent = "Pontuação: " + score;
    }
  }, 20);

  const nextTime = Math.random() * 1500 + 1000;
  setTimeout(createObstacle, nextTime);
}

function gameOver() {
  isGameOver = true;

  if (score > record) {
    record = score;
    localStorage.setItem("record", record);
    recordDisplay.textContent = "Recorde: " + record;
  }

  document.getElementById("popup").classList.add("active");
}

function restartGame() {
  isGameOver = false;
  document.querySelectorAll(".obstacle").forEach(o => o.remove());
  score = 0;
  scoreDisplay.textContent = "Pontuação: " + score;
  lastIndex = -1;
  createObstacle();
}

function enviarRecorde() {
  const nome = document.getElementById("nomeInput").value.trim();
  if (!nome) {
    alert("Por favor, digite um nome.");
    return;
  }

  fetch("http://localhost:5000/usuarios/game/"+nome, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ record: score })
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao enviar recorde");
    return response.json();
  })
  .then(data => {
    console.log("Recorde enviado:", data);
    document.getElementById("popup").classList.remove("active");
    document.getElementById("nomeInput").value = "";
    restartGame();
    window.location.href = 'inicio.html';

  })
  .catch(error => {
    alert("Erro ao enviar recorde: " + error.message);
  });

}

createObstacle();