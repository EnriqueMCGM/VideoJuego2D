const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Cargar imágenes
const playerImage = new Image();
playerImage.src = 'assets/de4qb6e-19841009-38ec-4e88-863c-5934fcf95b0a-removebg-preview.png'; // Imagen del jugador
const zombieImage = new Image();
zombieImage.src = 'assets/b5f04b290114d2256b608feea936a357.png'; // Imagen del zombi
const exitImage = new Image();
exitImage.src = 'assets/hq720-removebg-preview.png'; // Imagen de la salida

// Variables del juego
let player = { x: 50, y: 500, width: 90, height: 90, speed: 5 };
let zombies = [];
let score = 0;
let level = 1;
let exit = { x: 650, y: 500, width: 120, height: 90 };
let zombieSpawnDelay = 1500;
let lastZombieSpawnTime = 0;

function spawnZombie() {
    // Generar 6 zombies en el nivel 10
    if (level === 10 && zombies.length < 6) {
        const zombie = {
            x: canvas.width,
            y: 500,
            width: 120,
            height: 120,
            speed: 0.5, // Velocidad de los zombies
            life: 7 // Vida de los zombies
        };
        zombies.push(zombie);
        return; // Solo genera un zombie a la vez
    }
    
    // Generar zombies normales en niveles menores a 10
    if (level < 10) {
        const zombieLife = Math.min(1 + Math.floor((level - 1) / 2), 4);
        const zombieSpeed = Math.min(0.5 + 0.1 * Math.floor((level - 1) / 2), 1);
        const zombie = {
            x: canvas.width,
            y: 500,
            width: 90,
            height: 90,
            speed: zombieSpeed,
            life: zombieLife
        };
        zombies.push(zombie);
    }
}

function updateGame(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawZombies();
    drawExit();
    checkCollisions();

    if (timestamp - lastZombieSpawnTime > zombieSpawnDelay) {
        spawnZombie();
        lastZombieSpawnTime = timestamp;
    }

    zombies.forEach((zombie, index) => {
        zombie.x -= zombie.speed;
        if (zombie.x + zombie.width < 0) {
            zombies.splice(index, 1);
        }
    });

    requestAnimationFrame(updateGame);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawZombies() {
    zombies.forEach(zombie => {
        ctx.drawImage(zombieImage, zombie.x, zombie.y, zombie.width, zombie.height);
    });
}

function drawExit() {
    ctx.drawImage(exitImage, exit.x, exit.y, exit.width, exit.height);
}

function checkCollisions() {
    // Verificar colisión con la salida
    if (
        player.x < exit.x + exit.width &&
        player.x + player.width > exit.x &&
        player.y < exit.y + exit.height &&
        player.y + player.height > exit.y
    ) {
        advanceLevel();
    }

    // Verificar colisiones con zombies
    zombies.forEach((zombie, index) => {
        if (player.x < zombie.x + zombie.width &&
            player.x + player.width > zombie.x &&
            player.y < zombie.y + zombie.height &&
            player.y + player.height > zombie.y) {
            alert("¡Te atraparon! Fin del juego");
            resetGame();
        }
    });
}

function advanceLevel() {
    if (level === 10) {
        alert("¡Felicidades! Has completado el juego.");
        resetGame(); // Reiniciar el juego
        return;
    }
    
    level += 1;
    document.getElementById("level").textContent = "Nivel: " + level;
    player.x = 50;
    zombies = [];
}

function resetGame() {
    level = 1;
    score = 0;
    zombies = [];
    player.x = 50;
    document.getElementById("score").textContent = "Puntuación: " + score;
    document.getElementById("level").textContent = "Nivel: " + level;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "a" || e.key === "A") {
        player.x = Math.max(player.x - player.speed, 0);
    }
    if (e.key === "d" || e.key === "D") {
        player.x = Math.min(player.x + player.speed, canvas.width - player.width);
    }
});

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    zombies.forEach((zombie, index) => {
        if (mouseX >= zombie.x && mouseX <= zombie.x + zombie.width &&
            mouseY >= zombie.y && mouseY <= zombie.y + zombie.height) {
            zombie.life -= 1;
            if (zombie.life <= 0) {
                zombies.splice(index, 1);
                score += 1;
                document.getElementById("score").textContent = "Puntuación: " + score;
            }
        }
    });
});
