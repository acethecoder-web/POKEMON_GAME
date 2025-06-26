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
    let playerIndex = 44;
    const playerSprite = document.createElement('div');
    playerSprite.classList.add('character');
    playerSprite.style.backgroundImage = "url('./character_animation/idle/frame_1.png')";
    grid[playerIndex].appendChild(playerSprite);

    // this is used to display the opponents

    const opponentIndices = [4, 40, 49, 94];
    const opponentSprites = [];

    opponentIndices.forEach((index, i) => {
        const opponent = document.createElement('div');
        opponent.classList.add('opponent');
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
        const maxframe = 11;
        const animationInterval = setInterval(() => {
            playerSprite.style.backgroundImage = `url('./character_animation/animation_down/frame_${frame}.png')`;
            frame++;
            if (frame > maxframe) {
                clearInterval(animationInterval);
            }
        }, 50);
    }

    /* this is the controller of the character */
    document.addEventListener('keydown', (e) => {
        const oldIndex = playerIndex;
        if (e.key === 'ArrowRight' && (playerIndex + 1) % 10 !== 0) {
            playerIndex++
            changetoright();
        };
        if (e.key === 'ArrowLeft' && playerIndex % 10 !== 0) {
            playerIndex--
            changetoleft();
        };
        if (e.key === 'ArrowUp' && playerIndex >= 10) {
            playerIndex -= 10
            changetoup();
        };
        if (e.key === 'ArrowDown' && playerIndex < 90) {
            playerIndex += 10
            changetodown()
        };

        // Move sprite to next tile
        if (oldIndex !== playerIndex) {
            grid[oldIndex].removeChild(playerSprite);
            grid[playerIndex].appendChild(playerSprite);
        }
        checkNearbyOpponent();
    });

    // this is for the updating of the contents of the message box
    // Opponent names (simple map)
    function getOpponentData(tileNumber) {
        if (tileNumber === 4) return {
            name: "Renji",
            record: "80 Wins, 10 Defeats"
        };
        if (tileNumber === 40) return {
            name: "Haruko",
            record: "60 Wins, 30 Defeats"
        };
        if (tileNumber === 49) return {
            name: "Takeshi",
            record: "53 Wins, 36 Defeats"
        };
        if (tileNumber === 94) return {
            name: "Ayamitso",
            record: "28 Wins, 13 Defeats"
        };
        return "";
    }

    // Check if player is next to an opponent
    function checkNearbyOpponent() {
        // Get tiles next to the player
        let nearbyTiles = [
            playerIndex - 1, // left
            playerIndex + 1, // right
            playerIndex - 10, // up
            playerIndex + 10 // down
        ];

        // Check if any opponent is in nearby tiles
        let foundOpponent = null;
        for (let i = 0; i < opponentIndices.length; i++) {
            if (nearbyTiles.includes(opponentIndices[i])) {
                foundOpponent = opponentIndices[i];
                break;
            }
        }

        // Show name in the message box

        const nameBox = document.getElementById('name-container');
        const recordBox = document.getElementById('records');

        if (foundOpponent !== null) {
            const data = getOpponentData(foundOpponent);
            nameBox.textContent = data.name;
            recordBox.textContent = data.record;
        } else {
            nameBox.textContent = ""; // Clear when no one is nearby
            recordBox.textContent = "";
        }
    }


    z