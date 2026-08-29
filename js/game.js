// Core Game Logic, Player Physics, Camera System, and Multiplayer Synchronization
class Player {
    constructor(id, name, species, color, accessory, startX = 200, startY = 480) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.color = color;
        this.accessory = accessory;

        // Position & Movement
        this.x = startX;
        this.y = startY;
        this.vx = 0;
        this.vy = -12; // Initial jump
        this.width = 36;
        this.height = 36;
        this.facing = 1;
        this.maxHeight = startY;
        this.score = 0;

        // States
        this.isGrounded = false;
        this.isFrozen = false;
        this.freezeTimer = 0;
        this.hasShield = false;
        this.shieldTimer = 0;
        this.hasRocket = false;
        this.rocketTimer = 0;
        this.hasDoubleJump = false;
        this.doubleJumpUsed = false;
        this.springBootsTimer = 0;
        this.inventory = null; // Stored Powerup item
        this.isWinner = false;
        this.isDead = false;

        // Animation
        this.blinkTimer = Math.random() * 3;
        this.isBlinking = false;
    }

    reset(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.vx = 0;
        this.vy = -12;
        this.maxHeight = startY;
        this.score = 0;
        this.isFrozen = false;
        this.freezeTimer = 0;
        this.hasShield = false;
        this.shieldTimer = 0;
        this.hasRocket = false;
        this.rocketTimer = 0;
        this.hasDoubleJump = false;
        this.doubleJumpUsed = false;
        this.springBootsTimer = 0;
        this.inventory = null;
        this.isWinner = false;
        this.isDead = false;
    }

    update(dt, keys, platforms, worldWidth = 480, particles, sound) {
        if (this.isDead || this.isWinner) return;

        // Animation Blinking
        this.blinkTimer -= dt;
        if (this.blinkTimer <= 0) {
            this.isBlinking = !this.isBlinking;
            this.blinkTimer = this.isBlinking ? 0.15 : 2 + Math.random() * 3;
        }

        // Power-up Timers
        if (this.isFrozen) {
            this.freezeTimer -= dt;
            if (this.freezeTimer <= 0) {
                this.isFrozen = false;
            }
            return; // Cannot move while frozen
        }

        if (this.hasShield) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) this.hasShield = false;
        }

        if (this.hasRocket) {
            this.rocketTimer -= dt;
            this.vy = -20; // Rocket fast climb
            if (particles) particles.spawnRocketTrail(this.x, this.y + 15, this.color);
            if (this.rocketTimer <= 0) {
                this.hasRocket = false;
                this.vy = -12;
            }
        }

        if (this.springBootsTimer > 0) {
            this.springBootsTimer -= dt;
            this.hasDoubleJump = true;
        } else {
            this.hasDoubleJump = false;
        }

        // Input controls
        const speed = 7;
        if (keys.left) {
            this.vx = -speed;
            this.facing = -1;
        } else if (keys.right) {
            this.vx = speed;
            this.facing = 1;
        } else {
            this.vx *= 0.82; // Friction
        }

        // Double jump action
        if (keys.jump && (this.hasDoubleJump || this.hasRocket) && !this.doubleJumpUsed && this.vy > -2) {
            this.vy = -15;
            this.doubleJumpUsed = true;
            if (sound) sound.playDoubleJump();
            if (particles) particles.spawnDust(this.x, this.y + 18, 10, '#ec4899');
        }

        // Gravity & Vertical Physics
        if (!this.hasRocket) {
            const gravity = 0.42;
            this.vy += gravity;
            if (this.vy > 16) this.vy = 16; // Terminal velocity
        }

        this.x += this.vx;
        this.y += this.vy;

        // Screen Wrap (Left to Right, Right to Left)
        if (this.x < -10) {
            this.x = worldWidth + 10;
        } else if (this.x > worldWidth + 10) {
            this.x = -10;
        }

        // Platform Collisions (Only when falling downwards)
        if (this.vy > 0) {
            for (const plat of platforms) {
                if (plat.broken) continue;

                const footY = this.y + this.height / 2;
                const prevFootY = footY - this.vy;

                // Check horizontal overlap & vertical landing
                if (this.x + this.width / 2 > plat.x &&
                    this.x - this.width / 2 < plat.x + plat.width &&
                    prevFootY <= plat.y + 6 &&
                    footY >= plat.y) {

                    // Landed on platform!
                    this.y = plat.y - this.height / 2;
                    this.doubleJumpUsed = false;

                    if (plat.type === 'finish') {
                        this.isWinner = true;
                        this.vy = 0;
                        if (sound) sound.playWin();
                        if (particles) particles.spawnConfetti(this.x, this.y, 80);
                        return;
                    }

                    if (plat.type === 'spring') {
                        this.vy = -23; // Super jump
                        if (sound) sound.playSpring();
                        if (particles) particles.spawnHearts(this.x, this.y + 15, 12);
                    } else if (plat.type === 'ice') {
                        this.vy = -11;
                        if (sound) sound.playJump(false);
                    } else {
                        this.vy = -13.5; // Standard Jump
                        if (sound) sound.playJump(false);
                        if (particles) particles.spawnDust(this.x, this.y + 18, 6);
                    }

                    if (plat.type === 'fragile') {
                        plat.isStepped = true;
                    }

                    // Check Item pickup
                    if (plat.item && !plat.item.collected) {
                        plat.item.collected = true;
                        this.collectItem(plat.item.type, sound, particles);
                    }

                    break;
                }
            }
        }

        // Update score & height
        if (this.y < this.maxHeight) {
            this.maxHeight = this.y;
            this.score = Math.floor(Math.abs(520 - this.maxHeight) / 10);
        }
    }

    collectItem(type, sound, particles) {
        if (sound) sound.playCollect();
        if (particles) particles.spawnHearts(this.x, this.y, 10, '#fbbf24');

        if (type === 'ROCKET') {
            this.hasRocket = true;
            this.rocketTimer = 2.8;
            if (sound) sound.playRocket();
        } else if (type === 'SHIELD') {
            this.hasShield = true;
            this.shieldTimer = 8;
        } else if (type === 'SPRING_BOOTS') {
            this.springBootsTimer = 10;
        } else {
            // Offensive item stored in inventory
            this.inventory = type;
        }
    }

    useItem(opponent, sound, particles) {
        if (!this.inventory) return;

        const item = this.inventory;
        this.inventory = null;

        if (item === 'FREEZE') {
            if (opponent && !opponent.hasShield) {
                opponent.isFrozen = true;
                opponent.freezeTimer = 1.8;
                if (sound) sound.playFreeze();
                if (particles) particles.spawnIceCrystals(opponent.x, opponent.y, 16);
            } else if (opponent && opponent.hasShield) {
                opponent.hasShield = false; // Break shield
                if (sound) sound.playHurt();
            }
        } else if (item === 'SWAP') {
            if (opponent) {
                // Swap heights
                const tempX = this.x;
                const tempY = this.y;
                this.x = opponent.x;
                this.y = opponent.y;
                opponent.x = tempX;
                opponent.y = tempY;
                if (sound) sound.playSwap();
                if (particles) {
                    particles.spawnHearts(this.x, this.y, 10);
                    particles.spawnHearts(opponent.x, opponent.y, 10);
                }
            }
        }
    }

    draw(ctx, cameraY = 0) {
        if (this.isDead) return;

        CharacterRenderer.draw(ctx, this.x, this.y - cameraY, this.width, this.height, {
            species: this.species,
            color: this.color,
            facing: this.facing,
            accessory: this.accessory,
            vx: this.vx,
            vy: this.vy,
            isFrozen: this.isFrozen,
            hasShield: this.hasShield,
            hasRocket: this.hasRocket,
            blink: this.isBlinking,
            name: this.name,
            isWinner: this.isWinner
        });
    }
}

