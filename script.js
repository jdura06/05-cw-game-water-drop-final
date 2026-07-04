// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerMaker; // Will store our timer countdown interval
let score = 0; // Tracks the player's score
let timeLeft = 40; // Game duration in seconds
let currentDifficulty = "easy";
let targetScore = 20;

const difficultySettings = {
  easy: { dropInterval: 1000, dropDuration: "4s", targetScore: 20 },
  medium: { dropInterval: 700, dropDuration: "3s", targetScore: 20 },
  hard: { dropInterval: 500, dropDuration: "2.5s", targetScore: 25 }
};

const winningMessages = [
  "You win! Great job!",
  "Amazing catch rate! You won!",
  "Champion! You hit the target score!"
];

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("game-message");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

startBtn.addEventListener("click", startGame);

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
});

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  targetScore = difficultySettings[difficulty].targetScore;

  difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.difficulty === difficulty);
  });
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  const selectedDifficulty = difficultySettings[currentDifficulty];

  gameRunning = true;
  score = 0;
  timeLeft = 40;
  targetScore = selectedDifficulty.targetScore;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  messageEl.textContent = "";
  startBtn.disabled = true;
  gameContainer.querySelectorAll(".water-drop, .obstacle-drop").forEach((drop) => drop.remove());

  dropMaker = setInterval(createDrop, selectedDifficulty.dropInterval);
  timerMaker = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (!gameRunning) return;

  timeLeft -= 1;
  timeEl.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  if (!gameRunning) return;

  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerMaker);
  startBtn.disabled = false;

  const endingMessage = score >= targetScore
    ? winningMessages[Math.floor(Math.random() * winningMessages.length)]
    : `Try again! Reach ${targetScore} drops to win.`;

  messageEl.textContent = endingMessage;
  gameContainer.querySelectorAll(".water-drop, .obstacle-drop").forEach((drop) => drop.remove());

  if (score >= targetScore) {
    showConfetti();
  }
}

function showConfetti() {
  const colors = ["#FFC907", "#2E9DF7", "#8BD1CB", "#FF902A", "#F5402C", "#159A48", "#F16061"];
  const confettiCount = 30;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    confetti.style.width = `${6 + Math.random() * 8}px`;
    confetti.style.height = `${6 + Math.random() * 8}px`;
    confetti.style.opacity = `${0.7 + Math.random() * 0.3}`;
    gameContainer.appendChild(confetti);

    confetti.addEventListener("animationend", () => confetti.remove());
  }
}

function createDrop() {
  const selectedDifficulty = difficultySettings[currentDifficulty];
  const isObstacle = Math.random() < 0.18;

  // Create a new div element that will be our drop or obstacle
  const drop = document.createElement("div");
  drop.className = isObstacle ? "obstacle-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Apply the chosen difficulty's drop speed
  drop.style.animationDuration = selectedDifficulty.dropDuration;

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // When a drop is clicked, increase or decrease score and remove it
  drop.addEventListener("click", () => {
    if (drop.classList.contains("obstacle-drop")) {
      score -= 1;
    } else {
      score += 1;
    }

    scoreEl.textContent = score;
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
