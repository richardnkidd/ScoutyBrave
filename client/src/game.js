import { initTitle } from './scenes/title.js';
import { initGame } from './scenes/game.js';
import { initGameOver } from './scenes/gameover.js';
import { initAudio } from './utils/audio.js';

// Initialize Kaboom
const k = kaboom({
    canvas: document.getElementById('gameCanvas'),
    width: 800,
    height: 600,
    background: [135, 206, 235], // Sky blue
    crisp: true,
    pixelDensity: 1
});

// Global game state
window.gameState = {
    fear: 0,
    score: 0,
    level: 1,
    highScore: localStorage.getItem('scoutyHighScore') || 0
};

// Load sprites - using simple colored rectangles as pixel art
k.loadSprite('scouty', '/sprites/scouty.png');
k.loadSprite('box', '/sprites/box.png');
k.loadSprite('bag', '/sprites/bag.png');
k.loadSprite('leaf', '/sprites/leaf.png');
k.loadSprite('heart', '/sprites/heart.png');
k.loadSprite('cityscape_bg', '/sprites/cityscape_bg.png');

// Load sounds
k.loadSound('background', '/sounds/background.mp3');
k.loadSound('hit', '/sounds/hit.mp3');
k.loadSound('success', '/sounds/success.mp3');

// Initialize audio system
initAudio(k);

// Initialize scenes
initTitle(k);
initGame(k);
initGameOver(k);

// Start with title scene
k.go('title');

// Global utility functions
window.resetGameState = () => {
    window.gameState.fear = 0;
    window.gameState.score = 0;
    window.gameState.level = 1;
};

window.updateHighScore = () => {
    if (window.gameState.score > window.gameState.highScore) {
        window.gameState.highScore = window.gameState.score;
        localStorage.setItem('scoutyHighScore', window.gameState.highScore);
    }
};