// AI Bot Controller for Single Player / Practice Mode
class SimpleBotController {
    constructor(player) {
        this.player = player;
        this.targetPlat = null;
    }

    update(platforms) {
        const p = this.player;
        const keys = { left: false, right: false, jump: false, useItem: false };

        if (p.inventory && Math.random() < 0.05) {
            keys.useItem = true;
        }

        // Find best platform above player
        let bestPlat = null;
        let minDist = 9999;

        for (const plat of platforms) {
            if (plat.broken) continue;
            if (plat.y < p.y && plat.y > p.y - 200) {
                const dist = Math.abs(plat.x + plat.width / 2 - p.x);
                if (dist < minDist) {
                    minDist = dist;
                    bestPlat = plat;
                }
            }
        }

        if (bestPlat) {
            const targetX = bestPlat.x + bestPlat.width / 2;
            if (p.x < targetX - 10) {
                keys.right = true;
            } else if (p.x > targetX + 10) {
                keys.left = true;
            }
        }

        if (p.hasDoubleJump && p.vy > 4) {
            keys.jump = true;
        }

        return keys;
    }
}

class GameEngine {
    constructor(canvas, p1Config, p2Config, mode = 'local') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mode = mode; // 'local', 'online', 'solo'
        this.worldWidth = 480;
        this.worldHeight = 720;
        this.targetGoal = 6000; // Race height

