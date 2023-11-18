// This will use the demo backend if you open index.html locally via file://, otherwise your server will be used
let backendUrl =
  location.protocol === "file:"
    ? "https://tiktok-chat-reader.zerody.one/"
    : undefined;
let connection = new TikTokIOConnection(backendUrl);

// Counter
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0;

// These settings are defined by obs.html
if (!window.settings) window.settings = {};

$(document).ready(() => {
  $("#connectButton").click(connect);
  $("#uniqueIdInput").on("keyup", function (e) {
    if (e.key === "Enter") {
      connect();
    }
  });

  if (window.settings.username) connect();
});

function connect() {
  let uniqueId = window.settings.username || $("#uniqueIdInput").val();
  if (uniqueId !== "") {
    $("#stateText").text("Connecting...");

    connection
      .connect(uniqueId, {
        enableExtendedGiftInfo: true,
      })
      .then((state) => {
        $("#stateText").text(`Connected to roomId ${state.roomId}`);

        // reset stats
        viewerCount = 0;
        likeCount = 0;
        diamondsCount = 0;
        updateRoomStats();
      })
      .catch((errorMessage) => {
        $("#stateText").text(errorMessage);

        // schedule next try if obs username set
        if (window.settings.username) {
          setTimeout(() => {
            connect(window.settings.username);
          }, 30000);
        }
      });
  } else {
    alert("no username entered");
  }
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
  return text.replace(/</g, "&lt;");
}

function updateRoomStats() {
  $("#roomStats").html(
    `Viewers: <b>${viewerCount.toLocaleString()}</b> Likes: <b>${likeCount.toLocaleString()}</b> Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b>`
  );
}

function generateUsernameLink(data) {
  return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
}

function isPendingStreak(data) {
  return data.giftType === 1 && !data.repeatEnd;
}

/**
 * Add a new message to the chat container
 */
function addChatItem(color, data, text, summarize) {
  let container = location.href.includes("obs.html")
    ? $(".eventcontainer")
    : $(".chatcontainer");

  if (container.find("div").length > 500) {
    container.find("div").slice(0, 200).remove();
  }

  container.find(".temporary").remove();

  container.append(`
        <div class=${summarize ? "temporary" : "static"}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> 
                <span style="color:${color}">${sanitize(text)}</span>
            </span>
        </div>
    `);

  container.stop();
  container.animate(
    {
      scrollTop: container[0].scrollHeight,
    },
    400
  );
}

/**
 * Add a new gift to the gift container
 */
function addGiftItem(data) {
  let container = location.href.includes("obs.html")
    ? $(".eventcontainer")
    : $(".giftcontainer");

  if (container.find("div").length > 200) {
    container.find("div").slice(0, 100).remove();
  }

  let streakId = data.userId.toString() + "_" + data.giftId;
  switch (data.giftId) {
    // messi
    case 5655:
      spam(1, 1);
      break;
    case 5760:
      spam(1, 1);
      break;
    case 5487:
      spam(1, 5);
      spam(2, 5);
      break;
    case 5659:
      spam(1, 99);
      break;
    case 6671:
      spam(1, 199);
      break;
    case 5731:
      spam(1, 499);
      break;
    case 5587:
      win(1, 1);
      break;
    case 7529:
      win(1, 3);
      break;
    case 6646:
      showWinnerImage(1);
      break;

    //ronaldo
    case 5269:
      spam(2, 1);
      break;
    case 7934:
      spam(2, 1);
      break;
    case 6104:
      spam(1, 99);
      break;
    case 5509:
      spam(1, 199);
      break;
    case 7168:
      spam(1, 500);
      break;
    case 7122:
      spam(1, 500);
      break;
    case 6781:
      win(1, 1);
      break;
    case 6862:
      win(1, 3);
      break;
    case 5767:
      showWinnerImage(2);
    case 7124:
      showWinnerImage(2);
      break;
    case 6369:
        goldViewer(data);
        break;
    // Thêm các trường hợp khác nếu cần
    default:
      // Xử lý trường hợp mặc định nếu không trùng khớp với bất kỳ trường hợp nào
      break;
  }
  let html = `
        <div data-streakid=${isPendingStreak(data) ? streakId : ""}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> <span>${
    data.describe
  }</span><br>
                <div>
                    <table>
                        <tr>
                            <td><img class="gifticon" src="${
                              data.giftPictureUrl
                            }"></td>
                            <td>
                                <span>Name: <b>${data.giftName}</b> (ID:${
    data.giftId
  })<span><br>
                                <span>Repeat: <b style="${
                                  isPendingStreak(data) ? "color:red" : ""
                                }">x${data.repeatCount.toLocaleString()}</b><span><br>
                                <span>Cost: <b>${(
                                  data.diamondCount * data.repeatCount
                                ).toLocaleString()} Diamonds</b><span>
                            </td>
                        </tr>
                    </tabl>
                </div>
            </span>
        </div>
    `;

  let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

  if (existingStreakItem.length) {
    existingStreakItem.replaceWith(html);
  } else {
    container.append(html);
  }

  container.stop();
  container.animate(
    {
      scrollTop: container[0].scrollHeight,
    },
    800
  );
}

