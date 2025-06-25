const obstacleTypes = ['box', 'bag', 'leaf'];

export function spawnObstacle(k, gameSpeed) {
    const groundY = k.height() - 100;   // FIX: same baseline
    const type     = k.choose(obstacleTypes);

    const obstacle = k.add([
        k.sprite(type),
        k.anchor('botleft'),
        k.scale(1),
        k.area(),
        k.pos(k.camPos().x + k.width() + 80, groundY),
        k.z(1),
        k.outline(2, k.rgb(0,0,0)),
        k.move(k.LEFT, gameSpeed),
        'obstacle',
    ]);
    
    console.log('Spawned obstacle:', type, 'at position:', obstacle.pos.x, obstacle.pos.y);

    // Add some variation to leaf movement
    if (type === 'leaf') {
        obstacle.onUpdate(() => {
            obstacle.pos.y += Math.sin(k.time() * 5 + obstacle.pos.x * 0.01) * 0.5;
        });
    }

    return obstacle;
}

export function updateObstacles(k) {
    // Remove obstacles that are off screen
    k.get('obstacle').forEach(obstacle => {
        if (obstacle.pos.x < -50) {
            k.destroy(obstacle);
        }
    });
}
