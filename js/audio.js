// Web Audio API Synthesizer for Kawaii & 8-Bit Retro Sound Effects + Chiptune BGM
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.bgmStep = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.bgmPlaying) {
            this.stopBGM();
        } else if (!this.isMuted && !this.bgmPlaying) {
            this.startBGM();
        }
        return this.isMuted;
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, endFreq = null) {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            if (endFreq) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), this.ctx.currentTime + duration);
            }

            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio error:", e);
        }
    }

    // Sound FX
    playJump(isHigh = false) {
        if (isHigh) {
            this.playTone(320, 'triangle', 0.25, 0.25, 750);
        } else {
            this.playTone(260, 'sine', 0.18, 0.2, 580);
        }
    }

    playDoubleJump() {
        this.playTone(450, 'triangle', 0.15, 0.25, 900);
    }

    playSpring() {
        this.playTone(200, 'sawtooth', 0.35, 0.2, 880);
    }

    playCollect() {
        if (this.isMuted) return;
        this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.12, 0.15);
            }, i * 45);
        });
    }

    playFreeze() {
        if (this.isMuted) return;
        this.init();
        this.playTone(800, 'square', 0.25, 0.15, 200);
    }

    playSwap() {
        if (this.isMuted) return;
        this.init();
        this.playTone(300, 'sawtooth', 0.2, 0.2, 600);
        setTimeout(() => this.playTone(600, 'sawtooth', 0.2, 0.2, 300), 100);
    }

    playRocket() {
        if (this.isMuted) return;
        this.init();
        this.playTone(150, 'sawtooth', 0.6, 0.25, 900);
    }

    playHurt() {
        this.playTone(250, 'square', 0.2, 0.2, 80);
    }

    playWin() {
        if (this.isMuted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
        const times = [0, 120, 240, 360, 500, 700];
        notes.forEach((note, i) => {
            setTimeout(() => {
                this.playTone(note, 'triangle', 0.35, 0.3);
            }, times[i]);
        });
    }

    playCountdown(final = false) {
        if (final) {
            this.playTone(880, 'sine', 0.4, 0.3);
        } else {
            this.playTone(440, 'sine', 0.2, 0.25);
        }
    }

    // Cute Chiptune BGM Generator
    startBGM() {
        if (this.isMuted || this.bgmPlaying) return;
        this.init();
        this.bgmPlaying = true;
        this.bgmStep = 0;

        // Cute melody notes (C major pentatonic / happy scales)
        const melody = [
            523.25, 0, 659.25, 587.33, 523.25, 783.99, 659.25, 0,
            880.00, 783.99, 659.25, 587.33, 659.25, 0, 523.25, 0,
            587.33, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25,
            783.99, 587.33, 523.25, 659.25, 523.25, 0, 0, 0
        ];
        
        const bass = [
            261.63, 261.63, 329.63, 329.63, 349.23, 349.23, 392.00, 392.00,
            261.63, 261.63, 329.63, 329.63, 392.00, 392.00, 261.63, 261.63
        ];

        const stepTime = 160; // ms per 16th note

        const tick = () => {
            if (!this.bgmPlaying || this.isMuted) return;

            const mNote = melody[this.bgmStep % melody.length];
            if (mNote > 0) {
                this.playTone(mNote, 'sine', 0.12, 0.045);
            }

            if (this.bgmStep % 2 === 0) {
                const bNote = bass[(Math.floor(this.bgmStep / 2)) % bass.length];
                if (bNote > 0) {
                    this.playTone(bNote, 'triangle', 0.18, 0.05);
                }
            }

            this.bgmStep++;
            this.bgmTimer = setTimeout(tick, stepTime);
        };

        tick();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

window.soundEngine = new SoundEngine();
