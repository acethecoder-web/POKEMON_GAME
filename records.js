// Opponent names used in the tournament
const opponents = ["Renji", "Haruko", "Takeshi", "Ayamitso"];

// Load and display your record
const myRecord = JSON.parse(localStorage.getItem("myRecord")) || {
  wins: 0,
  losses: 0
};
document.getElementById("my-record").textContent = `You: ${myRecord.wins}W - ${myRecord.losses}L`;

// Load and display opponent records
const recordList = document.getElementById("record-list");

opponents.forEach((name) => {
  const record = JSON.parse(localStorage.getItem(`record_${name}`)) || {
    wins: 0,
    losses: 0
  };
  const li = document.createElement("li");
  li.textContent = `${name}: ${record.wins}W - ${record.losses}L`;
  recordList.appendChild(li);
});

// Check tournament status
const foughtList = JSON.parse(localStorage.getItem("foughtOpponents")) || [];
if (foughtList.length === opponents.length) {
  document.getElementById("tournament-status").textContent = "🏆 Tournament Completed!";
}

// Reset button
function resetTournament() {
  opponents.forEach((name) => {
    localStorage.removeItem(`record_${name}`);
  });
  localStorage.removeItem("myRecord");
  localStorage.removeItem("foughtOpponents");
  localStorage.removeItem("tournamentFinished");
  localStorage.removeItem("opponentBattlesSimulated");
  window.location.href = "index2.html";
}