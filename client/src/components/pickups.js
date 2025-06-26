import { GROUND_Y } from '../config.js';

// FIX: Hearts with constants and proper positioning
export function spawnHeart(k, gameSpeed) {
    const heart = k.add([
        k.sprite('heart'),
        k.anchor('botleft'),
        // float 60-140 px above ground
        k.pos(k.camPos().x + k.width() + 50, 
              GROUND_Y - k.rand(60, 140)),
        k.area(),
        k.scale(1),
        k.z(1),
        k.outline(2, k.rgb(0,0,0)),
        'heart','scroll',               // tag so world auto-scroll moves it
    ]);

    // Gentle floating animation
    heart.onUpdate(() => {
        heart.pos.y += Math.sin(k.time() * 3 + heart.pos.x * 0.02) * 0.3;
    });

    console.log('Spawned heart at position:', heart.pos.x, heart.pos.y);

    return heart;
}

// FIX: Updated hearts cleanup with safe destruction
export function updateHearts(k) {
    k.get('heart').forEach(heart => {
        if (heart.pos.x < k.camPos().x - 150) {
            // FIX: Remove tags before destroying to prevent collision callback issues
            heart.unuse('heart');
            heart.unuse('scroll');
            k.destroy(heart);
        }
    });
}