const obstacleTypes = ['box', 'bag', 'leaf'];

export function spawnObstacle(k, gameSpeed) {
    const type = k.choose(obstacleTypes);
    let color, size;
    
    // Different properties for each obstacle type
    switch (type) {
        case 'box':
            color = k.rgb(139, 69, 19); // Brown
            size = { width: 30, height: 30 };
            break;
        case 'bag':
            color = k.rgb(50, 50, 50); // Dark gray
            size = { width: 25, height: 35 };
            break;
        case 'leaf':
            color = k.rgb(34, 139, 34); // Green
            size = { width: 20, height: 15 };
            break;
    }

    const obstacle = k.add([
        k.rect(size.width, size.height),
        k.pos(k.width() + 50, k.height() - 40 - size.height),
        k.color(color),
        k.area(),
        k.move(k.LEFT, gameSpeed),
        k.anchor('center'),
        'obstacle',
        type
    ]);

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
