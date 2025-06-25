export function spawnHeart(k, gameSpeed) {
    const groundY = k.height() - 100;  // FIX
    const heart   = k.add([
        k.sprite('heart'),
        k.anchor('botleft'),
        // float 40-140 px above ground
        k.pos(k.get('player')[0].pos.x + k.width() + 400,
              groundY - 40 - k.rand(0, 100)),
        k.area(),
        k.scale(1),
        k.z(1),
        k.outline(2, k.rgb(0,0,0)),
        k.move(k.LEFT, gameSpeed * 0.8),
        'heart',
    ]);
    
    console.log('Spawned heart at position:', heart.pos.x, heart.pos.y);

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
