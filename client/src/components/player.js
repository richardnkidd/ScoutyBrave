export function createPlayer(k) {
    const player = k.add([
        k.sprite('scouty'),
        k.pos(100, k.height() - 100),
        k.area(),
        k.body(),
        k.anchor('center'),
        k.scale(2), // Scale up the pixel art for better visibility
        'player'
    ]);

    // Player state
    let isOnGround = false;
    let isCowering = false;
    let moveSpeed = 200;
    let jumpForce = 400;

    // Movement
    k.onUpdate(() => {
        // Check if on ground
        isOnGround = player.isGrounded();

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
                player.scaleTo(1.6); // Smaller when cowering (scaled from base 2)
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.opacity = 1;
                player.scaleTo(2);
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
        if ((k.isKeyDown('left') || k.isKeyDown('right')) && isOnGround && !isCowering) {
            player.angle = Math.sin(k.time() * 10) * 2;
        } else {
            player.angle = 0;
        }
    });

    // Jump
    k.onKeyPress('space', () => {
        if (isOnGround && !isCowering) {
            player.jump(jumpForce);
        }
    });

    return player;
}
