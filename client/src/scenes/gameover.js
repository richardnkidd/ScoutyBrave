export function initGameOver(k) {
    k.scene('gameover', () => {
        // Game over title
        k.add([
            k.text('GAME OVER', {
                size: 48,
                font: 'monospace'
            }),
            k.pos(k.width() / 2, 150),
            k.anchor('center'),
            k.color(255, 0, 0)
        ]);

        // Fear overwhelmed message
        k.add([
            k.text('Fear overwhelmed Scouty!', {
                size: 24,
                font: 'monospace'
            }),
            k.pos(k.width() / 2, 200),
            k.anchor('center'),
            k.color(255, 255, 255)
        ]);

        // Final score
        k.add([
            k.text(`Final Score: ${Math.floor(window.gameState.score)}`, {
                size: 32,
                font: 'monospace'
            }),
            k.pos(k.width() / 2, 280),
            k.anchor('center'),
            k.color(255, 215, 0)
        ]);

        // High score
        k.add([
            k.text(`High Score: ${window.gameState.highScore}`, {
                size: 24,
                font: 'monospace'
            }),
            k.pos(k.width() / 2, 320),
            k.anchor('center'),
            k.color(255, 215, 0)
        ]);

        // New high score message
        if (window.gameState.score > window.gameState.highScore) {
            k.add([
                k.text('NEW HIGH SCORE!', {
                    size: 28,
                    font: 'monospace'
                }),
                k.pos(k.width() / 2, 360),
                k.anchor('center'),
                k.color(0, 255, 0)
            ]);
        }

        // Instructions
        k.add([
            k.text('Press SPACE to play again', {
                size: 20,
                font: 'monospace'
            }),
            k.pos(k.width() / 2, 450),
            k.anchor('center'),
            k.color(255, 255, 255)
        ]);

        k.add([
            k.text('Press ESC for main menu', {
                size: 16,
                font: 'monospace'
            }),
            k.pos(k.width() / 2, 480),
            k.anchor('center'),
            k.color(200, 200, 200)
        ]);

        // Controls
        k.onKeyPress('space', () => {
            k.go('game');
        });

        k.onKeyPress('escape', () => {
            k.go('title');
        });
    });
}
