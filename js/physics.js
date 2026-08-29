// Platform types, Item generation, and Collision Physics
class Platform {
    constructor(x, y, width = 80, height = 18, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'normal', 'spring', 'moving', 'fragile', 'ice', 'finish'
        
        // Moving platform properties
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 1.5);
        this.minX = 20;
        this.maxX = 480 - width - 20;

        // Fragile platform state
        this.broken = false;
        this.breakTimer = 0;
        this.isStepped = false;

        // Has item on top
        this.item = null;
    }

    update(dt = 0.016, worldWidth = 480) {
        if (this.type === 'moving') {
            this.x += this.vx;
            if (this.x < 15) {
                this.x = 15;
                this.vx *= -1;
            } else if (this.x + this.width > worldWidth - 15) {
                this.x = worldWidth - 15 - this.width;
                this.vx *= -1;
            }
        }

        if (this.type === 'fragile' && this.isStepped && !this.broken) {
            this.breakTimer += dt;
            if (this.breakTimer >= 0.4) {
                this.broken = true;
            }
        }
    }

    draw(ctx, cameraY = 0) {
        if (this.broken) return;

        const drawY = this.y - cameraY;
        ctx.save();
        ctx.translate(this.x, drawY);

        if (this.type === 'finish') {
            // Castle / Goal Platform
            ctx.fillStyle = 'linear-gradient(to right, #ec4899, #8b5cf6)';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.roundRect(0, 0, this.width, this.height * 1.5, 10);
            ctx.fill();

            // Finish Flag / Arch
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🏰 💖 FINISH 💖 🏰', this.width / 2, -15);
            ctx.restore();
            return;
        }

        // Platform Styling based on type
        if (this.type === 'fragile') {
            ctx.fillStyle = this.isStepped ? '#fca5a5' : '#fed7aa';
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.5;
        } else if (this.type === 'ice') {
            ctx.fillStyle = '#bae6fd';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
        } else if (this.type === 'moving') {
            ctx.fillStyle = '#ddd6fe';
            ctx.strokeStyle = '#a78bfa';
            ctx.lineWidth = 2;
        } else if (this.type === 'spring') {
            ctx.fillStyle = '#fbcfe8';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2;
        } else {
            // Normal Cloud
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#fbcfe8';
            ctx.lineWidth = 2;
        }

        // Draw Fluffy Cloud Platform
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowOffsetY = 3;
        ctx.beginPath();
        ctx.roundRect(0, 0, this.width, this.height, this.height / 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowOffsetY = 0;

        // Spring gadget on top
        if (this.type === 'spring') {
            ctx.fillStyle = '#ec4899';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('💖', this.width / 2, 2);
        }

        // Item box on top
        if (this.item && !this.item.collected) {
            this.item.draw(ctx, this.width / 2, -16);
        }

        ctx.restore();
    }
}

class ItemBox {
    constructor(type) {
        this.type = type; // 'ROCKET', 'FREEZE', 'SWAP', 'SHIELD', 'SPRING_BOOTS'
        this.collected = false;
        this.floatOffset = 0;
    }

    draw(ctx, x, y) {
        this.floatOffset = Math.sin(Date.now() * 0.005) * 4;
        ctx.save();
        ctx.translate(x, y + this.floatOffset);

        // Box Glow
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let icon = '🎁';
        if (this.type === 'ROCKET') icon = '🚀';
        else if (this.type === 'FREEZE') icon = '❄️';
        else if (this.type === 'SWAP') icon = '🔄';
        else if (this.type === 'SHIELD') icon = '🛡️';
        else if (this.type === 'SPRING_BOOTS') icon = '🦘';

        ctx.fillText(icon, 0, 0);
        ctx.restore();
    }
}

class LevelGenerator {
    static generateLevel(seed = 12345, targetHeight = 10000, worldWidth = 480) {
        const platforms = [];
        const items = ['ROCKET', 'FREEZE', 'SWAP', 'SHIELD', 'SPRING_BOOTS'];

        // Pseudo-random generator using seed for sync in multiplayer
        let s = seed;
        const random = () => {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };

        // Starting Ground Platforms
        platforms.push(new Platform(worldWidth / 2 - 120, 520, 240, 24, 'normal'));
        platforms.push(new Platform(60, 440, 100, 18, 'normal'));
        platforms.push(new Platform(320, 440, 100, 18, 'normal'));

        let currentY = 360;
        const finishY = -targetHeight;

        while (currentY > finishY) {
            const gap = 60 + random() * 55;
            currentY -= gap;

            const platWidth = 70 + random() * 35;
            const x = 20 + random() * (worldWidth - platWidth - 40);

            // Determine platform type
            const randType = random();
            let type = 'normal';
            if (randType < 0.20) {
                type = 'moving';
            } else if (randType < 0.35) {
                type = 'spring';
            } else if (randType < 0.48) {
                type = 'fragile';
            } else if (randType < 0.58) {
                type = 'ice';
            }

            const plat = new Platform(x, currentY, platWidth, 18, type);

            // Spawn Item Chance
            if (type !== 'fragile' && random() < 0.18) {
                const itemType = items[Math.floor(random() * items.length)];
                plat.item = new ItemBox(itemType);
            }

            platforms.push(plat);
        }

        // Finish Goal at the Top
        platforms.push(new Platform(worldWidth / 2 - 140, finishY - 50, 280, 30, 'finish'));

        return platforms;
    }
}

window.Platform = Platform;
window.ItemBox = ItemBox;
window.LevelGenerator = LevelGenerator;
