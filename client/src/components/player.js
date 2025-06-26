export function createPlayer(k) {
    const groundY = k.height() - 100;          // FIX: feet on grass
    const SPEED   = 220;                       // horizontal run speed
    const JUMP    = 420;

    const player = k.add([
        k.sprite('scouty'),
        k.anchor('botleft'),                     // easier Y math
        k.scale(0.35),
        k.area({ scale: 0.35 }),
        k.outline(1, k.rgb(0,0,0)),
        k.body(),                               // enables isGrounded()
        k.pos(100, groundY),
        'player',
    ]);

    // Player state
    let isCowering = false;

    // FIX: Move L/R
    k.onKeyDown('left',  () => player.move(-SPEED, 0));
    k.onKeyDown('right', () => player.move( SPEED, 0));

    // FIX: Jump
    k.onKeyPress(['space','up'], () => {
        if (player.isGrounded()) {
            player.jump(JUMP);
            try {
                k.play('hit', { volume: 0.5 });
            } catch (e) {
                // Sound may not be loaded yet
            }
        }
    });

    // Cowering mechanics
    k.onUpdate(() => {
        // Cowering (crouching)
        if (k.isKeyDown('down')) {
            if (!isCowering) {
                isCowering = true;
                player.opacity = 0.7;
                player.scale = k.vec2(0.25, 0.25);
                player.angle = 10;
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.opacity = 1;
                player.scale = k.vec2(0.35, 0.35);
                player.angle = 0;
            }
        }
    });

    // FIX: Keep inside screen horizontally (optional)
    k.onUpdate(() => {
        if (player.pos.x < 20) player.pos.x = 20;
    });

    return player;
}