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
  } else if (result === "draw") {
    // If you want to track draws separately, you can add a "draws" field
  }

  localStorage.setItem(opponentKey, JSON.stringify(opponentRecord));
  localStorage.setItem("myRecord", JSON.stringify(myRecord));
}

function endBattle() {
  // Remove opponentName so it's fresh for next battle
  localStorage.removeItem("opponentName");

  // Wait 2 seconds before going back to map
  setTimeout(() => {
    window.location.href = "index2.html";
  }, 2000);
}
