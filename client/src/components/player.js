export function createPlayer(k) {
    // FIX: place Scouty on the ground & anchor by feet
    const groundY = k.height() - 40;              // 40-px ground collider
    const player = k.add([
        k.sprite('scouty'),
        k.anchor('botleft'),                       // bottom-left corner = feet
        k.pos(100, groundY),                       // stand on ground
        k.scale(0.65),
        k.area({ scale: 0.65 }),
        k.body(),
        'player',
    ]);

    // Player state
    let isCowering = false;
    let moveSpeed = 200;
    let jumpForce = 400;

    // Movement
    k.onUpdate(() => {

        // Horizontal movement
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
                player.scale = k.vec2(0.5, 0.5); // Smaller when cowering
                player.angle = 10; // Slight tilt when cowering
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.opacity = 1;
                player.scale = k.vec2(0.65, 0.65);
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

    // FIX: Jump control with proper sound
    k.onKeyPress(['space', 'up'], () => {
        if (player.isGrounded()) {
            player.jump(420);   // tweak force if necessary
            if (window.audioEnabled) {
                k.play('hit', { volume: 0.4 }); // Use hit sound as jump "boop"
            }
        }
    });

    return player;
}
