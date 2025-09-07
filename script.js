let board, currentPlayer, gameActive, aiMode;
const human = "X";
const ai = "O";

// Initialize and render board
function startGame(vsAI) {
  board = Array(9).fill("");
  currentPlayer = human;
  gameActive = true;
  aiMode = vsAI;
  document.getElementById("status").textContent = "Current: " + currentPlayer;
  document.getElementById("board").innerHTML = '';
  document.getElementById("restart").style.display = "none";
  for (let i = 0; i < 9; i++) {
    let btn = document.createElement("button");
    btn.className = "square";
    btn.id = "square" + i;
    btn.onclick = () => squareClick(i);
    document.getElementById("board").appendChild(btn);
  }
}

// Handle a move
function squareClick(index) {
  if (!gameActive || board[index]) return;
  move(index, currentPlayer);
  if (checkWinner(board, currentPlayer)) {
    endGame(currentPlayer + " wins!");
    return;
  }
  if (board.every(x => x)) {
    endGame("It's a draw!");
    return;
  }
  currentPlayer = (currentPlayer === human) ? ai : human;
  document.getElementById("status").textContent = "Current: " + currentPlayer;
  
  if (aiMode && currentPlayer === ai && gameActive) {
    setTimeout(() => {
      let aiMove = minimax(board, ai).index;
      move(aiMove, ai);
      if (checkWinner(board, ai)) {
        endGame(ai + " wins!");
        return;
      }
      if (board.every(x => x)) {
        endGame("It's a draw!");
        return;
      }
      currentPlayer = human;
      document.getElementById("status").textContent = "Current: " + currentPlayer;
    }, 400);
  }
}

function move(index, player) {
  board[index] = player;
  document.getElementById("square" + index).textContent = player;
  document.getElementById("square" + index).disabled = true;
}

function endGame(msg) {
  gameActive = false;
  document.getElementById("status").textContent = msg;
  document.getElementById("restart").style.display = "inline-block";
  for (let i = 0; i < 9; i++) {
    document.getElementById("square" + i).disabled = true;
  }
}

// Returns true if player wins
function checkWinner(b, player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => b[i] === player));
}

// Minimax AI
function minimax(newBoard, player) {
  const empty = newBoard.map((v, i) => v ? null : i).filter(v => v !== null);
  if (checkWinner(newBoard, human)) return {score: -10};
  if (checkWinner(newBoard, ai)) return {score: 10};
  if (empty.length === 0) return {score: 0};

  let moves = [];
  for (let i of empty) {
    let move = {};
    move.index = i;
    newBoard[i] = player;
    if (player === ai) {
      let result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }
    newBoard[i] = "";
    moves.push(move);
  }
  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestMove = i;
        bestScore = moves[i].score;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestMove = i;
        bestScore = moves[i].score;
      }
    }
  }
  return moves[bestMove];
}

// Start in two-player mode initially
window.onload = () => startGame(false);
