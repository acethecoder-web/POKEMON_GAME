/* these are the codes to create the tile maps */

const map = document.getElementById('game-map');
const grid = [];
const MAP_SIZE = 100;

for (let i = 0; i < MAP_SIZE; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    map.appendChild(tile);
    grid.push(tile);
}

// display my player at the box 1
let playerIndex = 5;
const playerSprite = document.createElement('div');
playerSprite.classList.add('character');
playerSprite.style.backgroundImage = "url('./character_animation/idle/frame_1.png')";
grid[playerIndex].appendChild(playerSprite);

/* this is the controller of the character */

document.addEventListener('keydown', (e) => {
    const oldIndex = playerIndex;
    if (e.key === 'ArrowRight' && (playerIndex + 1) % 10 !== 0) playerIndex++;
    if (e.key === 'ArrowLeft' && playerIndex % 10 !== 0) playerIndex--;
    if (e.key === 'ArrowUp' && playerIndex >= 10) playerIndex -= 10;
    if (e.key === 'ArrowDown' && playerIndex < 90) playerIndex += 10;

    // Move sprite to new tile
    if (oldIndex !== playerIndex) {
        grid[oldIndex].removeChild(playerSprite);
        grid[playerIndex].appendChild(playerSprite);
        checkForNPC();
    }
});