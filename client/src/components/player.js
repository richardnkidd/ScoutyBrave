export function createPlayer(k) {
    const player = k.add([
        k.sprite('scouty'),
        k.pos(100, k.height() - 100),
        k.anchor('center'),
        k.scale(0.65), // ~20px tall
        k.area({ scale: 0.65 }), // Hitbox matches sprite scale
        k.body(),
        'player'
    ]);

    // Player state
    let isOnGround = true; // Start on ground
    let isCowering = false;
    let moveSpeed = 200;
    let jumpForce = 400;

    // Ground collision detection
    player.onCollide('ground', () => {
        isOnGround = true;
    });

    // Movement
    k.onUpdate(() => {
        // Check velocity to determine if falling/jumping
        if (player.vel.y > 50) {
            isOnGround = false;
        }

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
                player.scaleTo(0.5); // Smaller when cowering
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.opacity = 1;
                player.scaleTo(0.65);
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

    // Jump with space or up arrow
    k.onKeyPress(["space", "up"], () => {
        if (player.isGrounded() && !isCowering) {
            player.jump(jumpForce);
            // Play jump sound if available
            if (window.audioEnabled) {
                k.play('hit', { volume: 0.2 }); // Use hit sound as jump "boop"
            }
        }
    });

    return player;
}
