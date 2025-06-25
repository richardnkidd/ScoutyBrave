export function createPlayer(k) {
    const player = k.add([
        k.sprite('scouty'),
        k.pos(100, k.height() - 100),
        k.area(),
        k.body(),
        k.anchor('center'),
        k.scale(0.15), // Much smaller scale
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
                player.scaleTo(0.12); // Smaller when cowering (scaled from base 0.15)
            }
        } else {
            if (isCowering) {
                isCowering = false;
                player.opacity = 1;
                player.scaleTo(0.15);
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
        console.log('Space pressed! isOnGround:', isOnGround, 'isCowering:', isCowering);
        if (isOnGround && !isCowering) {
            player.vel.y = -jumpForce; // Direct velocity assignment instead of jump()
            isOnGround = false; // Set to false immediately after jump
            console.log('Jump executed! Velocity set to:', -jumpForce);
        }
    });

    return player;
}
