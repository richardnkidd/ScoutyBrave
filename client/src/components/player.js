export function createPlayer(k) {
    const player = k.add([
        k.rect(32, 32),
        k.pos(100, k.height() - 100),
        k.color(255, 255, 255),
        k.area(),
        k.body(),
        k.anchor('center'),
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
                player.color = k.rgb(180, 180, 180); // Darker when cowering
                player.scaleTo(0.8); // Smaller when cowering
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.color = k.rgb(255, 255, 255);
                player.scaleTo(1);
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
