const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const grid = 20;

let snake, direction, food, bomb, score, game;

/* Fruit Types */
const fruits = [
  { emoji: "🍎", score: 1 },
  { emoji: "🍌", score: 2 },
  { emoji: "🍒", score: 3 }
];

/* Initialize Game */
function init() {
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  food = spawnFood();
  bomb = spawnBomb();
  document.getElementById("score").innerText = score;

  clearInterval(game);
  game = setInterval(draw, 140);
}

/* Controls */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

/* Restart Button */
document.getElementById("restartBtn").addEventListener("click", init);

/* Main Game Loop */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Draw Snake */
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#00ffe0" : "#00aa88";
    ctx.fillRect(s.x * box, s.y * box, box, box);
  });

  /* Draw Food & Bomb */
  ctx.font = "18px Arial";
  ctx.fillText(food.emoji, food.x * box + 2, food.y * box + 18);
  ctx.fillText("💣", bomb.x * box + 2, bomb.y * box + 18);

  let head = { ...snake[0] };
  if (direction === "LEFT") head.x--;
  if (direction === "UP") head.y--;
  if (direction === "RIGHT") head.x++;
  if (direction === "DOWN") head.y++;

  /* Collision Detection */
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= grid || head.y >= grid ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(game);
    setTimeout(() => alert("Game Over! Score: " + score), 50);
    return;
  }

  /* Eat Food */
  if (head.x === food.x && head.y === food.y) {
    score += food.score;
    document.getElementById("score").innerText = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  /* Eat Bomb */
  if (head.x === bomb.x && head.y === bomb.y) {
    const penalty = Math.random() < 0.5 ? 2 : 3;
    score = Math.max(0, score - penalty);
    document.getElementById("score").innerText = score;

    for (let i = 0; i < penalty && snake.length > 1; i++) {
      snake.pop();
    }
    bomb = spawnBomb();
  }

  snake.unshift(head);
}

/* Helpers */
function randomPos() {
  return {
    x: Math.floor(Math.random() * grid),
    y: Math.floor(Math.random() * grid)
  };
}

function spawnFood() {
  let pos;
  do {
    pos = randomPos();
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));

  const fruit = fruits[Math.floor(Math.random() * fruits.length)];
  return { ...pos, emoji: fruit.emoji, score: fruit.score };
}

function spawnBomb() {
  let pos;
  do {
    pos = randomPos();
  } while (
    snake.some(s => s.x === pos.x && s.y === pos.y) ||
    (food && pos.x === food.x && pos.y === food.y)
  );
  return pos;
}

/* Start Game */
init();
