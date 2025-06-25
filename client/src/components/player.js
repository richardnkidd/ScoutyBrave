export function createPlayer(k) {
    const groundY = k.height() - 100;
    const runSpeed = 120;        // constant scroll speed

    const player = k.add([
        k.sprite('scouty'),
        k.anchor('botleft'),
        k.scale(0.35),
        k.area({ scale: 0.35 }),
        k.pos(50, groundY),
        k.body(),
        'player',
    ]);

    // Player state
    let isCowering = false;
    let moveSpeed = 200;
    let jumpForce = 400;

    // FIX: constant forward motion unless cowering
    k.onUpdate(() => {
        if (!k.isKeyDown('down')) {
            player.move(runSpeed, 0);
        }
    });

    // Additional movement controls
    k.onUpdate(() => {
        // Horizontal movement (modifies auto-run speed)
        if (k.isKeyDown('left') && !isCowering) {
            player.move(-moveSpeed, 0);
        }
        if (k.isKeyDown('right') && !isCowering) {
            player.move(moveSpeed, 0);
        }

        // Cower action
        if (k.isKeyDown('down')) {
            if (!isCowering) {
                isCowering = true;
                player.opacity = 0.7; // Darker when cowering
                player.scale = k.vec2(0.25, 0.25); // Smaller when cowering
                player.angle = 10; // Slight tilt when cowering
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.opacity = 1;
                player.scale = k.vec2(0.35, 0.35);
                player.angle = 0;
            }
        }

        // Keep player on screen
        if (player.pos.x < 16) {
            player.pos.x = 16;
        }
        if (player.pos.x > k.width() - 16) {
            player.pos.x = k.width() - 16;
        }

        // Simple walking animation
        if ((k.isKeyDown('left') || k.isKeyDown('right')) && player.isGrounded() && !isCowering) {
            player.angle = Math.sin(k.time() * 10) * 2;
        } else {
            player.angle = 0;
        }
    });

    // JUMP (unchanged except sound id)
    k.onKeyPress(['space', 'up'], () => {
        if (player.isGrounded()) {
            player.jump(420);
            try {
                k.play('hit', { volume: 0.5 }); // safe play
            } catch (e) {
                // Sound may not be loaded yet
            }
        }
    });

    return player;
}
