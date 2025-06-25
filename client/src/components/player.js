export function createPlayer(k) {
    // FIX: Proper player setup with correct positioning and scale
    const player = k.add([
        k.sprite('scouty'),
        k.pos(100, k.height() - 160),
        k.scale(0.65),
        k.area({ scale: 0.65 }),
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