        this.particles = new ParticleSystem();
        this.sound = window.soundEngine;

        // Players
        this.p1 = new Player(1, p1Config.name || 'P1', p1Config.species, p1Config.color, p1Config.accessory, 160, 480);
        this.p2 = new Player(2, p2Config.name || (mode === 'solo' ? 'Bot 🤖' : 'P2'), p2Config.species, p2Config.color, p2Config.accessory, 320, 480);

        this.bot = (mode === 'solo') ? new SimpleBotController(this.p2) : null;

        // Keys state
        this.p1Keys = { left: false, right: false, jump: false, useItem: false };
        this.p2Keys = { left: false, right: false, jump: false, useItem: false };

        // Camera
        this.cameraY = 0;
        this.targetCameraY = 0;

        // Platforms
        this.platforms = LevelGenerator.generateLevel(2026, this.targetGoal, this.worldWidth);

        this.gameState = 'countdown'; // 'countdown', 'playing', 'gameover'
        this.countdown = 3;
        this.countdownTimer = 0;
        this.winner = null;
        this.onGameOverCallback = null;

        this.lastTime = performance.now();
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.gameState = 'countdown';
        this.countdown = 3;
        this.countdownTimer = 0;
        this.winner = null;
        this.particles.clear();
        this.p1.reset(160, 480);
        this.p2.reset(320, 480);
        this.platforms = LevelGenerator.generateLevel(Math.floor(Math.random() * 99999), this.targetGoal, this.worldWidth);

        if (this.sound) {
            this.sound.playCountdown(false);
            this.sound.startBGM();
        }

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.isRunning = false;
        if (this.sound) {
            this.sound.stopBGM();
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        if (this.gameState === 'countdown') {
            this.countdownTimer += dt;
            if (this.countdownTimer >= 1) {
                this.countdownTimer = 0;
                this.countdown--;
                if (this.countdown > 0) {
                    if (this.sound) this.sound.playCountdown(false);
                } else if (this.countdown === 0) {
                    if (this.sound) this.sound.playCountdown(true);
                } else {
                    this.gameState = 'playing';
                }
            }
            return;
        }

        if (this.gameState === 'playing') {
            // Update Platforms
            for (const plat of this.platforms) {
                plat.update(dt, this.worldWidth);
            }

            // Update Bot if Solo
            if (this.bot) {
                this.p2Keys = this.bot.update(this.platforms);
            }

            // Check Item Uses
            if (this.p1Keys.useItem) {
                this.p1.useItem(this.p2, this.sound, this.particles);
                this.p1Keys.useItem = false;
            }
            if (this.p2Keys.useItem) {
                this.p2.useItem(this.p1, this.sound, this.particles);
                this.p2Keys.useItem = false;
            }

            // Update Players
            this.p1.update(dt, this.p1Keys, this.platforms, this.worldWidth, this.particles, this.sound);
            this.p2.update(dt, this.p2Keys, this.platforms, this.worldWidth, this.particles, this.sound);

            // Particles Update
            this.particles.update(dt);

            // Check Out-of-bounds (Fall off bottom of camera)
            const deathY = this.cameraY + this.worldHeight + 100;
            if (this.p1.y > deathY && !this.p1.isDead) {
                this.p1.isDead = true;
                if (this.sound) this.sound.playHurt();
            }
            if (this.p2.y > deathY && !this.p2.isDead) {
                this.p2.isDead = true;
                if (this.sound) this.sound.playHurt();
            }

            // Check Win Conditions
            if (this.p1.isWinner) {
                this.endGame(this.p1);
            } else if (this.p2.isWinner) {
                this.endGame(this.p2);
            } else if (this.p1.isDead && !this.p2.isDead) {
                this.p2.isWinner = true;
                this.endGame(this.p2);
            } else if (this.p2.isDead && !this.p1.isDead) {
                this.p1.isWinner = true;
                this.endGame(this.p1);
            } else if (this.p1.isDead && this.p2.isDead) {
                // Whoever reached higher height wins
                const winner = this.p1.maxHeight < this.p2.maxHeight ? this.p1 : this.p2;
                winner.isWinner = true;
                this.endGame(winner);
            }

            // Camera follow highest active player
            let targetY = Math.min(
                this.p1.isDead ? 99999 : this.p1.y,
                this.p2.isDead ? 99999 : this.p2.y
            );
            if (targetY === 99999) targetY = Math.min(this.p1.y, this.p2.y);

            this.targetCameraY = targetY - this.worldHeight * 0.55;
            this.cameraY += (this.targetCameraY - this.cameraY) * 0.08;
        } else if (this.gameState === 'gameover') {
            this.particles.update(dt);
        }
    }

