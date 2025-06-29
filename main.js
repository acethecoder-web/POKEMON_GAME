/* these are the codes to create the tile maps */
const map = document.getElementById("game-map");
const grid = [];
const MAP_SIZE = 100;

for (let i = 0; i < MAP_SIZE; i++) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  map.appendChild(tile);
  grid.push(tile);
}

// display my player at the box 1
let playerIndex = 44;
const playerSprite = document.createElement("div");
playerSprite.classList.add("character");
playerSprite.style.backgroundImage =
  "url('./character_animation/idle/frame_1.png')";
grid[playerIndex].appendChild(playerSprite);

// this is used to display the opponents
const opponentIndices = [4, 40, 49, 94];
const opponentSprites = [];

opponentIndices.forEach((index, i) => {
  const opponent = document.createElement("div");
  opponent.classList.add("opponent");
  opponent.style.backgroundImage = `url('./opponent_${i}/frame_1.png')`;
  opponent.dataset.id = `opponent-${i}`; // Optional: give each a unique ID
  grid[index].appendChild(opponent);
  opponentSprites.push(opponent); // Store for later use
});

// functions to animate the walking of my character

// going right
function changetoright() {
  let frame = 0;
  const maxframe = 11;
  const animationInterval = setInterval(() => {
    playerSprite.style.backgroundImage = `url('./character_animation/animation_right/frame_${frame}.png')`;
    frame++;
    if (frame > maxframe) {
      clearInterval(animationInterval);
    }
  }, 50);
}

// going left
function changetoleft() {
  let frame = 0;
  const maxframe = 11;
  const animationInterval = setInterval(() => {
    playerSprite.style.backgroundImage = `url('./character_animation/animation_left/frame_${frame}.png')`;
    frame++;
    if (frame > maxframe) {
      clearInterval(animationInterval);
    }
  }, 50);
}

// going up
function changetoup() {
  let frame = 0;
  const maxframe = 11;
  const animationInterval = setInterval(() => {
    playerSprite.style.backgroundImage = `url('./character_animation/animation_up/frame_${frame}.png')`;
    frame++;
    if (frame > maxframe) {
      clearInterval(animationInterval);
    } else {
      playerSprite.style.backgroundImage = `url('./character_animation/idle/frame_1.png')`;
    }
  }, 10);
}

// going down
function changetodown() {
  let frame = 0;
  const maxframe = 12;
  const animationInterval = setInterval(() => {
    playerSprite.style.backgroundImage = `url('./character_animation/animation_down/frame_${frame}.png')`;
    frame++;
    if (frame > maxframe) {
      clearInterval(animationInterval);
    }
  }, 50);
}

/* this is the controller of the character */
document.addEventListener("keydown", (e) => {
  const oldIndex = playerIndex;
  let newIndex = playerIndex;

  if (e.key === "ArrowRight" && (playerIndex + 1) % 10 !== 0) {
    newIndex++;
  } else if (e.key === "ArrowLeft" && playerIndex % 10 !== 0) {
    newIndex--;
  } else if (e.key === "ArrowUp" && playerIndex >= 10) {
    newIndex -= 10;
  } else if (e.key === "ArrowDown" && playerIndex < 90) {
    newIndex += 10;
  }

  // Don't move if newIndex is in a forbidden tile
  if (opponentIndices.includes(newIndex)) return;

  // If it's a valid new position, move and animate
  if (newIndex !== playerIndex) {
    playerIndex = newIndex;

    // Animation based on key
    if (e.key === "ArrowRight") changetoright();
    else if (e.key === "ArrowLeft") changetoleft();
    else if (e.key === "ArrowUp") changetoup();
    else if (e.key === "ArrowDown") changetodown();

    grid[oldIndex].removeChild(playerSprite);
    grid[playerIndex].appendChild(playerSprite);

    checkNearbyOpponent();
  }
});

