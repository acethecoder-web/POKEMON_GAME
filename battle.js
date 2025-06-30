// List of opponent Pokémon
const opponentPokemonList = [
  "./other__pokemons/blastoise-removebg-preview.png",
  "./other__pokemons/charizard-removebg-preview.png",
  "./other__pokemons/groudon-removebg-preview.png",
  "./other__pokemons/kyogre-removebg-preview.png",
  "./other__pokemons/machomp-removebg-preview.png",
  "./other__pokemons/mewtwo-removebg-preview.png",
  "./other__pokemons/piplup-removebg-preview.png",
  "./other__pokemons/rayquaza-removebg-preview.png",
  "./other__pokemons/vaporeon-removebg-preview.png",
  "./other__pokemons/venosaur-removebg-preview.png",
];

// save opponent info

function startBattleWithOpponent(opponentName) {
  localStorage.setItem("opponentName", opponentName);
  // You can also save opponent tile if needed
  window.location.href = "./battle.html";
}

// Get opponent name from local storage (set before navigating to battle)
const opponentName = localStorage.getItem("opponentName") || "Unknown Opponent";

// Get player's Pokémon sprite
const playerPokemon =
  localStorage.getItem("selectedPokemon") || "./default_player_pokemon.png";

// Randomly select an opponent Pokémon
const randomOpponentPokemon =
  opponentPokemonList[Math.floor(Math.random() * opponentPokemonList.length)];

// Set sprites
document.getElementById(
  "playerSprite"
).style.backgroundImage = `url('${playerPokemon}')`;
document.getElementById(
  "opponentSprite"
).style.backgroundImage = `url('${randomOpponentPokemon}')`;

// Set title
document.getElementById(
  "battle-title"
).textContent = `Battle vs ${opponentName}`;

// Initialize HP
let myHP = 100;
let opponentHP = 100;

function attack() {
  const status = document.getElementById("status");

  // Adjusted damage range for fairness
  const myDamage = Math.floor(Math.random() * 16) + 10; // 10–25
  const opponentDamage = Math.floor(Math.random() * 11) + 5; // 5–15

  opponentHP -= myDamage;
  myHP -= opponentDamage;

  document.getElementById("my-hp").textContent = Math.max(myHP, 0);
  document.getElementById("opponent-hp").textContent = Math.max(opponentHP, 0);

  if (opponentHP <= 0 && myHP > 0) {
    status.textContent = "You won!";
    updateRecords("win");
    disableAttack();
    endBattle();
  } else if (myHP <= 0 && opponentHP > 0) {
    status.textContent = "You lost!";
    updateRecords("loss");
    disableAttack();
    endBattle();
  } else if (myHP <= 0 && opponentHP <= 0) {
    status.textContent = "Draw!";
    updateRecords("draw");
    disableAttack();
    endBattle();
  } else {
    status.textContent = `You dealt ${myDamage}, opponent dealt ${opponentDamage}.`;
  }
}

function disableAttack() {
  const button = document.querySelector("button");
  button.disabled = true;
}

// Update records in local storage
function updateRecords(result) {
  const opponentKey = `record_${opponentName}`;
  let opponentRecord = JSON.parse(localStorage.getItem(opponentKey)) || {
    wins: 0,
    losses: 0,
  };
  let myRecord = JSON.parse(localStorage.getItem("myRecord")) || {
    wins: 0,
    losses: 0,
  };

  if (result === "win") {
    myRecord.wins += 1;
    opponentRecord.losses += 1;
  } else if (result === "loss") {
    myRecord.losses += 1;
    opponentRecord.wins += 1;
  }

  localStorage.setItem(opponentKey, JSON.stringify(opponentRecord));
  localStorage.setItem("myRecord", JSON.stringify(myRecord));

  // Save to list of fought opponents
  let foughtList = JSON.parse(localStorage.getItem("foughtOpponents")) || [];
  if (!foughtList.includes(opponentName)) {
    foughtList.push(opponentName);
  }
  localStorage.setItem("foughtOpponents", JSON.stringify(foughtList));
}

function endBattle() {
  // Remove current opponent name
  localStorage.removeItem("opponentName");

  // Wait 2 seconds then continue
  setTimeout(() => {
    checkIfTournamentFinished();
  }, 2000);
}


// tourna logic
const allOpponents = ["Renji", "Haruko", "Takeshi", "Ayamitso"];

function simulateOpponentBattles() {
  for (let i = 0; i < allOpponents.length; i++) {
    for (let j = i + 1; j < allOpponents.length; j++) {
      const opponentA = allOpponents[i];
      const opponentB = allOpponents[j];

      const winner = Math.random() < 0.5 ? opponentA : opponentB;
      const loser = winner === opponentA ? opponentB : opponentA;

      updateOpponentRecords(winner, loser);
    }
  }
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

// Run simulation only once
if (!localStorage.getItem("opponentBattlesSimulated")) {
  simulateOpponentBattles();
  localStorage.setItem("opponentBattlesSimulated", "true");
}

function determineChampion() {
  const opponents = ["Renji", "Haruko", "Takeshi", "Ayamitso"];
  const myRecord = JSON.parse(localStorage.getItem("myRecord")) || {
    wins: 0,
    losses: 0
  };

  let bestOpponent = null;
  let bestRecord = {
    wins: -1,
    losses: 0
  };

  opponents.forEach(name => {
    const record = JSON.parse(localStorage.getItem(`record_${name}`)) || {
      wins: 0,
      losses: 0
    };
    if (record.wins > bestRecord.wins) {
      bestRecord = record;
      bestOpponent = name;
    }
  });

  // Compare your record to best opponent's
  if (myRecord.wins > bestRecord.wins) {
    localStorage.setItem("champion", "You");
  } else if (myRecord.wins === bestRecord.wins) {
    localStorage.setItem("champion", "Draw");
  } else {
    localStorage.setItem("champion", bestOpponent);
  }
}

function checkIfTournamentFinished() {
  const foughtList = JSON.parse(localStorage.getItem("foughtOpponents")) || [];
  const totalPlayerFights = foughtList.length;

  const totalOpponentMatches = 6;
  const totalPlayerMatches = 4;
  const totalExpectedMatches = totalOpponentMatches + totalPlayerMatches;

  const totalRecordedMatches = totalPlayerFights + totalOpponentMatches;

  if (totalRecordedMatches >= totalExpectedMatches) {
    localStorage.setItem("tournamentFinished", "true");
    determineChampion();
    window.location.href = "records.html";
  } else {
    window.location.href = "index2.html";
  }
}