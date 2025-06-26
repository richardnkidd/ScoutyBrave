import { initTitle } from './scenes/title.js';
import { initGame } from './scenes/game.js';
import { initGameOver } from './scenes/gameover.js';
import { initAudio } from './utils/audio.js';

// Check if KAPLAY is available
if (!window.kaplay) {
    console.error('KAPLAY not loaded');
    throw new Error('KAPLAY library not available');
}

// Initialize KAPLAY
const k = window.kaplay({
    canvas: document.getElementById('gameCanvas'),
    width: 800,
    height: 600,
    background: [135, 206, 235], // Sky blue
    crisp: true,
    pixelDensity: 1,
    gravity: 1600 // Enable gravity for proper physics
});

// Global game state
window.gameState = {
    fear: 0,
    score: 0,
    level: 1,
    highScore: localStorage.getItem('scoutyHighScore') || 0
};

// Load sprites - using pixel art
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

// Make k globally available
window.k = k;

// Start with title scene
k.go('title');

// FIX: lock bg and scale exactly once
window.addLevelBackground = (k, op = 1) => {
    const bg = k.add([
        k.sprite('cityscape_bg'),
        k.anchor('topleft'),
        k.pos(0, 0),
        k.fixed(),
        k.z(-3),
        k.opacity(op),
    ]);
    
    // Use k.wait instead of bg.onLoad for KAPLAY compatibility
    k.wait(0.1, () => {
        if (bg.width && bg.height) {
            const scaleX = k.width() / bg.width;
            const scaleY = k.height() / bg.height;
            bg.scale = k.vec2(scaleX, scaleY);  // FIX: direct scale assignment for background (no collision)
        }
    });
    
    return bg;
};

// Global utility functions
window.resetGameState = () => {
    window.gameState.fear = 0;
    window.gameState.score = 0;
    window.gameState.level = 1;
};

window.updateHighScore = () => {
    if (window.gameState.score > window.gameState.highScore) {
        window.gameState.highScore = window.gameState.score;
        localStorage.setItem('scoutyHighScore', window.gameState.score);
    }
};