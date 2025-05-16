const game = document.querySelector(".game");
const dino = document.getElementById("dino");

let isJumping = false;
let isGameOver = false;
let score = 0;
let api = "http://localhost:5000";
const scoreDisplay = document.getElementById("score");

verificarLoginCache();

function verificarLoginCache() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
  
    if (!usuario) {
      window.location.href = "login.html";
      return;
    }
  
    fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senha: usuario.senha,
        email: usuario.email
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
      } else {
        console.log("Usuário autenticado com sucesso:", data);
        // opcional: atualizar dados salvos no localStorage
        localStorage.setItem("usuario", JSON.stringify(data));
      }
    })
    .catch(() => {
      alert("Erro ao verificar login");
      window.location.href = "login.html";
    });
  }
  
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
      console.log(score)
      gameOver();
    }

    if (obstacleLeft < -30) {
        clearInterval(obstacleInterval);
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
  console.log(score)

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  console.log("Recorde atual:", usuario.usuario.record);
  if (Number( score) >= Number( usuario.usuario.record)) {
    usuario.usuario.record = score;
    localStorage.setItem("usuario", JSON.stringify(usuario));
    console.log("Novo recorde:", score);

    fetch(`${api}/usuarios/${usuario.usuario.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: usuario.usuario.id,
        nome: usuario.usuario.nome,
        email: usuario.usuario.email,
        senha: usuario.usuario.senha,
        record: score })
    })
    .then(r => r.json())
    .then(data => {
      console.log("Recorde atualizado no backend:", data);
      alert(`Novo recorde! ${score} pontos. Pressione qualquer tecla para recomeçar.`);
    })
    .catch(err => {
      console.error("Erro ao atualizar recorde:", err);
      alert("Erro ao salvar novo recorde. Pressione qualquer tecla para recomeçar.");
    });
  } else {
    alert(`Game Over! Sua pontuação: ${score}. Pressione qualquer tecla para recomeçar.`);
  }

  score = 0;
}

function restartGame() {
  isGameOver = false;
  document.querySelectorAll(".obstacle").forEach(o => o.remove());
  createObstacle();
}

function criarUsuario() {
    fetch(`${api}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        idade: document.getElementById("idade").value
      })
    })
    .then(r => r.json())
    .then(d => alert("Usuário criado: " + JSON.stringify(d)));
  }

  function fazerLogin( email, senha ) {
    fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: document.getElementById("loginNome").value,
        email: email
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.erro) {
        alert("Usuário não encontrado");
      } else {
        alert("Login OK: " + JSON.stringify(d));
      }
    });
  }

  function atualizarRecorde() {
    const id = document.getElementById("userId").value;
    const recorde = document.getElementById("novoRecorde").value;

    fetch(`${api}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recorde: parseInt(recorde) })
    })
    .then(r => r.json())

  }

  function listarUsuarios() {
    fetch(`${api}/usuarios`)
      .then(r => r.json())
      .then(data => {
        return data
      });
  }

  function verRanking() {
    fetch(`${api}/usuarios/ordenar-record`)
      .then(r => r.json())
      .then(data => {
        return data
      });
  }

createObstacle();