    endGame(winner) {
        this.gameState = 'gameover';
        this.winner = winner;
        if (this.sound) this.sound.playWin();
        if (this.onGameOverCallback) {
            this.onGameOverCallback(winner);
        }
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        // Scale canvas to match internal 480x720 coordinates
        const scale = this.canvas.width / this.worldWidth;
        ctx.scale(scale, scale);

        // Background Sky Gradient (Soft Kawaii Day to Sunset to Space)
        const currentAltitude = Math.max(0, -this.cameraY);
        let grad = ctx.createLinearGradient(0, 0, 0, this.worldHeight);

        if (currentAltitude < 2500) {
            // Day Pastel Sky
            grad.addColorStop(0, '#bae6fd');
            grad.addColorStop(0.5, '#fed7aa');
            grad.addColorStop(1, '#fce7f3');
        } else if (currentAltitude < 5000) {
            // Sunset Twilight
            grad.addColorStop(0, '#818cf8');
            grad.addColorStop(0.5, '#f472b6');
            grad.addColorStop(1, '#fed7aa');
        } else {
            // Romantic Space Starry Sky
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(0.5, '#3b0764');
            grad.addColorStop(1, '#1e1b4b');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

        // Draw Ambient Stars in Background
        this.drawBackgroundStars(ctx, currentAltitude);

        // Draw Platforms
        for (const plat of this.platforms) {
            // Culling for performance
            if (plat.y - this.cameraY > -60 && plat.y - this.cameraY < this.worldHeight + 60) {
                plat.draw(ctx, this.cameraY);
            }
        }

        // Draw Particles
        this.particles.draw(ctx, this.cameraY);

        // Draw Players
        this.p1.draw(ctx, this.cameraY);
        this.p2.draw(ctx, this.cameraY);

        // Draw Countdown Screen
        if (this.gameState === 'countdown') {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

            ctx.font = 'bold 72px "Outfit", "Prompt", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 20;

            const text = this.countdown === 0 ? 'START! 💖' : this.countdown;
            ctx.fillText(text, this.worldWidth / 2, this.worldHeight / 2);
            ctx.restore();
        }

        ctx.restore();
    }

    drawBackgroundStars(ctx, altitude) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 25; i++) {
            const sx = (i * 37) % this.worldWidth;
            const sy = ((i * 59) - (this.cameraY * 0.15)) % this.worldHeight;
            const finalY = sy < 0 ? sy + this.worldHeight : sy;
            ctx.beginPath();
            ctx.arc(sx, finalY, 1.5 + (i % 3), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

window.GameEngine = GameEngine;
window.Player = Player;
