  // Game variables
      let snake, food, dx, dy, score, gameSpeed, gridSize, tileCount;
      let gameLoop;
      let highScore = localStorage.getItem("snakeHighScore") || 0;
      let snakeColor = "#4fff4f";
      let foodColor = "#ff4f4f";

      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");
      const scoreElement = document.getElementById("score");
      const highScoreElement = document.getElementById("highScore");
      const gameOverElement = document.getElementById("gameOver");

      // Initialize game settings
      function initGame() {
        snake = [{ x: 10, y: 10 }];
        food = { x: 15, y: 15 };
        dx = 0;
        dy = 0;
        score = 0;
        gameSpeed = parseInt(document.getElementById("gameSpeed").value);
        gridSize = parseInt(document.getElementById("gridSize").value);
        tileCount = canvas.width / gridSize;
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
      }

      // Game controls
      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowUp":
            if (dy === 0) {
              dx = 0;
              dy = -1;
            }
            break;
          case "ArrowDown":
            if (dy === 0) {
              dx = 0;
              dy = 1;
            }
            break;
          case "ArrowLeft":
            if (dx === 0) {
              dx = -1;
              dy = 0;
            }
            break;
          case "ArrowRight":
            if (dx === 0) {
              dx = 1;
              dy = 0;
            }
            break;
        }
      });

      // Game loop
      function drawGame() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          score += 10;
          scoreElement.textContent = score;
          if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem("snakeHighScore", highScore);
          }
          generateFood();
        } else {
          snake.pop();
        }

        if (
          head.x < 0 ||
          head.x >= tileCount ||
          head.y < 0 ||
          head.y >= tileCount ||
          snake
            .slice(1)
            .some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          gameOver();
          return;
        }

        ctx.fillStyle = snakeColor;
        snake.forEach((segment) => {
          ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
          );
        });

        ctx.fillStyle = foodColor;
        ctx.fillRect(
          food.x * gridSize,
          food.y * gridSize,
          gridSize - 2,
          gridSize - 2
        );
      }

      function generateFood() {
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
        while (
          snake.some((segment) => segment.x === food.x && segment.y === food.y)
        ) {
          food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
          };
        }
      }

      function gameOver() {
        clearInterval(gameLoop);
        gameOverElement.style.display = "block";
        setTimeout(() => {
          if (confirm("GAME OVER! Play again?")) {
            resetGame();
          } else {
            showMenu();
          }
        }, 1000);
      }

      function resetGame() {
        gameOverElement.style.display = "none";
        initGame();
        gameLoop = setInterval(drawGame, gameSpeed);
      }

      // UI Navigation
      function showMenu() {
        document.getElementById("menu-container").style.display = "block";
        document.getElementById("settings-container").style.display = "none";
        document.getElementById("game-container").style.display = "none";
        clearInterval(gameLoop);
      }

      function showSettings() {
        document.getElementById("menu-container").style.display = "none";
        document.getElementById("settings-container").style.display = "block";
        document.getElementById("game-container").style.display = "none";
      }

      function startGame() {
        document.getElementById("menu-container").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        resetGame();
      }

      function applySettings() {
        snakeColor = document.getElementById("snakeColor").value;
        foodColor = document.getElementById("foodColor").value;
        gameSpeed = parseInt(document.getElementById("gameSpeed").value);
        gridSize = parseInt(document.getElementById("gridSize").value);
        tileCount = canvas.width / gridSize;

        // Clear any existing game loop
        clearInterval(gameLoop);

        // Hide settings and show game
        document.getElementById("settings-container").style.display = "none";
        document.getElementById("game-container").style.display = "block";

        // Start fresh game with new settings
        resetGame();
      }

      // Initialize high score display
      highScoreElement.textContent = highScore;
