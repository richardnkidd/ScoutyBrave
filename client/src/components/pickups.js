export function spawnHeart(k, gameSpeed) {
    const heart = k.add([
        k.sprite('heart'),
        k.pos(k.width() + 50, k.height() - 60 - k.rand(0, 100)),
        k.area(),
        k.move(k.LEFT, gameSpeed * 0.8), // Hearts move slightly slower
        k.anchor('center'),
        k.scale(0.8),
        'heart'
    ]);

    // Floating animation
    heart.onUpdate(() => {
        heart.pos.y += Math.sin(k.time() * 3 + heart.pos.x * 0.02) * 0.8;
        heart.angle = Math.sin(k.time() * 2) * 5; // Gentle rotation
    });

    // Pulsing effect
    heart.onUpdate(() => {
        const scale = 1 + Math.sin(k.time() * 4) * 0.1;
        heart.scaleTo(scale);
    });

    return heart;
}

export function updateHearts(k) {
    // Remove hearts that are off screen
    k.get('heart').forEach(heart => {
        if (heart.pos.x < -50) {
            k.destroy(heart);
        }
    });
}
