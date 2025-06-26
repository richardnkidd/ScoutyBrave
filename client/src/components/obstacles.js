import { GROUND_Y } from '../config.js';

const TYPES = ['box','bag','leaf'];

// FIX: Updated obstacle spawning with constants and proper positioning
export function spawnObstacle(k, speed){
    const type = k.choose(TYPES);
    
    // Create obstacle with fallback to colored rectangle if sprite fails
    const obstacle = k.add([
        k.rect(40, 60), // Fallback rectangle first
        k.color(type === 'box' ? [139, 69, 19] : type === 'bag' ? [100, 100, 100] : [0, 128, 0]),
        k.anchor('botleft'),
        k.scale(1),
        k.area(),
        k.outline(2, k.rgb(0, 0, 0)),
        // FIX: spawn correctly at camera edge
        k.pos(k.camPos().x + k.width() + 50, GROUND_Y),
        'obstacle', 'scroll',               // tag so world auto-scroll moves it
    ]);
    
    // Try to load sprite, but keep the colored rectangle as fallback
    try {
        obstacle.use(k.sprite(type));
    } catch (e) {
        console.log('Sprite failed, using colored rectangle for:', type);
    }
    
    console.log('Spawned obstacle:', type, 'at position:', obstacle.pos.x, obstacle.pos.y);

    // Add some variation to leaf movement
    if (type === 'leaf') {
        obstacle.onUpdate(() => {
            obstacle.pos.y += Math.sin(k.time() * 5 + obstacle.pos.x * 0.01) * 0.5;
        });
    }

    return obstacle;
}

// FIX: Updated cleanup function with safe destruction
export function updateObstacles(k){
    k.get('obstacle').forEach(o => {
        if (o.pos.x < k.camPos().x - 150) {
            // FIX: Safe destruction for KAPLAY
            k.destroy(o);
        }
    });
}