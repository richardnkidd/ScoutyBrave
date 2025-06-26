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

// Load sprites - using SVG sources for better visibility
k.loadSprite('scouty', '/sprites/scouty.svg');
k.loadSprite('box', '/sprites/box.svg');
k.loadSprite('bag', '/sprites/bag.svg');
k.loadSprite('leaf', '/sprites/leaf.svg');
k.loadSprite('heart', '/sprites/heart.svg');
k.loadSprite('cityscape_bg', '/sprites/cityscape_bg.svg');

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
            console.log('Background dimensions:', bg.width, 'x', bg.height);
            console.log('Canvas dimensions:', k.width(), 'x', k.height());
            const scaleX = k.width() / bg.width;
            const scaleY = k.height() / bg.height;
            bg.scale = k.vec2(scaleX, scaleY);  // FIX: direct scale assignment for background (no collision)
            console.log('Background scaled by:', scaleX, scaleY);
        } else {
            console.log('Background not ready, using default scale');
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