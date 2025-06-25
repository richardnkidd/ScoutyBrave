const obstacleTypes = ['box', 'bag', 'leaf'];

export function spawnObstacle(k, gameSpeed) {
    const type = k.choose(obstacleTypes);
    let scale, yOffset;
    
    // Different properties for each obstacle type
    switch (type) {
        case 'box':
            scale = 0.6; // Make obstacles bigger and more visible
            yOffset = 0;
            break;
        case 'bag':
            scale = 0.65;
            yOffset = 5;
            break;
        case 'leaf':
            scale = 0.55;
            yOffset = -10;
            break;
    }

    const obstacle = k.add([
        k.sprite(type),
        k.pos(k.width() + 50, k.height() - 60 - yOffset), // Move higher up from ground
        k.area(),
        k.move(k.LEFT, gameSpeed),
        k.anchor('center'),
        k.scale(scale),
        k.outline(2, k.rgb(255, 0, 0)), // Add red outline for visibility
        'obstacle',
        type
    ]);
    
    console.log('Spawned obstacle:', type, 'at position:', obstacle.pos.x, obstacle.pos.y, 'scale:', scale);

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
