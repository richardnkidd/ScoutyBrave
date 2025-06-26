import { GROUND_Y, RUN_SPEED, JUMP_FORCE, BASE_SCALE, CROUCH_SCALE } from '../config.js';

export function createPlayer(k) {
    // FIX: Restore safe scaling & area mixin
    const player = k.add([
        k.sprite('scouty'),
        k.anchor('botleft'),
        k.scale(BASE_SCALE),          // component stays intact
        k.area({ scale: BASE_SCALE }),
        k.body(),
        k.pos(50, GROUND_Y),
        'player',
    ]);

    // Player state
    let isCowering = false;

    // FIX: Move L/R
    k.onKeyDown('left',  () => player.move(-RUN_SPEED, 0));
    k.onKeyDown('right', () => player.move( RUN_SPEED, 0));

    // FIX: Jump
    k.onKeyPress(['space','up'], () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
            try {
                k.play('hit', { volume: 0.5 });
            } catch (e) {
                // Sound may not be loaded yet
            }
        }
    });

    // FIX: Safe cowering mechanics that preserve components
    k.onUpdate(() => {
        // Cower toggle
        if (k.isKeyDown('down')) {
            if (!isCowering) {
                isCowering = true;
                player.scaleTo(CROUCH_SCALE);      // FIX: use scaleTo for KAPLAY
                player.opacity = 0.7;
                player.angle = 10;
            }
        } else if (isCowering) {
            isCowering = false;
            player.scaleTo(BASE_SCALE);          // FIX: use scaleTo for KAPLAY
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