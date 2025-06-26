const TYPES = ['box','bag','leaf'];

// FIX: Updated obstacle spawning with scroll tag
export function spawnObstacle(k, speed){
    const groundY = k.height() - 100;
    const type = k.choose(TYPES);
    const obstacle = k.add([
        k.sprite(type),
        k.anchor('botleft'),
        k.scale(1),
        k.area(),
        k.outline(2,k.rgb(0,0,0)),
        k.pos(k.camPos().x + k.width() + 100, groundY),
        'obstacle','scroll',               // <-- tag so world auto-scroll moves it
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

// FIX: Updated cleanup function
export function updateObstacles(k){
    k.get('obstacle').forEach(o => {
        if (o.pos.x < k.camPos().x - 150) k.destroy(o);
    });
}