import { createPlayer } from '../components/player.js';
import { spawnObstacle, updateObstacles } from '../components/obstacles.js';
import { spawnHeart, updateHearts } from '../components/pickups.js';
import { GROUND_Y, WORLD_SPEED } from '../config.js';

export function initGame(k) {
    k.scene('game', () => {
        // Reset game state
        window.resetGameState();
        
        // Add background
        window.addLevelBackground(k);
        
        // Game state
        let obstacleTimer = 0;
        let heartTimer = 0;
        
        // FIX: Align ground & background with constants
        const ground = k.add([
            k.rect(5000, 40),
            k.pos(-500, GROUND_Y),
            k.body({ isStatic: true }),
            k.opacity(0),
            'ground',
        ]);

        // Create player
        const player = createPlayer(k);
        
        // FIX: Camera follows only on X after Scouty reaches 1/3 screen
        k.onUpdate(() => {
            if (player.pos.x > k.camPos().x + 250)
                k.camPos(player.pos.x - 250, k.height()/2);
        });

        // FIX: Make the world auto-scroll
        k.onUpdate(() => {
            const dx = -WORLD_SPEED * k.dt();
            k.get('scroll').forEach(o => o.move(dx, 0));
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

        // FIX: Spawn obstacles using constants
        k.onUpdate(() => {
            obstacleTimer += k.dt();
            
            if (obstacleTimer > k.rand(1, 2)) {
                const obstacle = spawnObstacle(k, WORLD_SPEED);
                obstacleTimer = 0;
                console.log(`Obstacle spawned at x:${obstacle.pos.x}, y:${obstacle.pos.y}`);
                console.log(`Camera position: ${k.camPos().x}, Screen width: ${k.width()}`);
                console.log("Obstacle spawn triggered");
            }
        });

        // FIX: Spawn hearts using constants
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

        // FIX: Collision handling using global events with KAPLAY
        k.onCollide('player', 'obstacle', (player, obstacle) => {
            // Increase fear
            window.gameState.fear += 15;
            
            // Play hit sound
            if (window.audioEnabled) {
                k.play('hit', { volume: 0.3 });
            }
            
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
            
            // FIX: Safe removal for KAPLAY
            k.destroy(obstacle);
        });

        k.onCollide('player', 'heart', (player, heart) => {
            // Reduce fear
            window.gameState.fear = Math.max(0, window.gameState.fear - 25);
            
            // Increase score
            window.gameState.score += 100;
            
            // Play success sound
            if (window.audioEnabled) {
                k.play('success', { volume: 0.5 });
            }
            
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
            
            // FIX: Safe removal for KAPLAY
            k.destroy(heart);
        });

        // Pause game
        k.onKeyPress('escape', () => {
            k.go('title');
        });
    });
}