// viewer stats
connection.on("roomUser", (msg) => {
  if (typeof msg.viewerCount === "number") {
    viewerCount = msg.viewerCount;
    updateRoomStats();
  }
});

// like stats
connection.on("like", (msg) => {
  if (typeof msg.totalLikeCount === "number") {
    likeCount = msg.totalLikeCount;
    updateRoomStats();
  }

  if (window.settings.showLikes === "0") return;

  if (typeof msg.likeCount === "number") {
    addChatItem(
      "#447dd4",
      msg,
      msg.label
        .replace("{0:user}", "")
        .replace("likes", `${msg.likeCount} likes`)
    );
  }
});

// Member join
let joinMsgDelay = 0;
connection.on("member", (msg) => {
  if (window.settings.showJoins === "0") return;

  let addDelay = 250;
  if (joinMsgDelay > 500) addDelay = 100;
  if (joinMsgDelay > 1000) addDelay = 0;

  joinMsgDelay += addDelay;

  setTimeout(() => {
    joinMsgDelay -= addDelay;
    addChatItem("#21b2c2", msg, "joined", true);
  }, joinMsgDelay);
});

// New chat comment received
connection.on("chat", (msg) => {
  if (window.settings.showChats === "0") return;

  addChatItem("", msg, msg.comment);
});

// New gift received
connection.on("gift", (data) => {
  if (!isPendingStreak(data) && data.diamondCount > 0) {
    diamondsCount += data.diamondCount * data.repeatCount;
    updateRoomStats();
  }

  if (window.settings.showGifts === "0") return;

  addGiftItem(data);
});

// share, follow
connection.on("social", (data) => {
  if (window.settings.showFollows === "0") return;

  let color = data.displayType.includes("follow") ? "#ff005e" : "#2fb816";
  addChatItem(color, data, data.label.replace("{0:user}", ""));
});

connection.on("streamEnd", () => {
  $("#stateText").text("Stream ended.");

  // schedule next try if obs username set
  if (window.settings.username) {
    setTimeout(() => {
      connect(window.settings.username);
    }, 30000);
  }
});

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
  winnerText.style.margin = "0 0 30px 0"

  // Hiển thị container và ảnh người vô địch
  winnerImageContainer.style.display = "block";
}
function goldViewer(data) {
    const winnerImageContainer = document.getElementById("winnerImageContainer");
  const winnerImage = document.getElementById("winnerImage");
  const winnerText = document.getElementById("winnerText");
  const bodyWho = document.getElementById("who");
  bodyWho.style.display = "none";
  winnerImage.src = data.profilePictureUrl
  winnerImage.width = "400"
  winnerText.innerText = `${data.uniqueId} is the GOAT`
  winnerText.style.margin = "0 0 30px 0"
  winnerText.style.color = "yellow"
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
