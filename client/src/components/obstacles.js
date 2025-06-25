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

    // FIX: Anchor obstacles to ground and spawn relative to camera
    const groundY = k.height() - 40;
    
    const obstacle = k.add([
        k.sprite(type),
        k.anchor('botleft'),                       // feet on ground
        k.pos(k.camPos().x + k.width() + 100, groundY), // spawn just off-screen right
        k.scale(1),
        k.area(),
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
