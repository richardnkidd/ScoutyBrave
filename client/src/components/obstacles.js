const obstacleTypes = ['box', 'bag', 'leaf'];

export function spawnObstacle(k, gameSpeed) {
    const type = k.choose(obstacleTypes);
    let scale, yOffset;
    
    const floorHeight = k.height() - 40;
    
    // Different properties for each obstacle type
    switch (type) {
        case 'box':
            yOffset = 0;
            break;
        case 'bag':
            yOffset = 5;
            break;
        case 'leaf':
            yOffset = -10;
            break;
    }

    const obstacle = k.add([
        k.sprite(type),
        k.pos(k.width() + 50, Math.max(floorHeight - 20, floorHeight - yOffset)), // No lower than floor - 20
        k.area(),
        k.move(k.LEFT, gameSpeed),
        k.anchor('center'),
        k.scale(1), // Explicitly scale to 1 so never zero-sized
        k.outline(2, k.rgb(0, 0, 0)), // Black outline for visibility
        k.z(1), // Above background
        'obstacle',
        type
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
