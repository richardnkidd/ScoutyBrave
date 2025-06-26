import { createPlayer } from '../components/player.js';
import { spawnObstacle, updateObstacles } from '../components/obstacles.js';
import { spawnHeart, updateHearts } from '../components/pickups.js';

export function initGame(k) {
    k.scene('game', () => {
        // Reset game state
        window.resetGameState();
        
        // Add background
        window.addLevelBackground(k);
        
        // FIX: CONSTANTS
        const WORLD_SPEED = 160;      // scroll speed in px/sec
        const groundY     = k.height() - 100;
        
        // Game state
        let obstacleTimer = 0;
        let heartTimer = 0;
        
        // FIX: Ground collider aligned with grass
        const ground = k.add([
            k.rect(k.width()*5, 40),    // long invisible floor
            k.pos(-400, groundY),       // start a bit left of camera
            k.body({ isStatic: true }),
            k.opacity(0),
            'ground',
        ]);

        // Create player
        const player = createPlayer(k);
        
        // FIX: Camera follows player X but never moves left
        k.onUpdate(() => {
            const camX = k.camPos().x;
            if (player.pos.x > camX + 150) k.camPos(player.pos.x - 150, k.height()/2);
        });

        // FIX: WORLD AUTO-SCROLL: move everything tagged 'scroll'
        k.onUpdate(() => {
            const dx = -WORLD_SPEED * k.dt();
            k.get('scroll').forEach(o => o.move(dx,0));
        });

        // UI Elements
        const fearBar = k.add([
            k.rect(200, 20),
            k.pos(20, 20),
            k.color(100, 100, 100),
            k.outline(2, k.rgb(255, 255, 255))
        ]);

        const fearFill = k.add([
            k.rect(0, 16),
            k.pos(22, 22),
            k.color(255, 0, 0),
            'fearFill'
        ]);

        const fearText = k.add([
            k.text('Fear: 0%', {
                size: 16,
                font: 'monospace'
            }),
            k.pos(20, 50),
            k.color(255, 255, 255)
        ]);

        const scoreText = k.add([
            k.text('Score: 0', {
                size: 16,
                font: 'monospace'
            }),
            k.pos(20, 75),
            k.color(255, 255, 255)
        ]);

        // Update UI
        function updateUI() {
            const fearPercent = Math.min(window.gameState.fear, 100);
            fearFill.width = (fearPercent / 100) * 196;
            fearText.text = `Fear: ${Math.floor(fearPercent)}%`;
            scoreText.text = `Score: ${window.gameState.score}`;
            
            // Change fear bar color based on level
            if (fearPercent < 30) {
                fearFill.color = k.rgb(0, 255, 0);
            } else if (fearPercent < 60) {
                fearFill.color = k.rgb(255, 255, 0);
            } else {
                fearFill.color = k.rgb(255, 0, 0);
            }
        }

        // FIX: Spawn obstacles using WORLD_SPEED
        k.onUpdate(() => {
            obstacleTimer += k.dt();
            
            if (obstacleTimer > k.rand(1, 2)) {
                spawnObstacle(k, WORLD_SPEED);
                obstacleTimer = 0;
                console.log("Obstacle spawn triggered");
            }
        });

        // FIX: Spawn hearts using WORLD_SPEED 
        k.onUpdate(() => {
            heartTimer += k.dt();
            
            if (heartTimer > k.rand(5, 8)) {
                spawnHeart(k, WORLD_SPEED);
                heartTimer = 0;
            }
        });

        // Game loop
        k.onUpdate(() => {
            // Update game objects
            updateObstacles(k);
            updateHearts(k);
            
            // Update UI
            updateUI();
            
            // Increase score over time
            window.gameState.score += k.dt() * 10;
            
            // Check game over condition
            if (window.gameState.fear >= 100) {
                window.updateHighScore();
                k.go('gameover');
            }
        });

        // Collision handling
        player.onCollide('obstacle', (obstacle) => {
            // Increase fear
            window.gameState.fear += 15;
            
            // Play hit sound
            if (window.audioEnabled) {
                k.play('hit', { volume: 0.3 });
            }
            
            // Remove obstacle
            k.destroy(obstacle);
            
            // Visual feedback
            k.add([
                k.text('+15 Fear!', {
                    size: 20,
                    font: 'monospace'
                }),
                k.pos(player.pos.x, player.pos.y - 30),
                k.color(255, 0, 0),
                k.lifespan(1),
                k.move(0, -50)
            ]);
        });

        player.onCollide('heart', (heart) => {
            // Reduce fear
            window.gameState.fear = Math.max(0, window.gameState.fear - 25);
            
            // Increase score
            window.gameState.score += 100;
            
            // Play success sound
            if (window.audioEnabled) {
                k.play('success', { volume: 0.5 });
            }
            
            // Remove heart
            k.destroy(heart);
            
            // Visual feedback
            k.add([
                k.text('-25 Fear!', {
                    size: 20,
                    font: 'monospace'
                }),
                k.pos(player.pos.x, player.pos.y - 30),
                k.color(0, 255, 0),
                k.lifespan(1),
                k.move(0, -50)
            ]);
        });

        // Pause game
        k.onKeyPress('escape', () => {
            k.go('title');
        });
    });
}