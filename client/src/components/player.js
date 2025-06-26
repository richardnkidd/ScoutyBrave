import { GROUND_Y, RUN_SPEED, JUMP_FORCE, BASE_SCALE, CROUCH_SCALE } from '../config.js';

export function createPlayer(k) {
    // FIX: Player with fallback rectangle and proper collision
    const player = k.add([
        k.rect(48, 48), // Fallback blue rectangle
        k.color([65, 105, 225]), // Blue color for Scouty
        k.anchor('botleft'),
        k.scale(BASE_SCALE * 2), // Make Scouty more visible
        k.area(), // Ensure collision area is present
        k.body(), // Physics body for jumping and gravity
        k.pos(50, GROUND_Y),
        'player',
    ]);
    
    // Try to load sprite, but keep the colored rectangle as fallback
    try {
        player.use(k.sprite('scouty'));
    } catch (e) {
        console.log('Scouty sprite failed, using blue rectangle');
    }

    // Player state
    let isCowering = false;

    // FIX: Move L/R
    k.onKeyDown('left',  () => player.move(-RUN_SPEED, 0));
    k.onKeyDown('right', () => player.move( RUN_SPEED, 0));

    // FIX: Jump with ground check - add debug logging
    k.onKeyPress(['space','up'], () => {
        console.log('Space pressed, isGrounded:', player.isGrounded());
        if (player.isGrounded()) {
            console.log('Jumping with force:', JUMP_FORCE);
            player.jump(JUMP_FORCE);
            try {
                k.play('hit', { volume: 0.5 });
            } catch (e) {
                // Sound may not be loaded yet
            }
        } else {
            console.log('Cannot jump - not grounded');
        }
    });

    // FIX: Safe cowering mechanics that preserve components
    k.onUpdate(() => {
        // Cower toggle
        if (k.isKeyDown('down')) {
            if (!isCowering) {
                isCowering = true;
                player.scaleTo(CROUCH_SCALE * 2);      // FIX: use scaleTo for KAPLAY with visibility
                player.opacity = 0.7;
                player.angle = 10;
            }
        } else if (isCowering) {
            isCowering = false;
            player.scaleTo(BASE_SCALE * 2);          // FIX: use scaleTo for KAPLAY with visibility
            player.opacity = 1;
            player.angle = 0;
        }
    });

    // FIX: Keep inside screen horizontally
    k.onUpdate(() => {
        if (player.pos.x < 20) player.pos.x = 20;
    });

    return player;
}