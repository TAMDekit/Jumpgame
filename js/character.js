// Cute Kawaii Character Renderer with Squash & Stretch, Accessories and Custom Colors
class CharacterRenderer {
    static SPECIES = {
        BUNNY: 'bunny',
        CAT: 'cat',
        BEAR: 'bear',
        SHIBA: 'shiba',
        PENGUIN: 'penguin'
    };

    static ACCESSORIES = {
        NONE: 'none',
        CROWN: 'crown',
        BOW: 'bow',
        GLASSES: 'glasses',
        ANGEL_WINGS: 'wings',
        FLOWER: 'flower'
    };

    static draw(ctx, x, y, width, height, options = {}) {
        const {
            species = 'bunny',
            color = '#ff85a2',
            facing = 1, // 1 = right, -1 = left
            accessory = 'bow',
            vx = 0,
            vy = 0,
            isFrozen = false,
            hasShield = false,
            hasRocket = false,
            blink = false,
            name = '',
            isWinner = false
        } = options;

        ctx.save();
        ctx.translate(x, y);

        // Squash and stretch physics
        let scaleX = 1;
        let scaleY = 1;
        if (Math.abs(vy) > 2) {
            scaleY = 1 + Math.min(0.25, Math.abs(vy) * 0.015);
            scaleX = 1 - Math.min(0.2, Math.abs(vy) * 0.012);
        }

        // Tilt based on horizontal velocity
        const tilt = Math.max(-0.25, Math.min(0.25, vx * 0.03));
        ctx.rotate(tilt);
        ctx.scale(scaleX * (facing >= 0 ? 1 : -1), scaleY);

        const r = width / 2;

        // Shadow / Glow
        if (hasShield) {
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        if (hasRocket) {
            // Rocket Fire effect at feet
            ctx.save();
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(-6, r);
            ctx.lineTo(0, r + 12 + Math.random() * 6);
            ctx.lineTo(6, r);
            ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(-3, r);
            ctx.lineTo(0, r + 6 + Math.random() * 4);
            ctx.lineTo(3, r);
            ctx.fill();
            ctx.restore();
        }

        // Body base
        ctx.fillStyle = isFrozen ? '#7dd3fc' : color;
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 2;

        // Draw species-specific ears/features behind body
        if (species === 'bunny') {
            // Bunny Long Ears
            ctx.beginPath();
            ctx.ellipse(-8, -r - 10, 5, 14, -0.15, 0, Math.PI * 2);
            ctx.ellipse(8, -r - 10, 5, 14, 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Inner ear
            ctx.fillStyle = '#ffb3c6';
            ctx.beginPath();
            ctx.ellipse(-8, -r - 10, 2.5, 9, -0.15, 0, Math.PI * 2);
            ctx.ellipse(8, -r - 10, 2.5, 9, 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isFrozen ? '#7dd3fc' : color;
        } else if (species === 'cat') {
            // Cat pointy ears
            ctx.beginPath();
            ctx.moveTo(-r + 2, -r + 4);
            ctx.lineTo(-r + 4, -r - 10);
            ctx.lineTo(-2, -r + 2);
            ctx.closePath();
            ctx.moveTo(2, -r + 2);
            ctx.lineTo(r - 4, -r - 10);
            ctx.lineTo(r - 2, -r + 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Inner cat ears
            ctx.fillStyle = '#ffb3c6';
            ctx.beginPath();
            ctx.moveTo(-r + 5, -r + 3);
            ctx.lineTo(-r + 6, -r - 6);
            ctx.lineTo(-4, -r + 1);
            ctx.closePath();
            ctx.moveTo(4, -r + 1);
            ctx.lineTo(r - 6, -r - 6);
            ctx.lineTo(r - 5, -r + 3);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = isFrozen ? '#7dd3fc' : color;
        } else if (species === 'bear' || species === 'shiba') {
            // Round / Cute Ears
            ctx.beginPath();
            ctx.arc(-r + 4, -r + 3, 7, 0, Math.PI * 2);
            ctx.arc(r - 4, -r + 3, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = species === 'shiba' ? '#fcd34d' : '#ffb3c6';
            ctx.beginPath();
            ctx.arc(-r + 4, -r + 3, 3.5, 0, Math.PI * 2);
            ctx.arc(r - 4, -r + 3, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isFrozen ? '#7dd3fc' : color;
        }

        // Angel Wings accessory (drawn behind)
        if (accessory === 'wings') {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = '#e0e7ff';
            ctx.lineWidth = 1.5;
            // Left wing
            ctx.beginPath();
            ctx.ellipse(-r - 6, -2, 10, 5, -0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Right wing
            ctx.beginPath();
            ctx.ellipse(r + 6, -2, 10, 5, 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // Main Body (Round Fluffy Ball)
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Penguin White Belly
        if (species === 'penguin') {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(0, 4, r * 0.65, r * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Cute Face Elements
        // Blush Cheeks
        ctx.fillStyle = '#ff4d79';
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.ellipse(-r * 0.52, 2, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.ellipse(r * 0.52, 2, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Eyes
        ctx.fillStyle = '#1e293b';
        if (blink || isFrozen) {
            // Closed / Winking / Sleeping eyes (> < or - -)
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(-r * 0.35, -2, 3.5, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(r * 0.35, -2, 3.5, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
        } else {
            // Big Sparkling Anime Eyes
            // Left eye
            ctx.beginPath();
            ctx.ellipse(-r * 0.35, -2, 3.5, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Right eye
            ctx.beginPath();
            ctx.ellipse(r * 0.35, -2, 3.5, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Eye Highlights
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-r * 0.35 - 1, -4, 1.5, 0, Math.PI * 2);
            ctx.arc(r * 0.35 - 1, -4, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mouth / Nose
        if (species === 'penguin') {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(-3, 0);
            ctx.lineTo(3, 0);
            ctx.lineTo(0, 4);
            ctx.closePath();
            ctx.fill();
        } else if (species === 'cat' || species === 'bunny') {
            // Cute 'w' mouth
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(-2, 3, 2, 0, Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(2, 3, 2, 0, Math.PI);
            ctx.stroke();
        } else {
            // Tiny nose dot
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(0, 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Accessories on top
        if (accessory === 'crown') {
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-10, -r + 2);
            ctx.lineTo(-12, -r - 10);
            ctx.lineTo(-5, -r - 5);
            ctx.lineTo(0, -r - 12);
            ctx.lineTo(5, -r - 5);
            ctx.lineTo(12, -r - 10);
            ctx.lineTo(10, -r + 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Ruby gem
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, -r - 4, 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (accessory === 'bow') {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.moveTo(r * 0.4, -r + 2);
            ctx.lineTo(r * 0.8, -r - 6);
            ctx.lineTo(r * 0.8, -r + 6);
            ctx.closePath();
            ctx.moveTo(r * 0.4, -r + 2);
            ctx.lineTo(0, -r - 6);
            ctx.lineTo(0, -r + 6);
            ctx.closePath();
            ctx.fill();
            // Center knot
            ctx.fillStyle = '#ffe4e6';
            ctx.beginPath();
            ctx.arc(r * 0.4, -r + 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (accessory === 'glasses') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-r * 0.7, -5, r * 0.6, 5);
            ctx.fillRect(r * 0.1, -5, r * 0.6, 5);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-r * 0.1, -3);
            ctx.lineTo(r * 0.1, -3);
            ctx.stroke();
        } else if (accessory === 'flower') {
            ctx.fillStyle = '#fb7185';
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
                ctx.beginPath();
                ctx.arc(r * 0.4 + Math.cos(angle) * 4, -r + 2 + Math.sin(angle) * 4, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(r * 0.4, -r + 2, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Frozen ice overlay
        if (isFrozen) {
            ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.strokeRect(-r - 4, -r - 4, (r + 4) * 2, (r + 4) * 2);
            ctx.fillRect(-r - 4, -r - 4, (r + 4) * 2, (r + 4) * 2);
        }

        ctx.restore();

        // Player Name Tag & Indicator
        if (name) {
            ctx.save();
            ctx.font = 'bold 12px "Outfit", "Prompt", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            const txtWidth = ctx.measureText(name).width + 12;
            ctx.beginPath();
            ctx.roundRect(x - txtWidth / 2, y - height / 2 - 20, txtWidth, 18, 9);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.fillText(name, x, y - height / 2 - 6);

            // Winner Crown icon
            if (isWinner) {
                ctx.font = '16px sans-serif';
                ctx.fillText('👑', x, y - height / 2 - 22);
            }
            ctx.restore();
        }
    }
}

window.CharacterRenderer = CharacterRenderer;