// this is for the updating of the contents of the message box
// Opponent names (simple map)
function getOpponentData(tileNumber) {
  if (tileNumber === 4)
    return {
      name: "Renji",
      record: "80 Wins, 10 Defeats",
      fight: "FIGHT",
    };
  if (tileNumber === 40)
    return {
      name: "Haruko",
      record: "60 Wins, 30 Defeats",
      fight: "FIGHT",
    };
  if (tileNumber === 49)
    return {
      name: "Takeshi",
      record: "53 Wins, 36 Defeats",
      fight: "FIGHT",
    };
  if (tileNumber === 94)
    return {
      name: "Ayamitso",
      record: "28 Wins, 13 Defeats",
      fight: "FIGHT",
    };
  return {
    name: "",
    record: "",
    fight: "",
  };
}

// Check if player is next to an opponent
function checkNearbyOpponent() {
  // Get tiles next to the player
  let nearbyTiles = [
    playerIndex - 1, // left
    playerIndex + 1, // right
    playerIndex - 10, // up
    playerIndex + 10, // down
  ];

  // Check if any opponent is in nearby tiles
  let foundOpponent = null;

  for (let i = 0; i < opponentIndices.length; i++) {
    if (nearbyTiles.includes(opponentIndices[i])) {
      foundOpponent = opponentIndices[i];
      break;
    }
  }

  // Show inforamation in the message box
  const nameBox = document.getElementById("name-container");
  const recordBox = document.getElementById("records");
  const fightBox = document.getElementById("fight");

  if (foundOpponent !== null) {
    const data = getOpponentData(foundOpponent);
    nameBox.textContent = data.name;
    recordBox.textContent = data.record;
    fightBox.textContent = data.fight;
  } else {
    nameBox.textContent = ""; // Clear when no one is nearby
    recordBox.textContent = "";
    fightBox.textContent = "";
  }
}

// music and sound fx sectionsss
window.onload = function () {
  // Play music
  document.getElementById("music").play();
};

// saving of partner pokemon sa local storage

function selectPokemonAndNavigate(event, imagePath) {
  event.preventDefault(); // prevent immediate navigation

  localStorage.setItem("selectedPokemon", imagePath);

  // then navigate manually
  window.location.href = "./index2.html";
}

// Add click event to fight box
const fightBox = document.getElementById("fight");

fightBox.addEventListener("click", () => {
  const nameBox = document.getElementById("name-container");
  const opponentName = nameBox.textContent;

  // If there is an opponent name, start battle
  if (opponentName && opponentName !== "") {
    localStorage.setItem("opponentName", opponentName);
    window.location.href = "battle.html";
  }
});

function finishTournament() {
  const opponents = ["Renji", "Haruko", "Takeshi", "Ayamitso"];
  const foughtList = JSON.parse(localStorage.getItem("foughtOpponents")) || [];

  // Filter out the ones you already fought (Ace fights)
  const remainingOpponents = opponents;

  // Run round robin simulation among opponents only
  for (let i = 0; i < remainingOpponents.length; i++) {
    for (let j = i + 1; j < remainingOpponents.length; j++) {
      const oppA = remainingOpponents[i];
      const oppB = remainingOpponents[j];

      const winner = Math.random() < 0.5 ? oppA : oppB;
      const loser = winner === oppA ? oppB : oppA;

      updateOpponentRecords(winner, loser);
    }
  }

  // Mark tournament as done
  localStorage.setItem("tournamentFinished", "true");

  // Redirect to records page
  window.location.href = "records.html";
}

function updateOpponentRecords(winner, loser) {
  const winnerKey = `record_${winner}`;
  const loserKey = `record_${loser}`;

  let winnerRecord = JSON.parse(localStorage.getItem(winnerKey)) || {
    wins: 0,
    losses: 0,
  };
  let loserRecord = JSON.parse(localStorage.getItem(loserKey)) || {
    wins: 0,
    losses: 0,
  };

  winnerRecord.wins += 1;
  loserRecord.losses += 1;

  localStorage.setItem(winnerKey, JSON.stringify(winnerRecord));
  localStorage.setItem(loserKey, JSON.stringify(loserRecord));
}
