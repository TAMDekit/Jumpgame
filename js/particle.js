// Particle System for Kawaii Effects (Hearts, Stars, Confetti, Sparks, Trail)
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(p) {
        this.particles.push({
            x: p.x || 0,
            y: p.y || 0,
            vx: p.vx || (Math.random() - 0.5) * 4,
            vy: p.vy || (Math.random() - 0.5) * 4,
            size: p.size || 8,
            color: p.color || '#ff6b8b',
            alpha: 1,
            life: p.life || 1,
            maxLife: p.life || 1,
            type: p.type || 'circle', // 'circle', 'heart', 'star', 'confetti', 'cloud'
            rotation: p.rotation || 0,
            vRot: p.vRot || (Math.random() - 0.5) * 0.2,
            gravity: p.gravity !== undefined ? p.gravity : 0.05
        });
    }

    // Spawn Heart Burst
    spawnHearts(x, y, count = 8, color = '#ff4d79') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            this.add({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                size: 8 + Math.random() * 8,
                color,
                life: 0.8 + Math.random() * 0.5,
                type: 'heart',
                gravity: 0.04
            });
        }
    }

    // Spawn Jump Dust / Cloud
    spawnDust(x, y, count = 6, color = 'rgba(255, 255, 255, 0.8)') {
        for (let i = 0; i < count; i++) {
            this.add({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 5,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 1.5,
                size: 4 + Math.random() * 6,
                color,
                life: 0.4 + Math.random() * 0.3,
                type: 'cloud',
                gravity: -0.01
            });
        }
    }

    // Spawn Confetti Burst for Winner
    spawnConfetti(x, y, count = 50) {
        const colors = ['#ff4d79', '#ffb6c1', '#a855f7', '#38bdf8', '#fbbf24', '#34d399', '#f43f5e'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI / 4) + Math.random() * (Math.PI / 2);
            const speed = 6 + Math.random() * 10;
            this.add({
                x, y,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 12 - 4,
                size: 6 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.5 + Math.random() * 1.5,
                type: 'confetti',
                gravity: 0.25,
                vRot: (Math.random() - 0.5) * 0.4
            });
        }
    }

    // Spawn Rocket / Speed Trail
    spawnRocketTrail(x, y, color = '#fbbf24') {
        for (let i = 0; i < 3; i++) {
            this.add({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 6,
                vx: (Math.random() - 0.5) * 1.5,
                vy: 3 + Math.random() * 3,
                size: 6 + Math.random() * 6,
                color,
                life: 0.35,
                type: 'star',
                gravity: 0.05
            });
        }
    }

    // Spawn Ice Crystals for Freeze
    spawnIceCrystals(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5;
            this.add({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 6 + Math.random() * 6,
                color: '#38bdf8',
                life: 0.8 + Math.random() * 0.4,
                type: 'star',
                gravity: 0.02
            });
        }
    }

    update(dt = 0.016) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            p.alpha = Math.max(0, p.life / p.maxLife);
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.vRot;
        }
    }

    draw(ctx, cameraY = 0) {
        ctx.save();
        for (const p of this.particles) {
            const drawY = p.y - cameraY;
            ctx.globalAlpha = p.alpha;
            ctx.save();
            ctx.translate(p.x, drawY);
            ctx.rotate(p.rotation);

            if (p.type === 'heart') {
                this.drawHeart(ctx, p.size, p.color);
            } else if (p.type === 'star') {
                this.drawStar(ctx, p.size, p.color);
            } else if (p.type === 'confetti') {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.5);
            } else if (p.type === 'cloud') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        ctx.restore();
    }

    drawHeart(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
        ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
    }

    drawStar(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.45;
        let rot = (Math.PI / 2) * 3;
        let x = 0, y = 0;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    clear() {
        this.particles = [];
    }
}

window.ParticleSystem = ParticleSystem;
