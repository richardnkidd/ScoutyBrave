export function initTitle(k) {
    k.scene('title', () => {
        // FIX: Use helper for background with 80% opacity
        window.addLevelBackground(k, 0.8);

        // Title text
        k.add([
            k.text('SCOUTY THE BRAVE', {
                size: 48,
                font: 'monospace'
            }),
            k.anchor('center'),
            k.pos(k.width() / 2, 150),
            k.color(255, 255, 255)
        ]);

        // Subtitle
        k.add([
            k.text('A Pixel Adventure', {
                size: 24,
                font: 'monospace'
            }),
            k.anchor('center'),
            k.pos(k.width() / 2, 200),
            k.color(200, 200, 200)
        ]);

        // Instructions
        const instructions = [
            'Arrow Keys: Move Left/Right',
            'Space: Jump',
            'Down Arrow: Cower',
            '',
            'Avoid obstacles to keep fear low!',
            'Collect hearts to reduce fear!',
            '',
            'Press SPACE to start'
        ];

        instructions.forEach((line, i) => {
            k.add([
                k.text(line, {
                    size: 16,
                    font: 'monospace'
                }),
                k.anchor('center'),
                k.pos(k.width() / 2, 280 + i * 25),
                k.color(255, 255, 255)
            ]);
        });

        // High score
        k.add([
            k.text(`High Score: ${window.gameState.highScore}`, {
                size: 20,
                font: 'monospace'
            }),
            k.anchor('center'),
            k.pos(k.width() / 2, 500),
            k.color(255, 215, 0)
        ]);

        // Simple animated Scouty sprite
        const scouty = k.add([
            k.sprite('scouty'),
            k.pos(100, k.height() - 100),
            k.anchor('center'),
            k.scale(0.4) // Reasonable size for title screen
        ]);

        // Simple animation
        scouty.onUpdate(() => {
            scouty.pos.y = k.height() - 100 + Math.sin(k.time() * 3) * 10;
        });

        // Start game on space press
        k.onKeyPress('space', () => {
            k.go('game');
        });
    });
}
