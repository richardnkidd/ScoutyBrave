import { createPlayer } from '../components/player.js';
import { spawnObstacle, updateObstacles } from '../components/obstacles.js';
import { spawnHeart, updateHearts } from '../components/pickups.js';

export function initGame(k) {
    k.scene('game', () => {
        // Reset game state
        window.resetGameState();
        
        // Add background
        const background = k.add([
            k.sprite('cityscape_bg'),
            k.pos(0, 0),
            k.scale(k.width() / 1024 * 0.7, k.height() / 576 * 0.7), // Zoom out more
            k.z(-10) // Behind everything
        ]);
        
        // Game variables
        let obstacleTimer = 0;
        let heartTimer = 0;
        let gameSpeed = 100;
        
        // Create invisible ground for physics
        const ground = k.add([
            k.rect(k.width(), 40),
            k.pos(0, k.height() - 40),
            k.opacity(0), // Make invisible since background has ground
            k.area(),
            k.body({ isStatic: true }),
            'ground'
        ]);

        // Create player
        const player = createPlayer(k);
        
        // Add ground collision detection
        player.onCollide('ground', () => {
            console.log('Player collided with ground');
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

        // Game loop
        k.onUpdate(() => {
            // Update timers
            obstacleTimer += k.dt();
            heartTimer += k.dt();
            
            // Increase game speed over time
            gameSpeed += k.dt() * 5;
            
            // Spawn obstacles
            if (obstacleTimer > k.rand(1.5, 3.0)) {
                spawnObstacle(k, gameSpeed);
                obstacleTimer = 0;
                console.log('Obstacle spawn triggered');
            }
            
            // Spawn hearts less frequently
            if (heartTimer > k.rand(8, 15)) {
                spawnHeart(k, gameSpeed);
                heartTimer = 0;
            }
            
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
