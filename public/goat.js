const scores = [0, 0, 0, 0];
const wins = [0, 0, 0, 0];
let positions = [0, 0, 0, 0];
const winningScore = 1000;

function showWinnerImage(player) {
  const winnerImageContainer = document.getElementById("winnerImageContainer");
  const winnerImage = document.getElementById("winnerImage");
  const winnerText = document.getElementById("winnerText");
  const bodyWho = document.getElementById("who");
  bodyWho.style.display = "none";
  //   const winningPlayer = getWinningPlayer();

  // Set nguồn ảnh cho thẻ img
  if (player == 1) {
    winnerImage.src = `img/messi.png`;
    winnerText.innerText = "Messi is the GOAT";
  } else {
    winnerImage.src = `img/ronaldo.png`;
    winnerText.innerText = "Ronaldo is the GOAT";
  }

  // Hiển thị container và ảnh người vô địch
  winnerImageContainer.style.display = "block";
}
function win(player, win) {
  const winsElement = document.getElementById("wins" + player);
  wins[player - 1] += win;
  winsElement.innerText = wins[player - 1];
}
function spam(player, score) {
  const icon = document.getElementById("icon" + player);
  const scoreElement = document.getElementById("score" + player);
  const winsElement = document.getElementById("wins" + player);

  // Di chuyển biểu tượng cố định 10px sang phải mỗi lần spam
  positions[player - 1] += score;
  icon.style.left = positions[player - 1] + "px";

  // Cập nhật điểm số và hiển thị
  scores[player - 1] += score;
  scoreElement.innerText = scores[player - 1];

  // Kiểm tra nếu người chơi đạt 100 điểm, đánh dấu vô địch
  if (scores[player - 1] >= winningScore) {
    wins[player - 1]++;
    winsElement.innerText = wins[player - 1];
    // alert(`Player ${player} vô địch!`);
    resetAllIcons();
  }
}
function resetAllIcons() {
  for (let i = 1; i <= 4; i++) {
    const icon = document.getElementById("icon" + i);
    const scoreElement = document.getElementById("score" + i);

    // Reset vị trí của biểu tượng
    positions[i - 1] = 0;
    icon.style.left = positions[i - 1] + "px";

    // Reset điểm số của người chơi
    scores[i - 1] = 0;
    scoreElement.innerText = scores[i - 1];
  }
}
