// Main Application Controller, UI Management, Character Customizer, Love Bet & Multiplayer Sync
document.addEventListener('DOMContentLoaded', () => {
    // Player Customization State
    const state = {
        mode: 'local', // 'local', 'online_host', 'online_join', 'solo'
        p1: {
            name: 'ที่รัก (P1)',
            species: 'bunny',
            color: '#f43f5e',
            accessory: 'bow'
        },
        p2: {
            name: 'แฟนสุดหล่อ (P2)',
            species: 'cat',
            color: '#38bdf8',
            accessory: 'glasses'
        },
        bet: 'คนแพ้ต้องเลี้ยงชาบู! 🍲',
        scores: {
            p1: 0,
            p2: 0
        },
        game: null
    };

    // Load saved scores
    try {
        const saved = JSON.parse(localStorage.getItem('heartjump_scores') || '{}');
        if (saved.p1 !== undefined) state.scores.p1 = saved.p1;
        if (saved.p2 !== undefined) state.scores.p2 = saved.p2;
    } catch (e) { }

    updateScoreDisplay();

    // DOM Elements
    const views = {
        lobby: document.getElementById('view-lobby'),
        customize: document.getElementById('view-customize'),
        room: document.getElementById('view-room'),
        game: document.getElementById('view-game'),
        result: document.getElementById('view-result')
    };

    const canvas = document.getElementById('game-canvas');
    const p1Preview = document.getElementById('p1-preview');
    const p2Preview = document.getElementById('p2-preview');

    function switchView(viewName) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        if (views[viewName]) {
            views[viewName].classList.add('active');
        }
    }

    // Render Preview Avatars
    function renderPreview(canvasEl, config) {
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        CharacterRenderer.draw(ctx, canvasEl.width / 2, canvasEl.height / 2 + 5, 54, 54, {
            species: config.species,
            color: config.color,
            accessory: config.accessory,
            facing: 1
        });
    }

    function refreshPreviews() {
        renderPreview(p1Preview, state.p1);
        renderPreview(p2Preview, state.p2);
    }

    // Initialize Previews
    refreshPreviews();

    // Sound Controls
    const soundToggleBtn = document.getElementById('btn-sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const muted = window.soundEngine.toggleMute();
            soundToggleBtn.innerHTML = muted ? '🔇 ปิดเสียง' : '🔊 เปิดเสียง';
            soundToggleBtn.classList.toggle('muted', muted);
        });
    }

    // Lobby Buttons
    document.getElementById('btn-mode-local').addEventListener('click', () => {
        state.mode = 'local';
        switchView('customize');
        document.getElementById('custom-p2-section').style.display = 'block';
        refreshPreviews();
    });

    document.getElementById('btn-mode-solo').addEventListener('click', () => {
        state.mode = 'solo';
        state.p2.name = 'Bot บอทฝึกซ้อม 🤖';
        switchView('customize');
        document.getElementById('custom-p2-section').style.display = 'none';
        refreshPreviews();
    });

    document.getElementById('btn-mode-online').addEventListener('click', () => {
        switchView('room');
    });

    // Customization Setup
    function setupCustomizer(playerKey, prefix) {
        // Name
        const nameInput = document.getElementById(`${prefix}-name`);
        if (nameInput) {
            nameInput.value = state[playerKey].name;
            nameInput.addEventListener('input', (e) => {
                state[playerKey].name = e.target.value;
            });
        }

        // Species selectors
        document.querySelectorAll(`.${prefix}-species-btn`).forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll(`.${prefix}-species-btn`).forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state[playerKey].species = btn.dataset.species;
                refreshPreviews();
            });
        });

        // Color buttons
        document.querySelectorAll(`.${prefix}-color-btn`).forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll(`.${prefix}-color-btn`).forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state[playerKey].color = btn.dataset.color;
                refreshPreviews();
            });
        });

        // Accessory selectors
        document.querySelectorAll(`.${prefix}-acc-btn`).forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll(`.${prefix}-acc-btn`).forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state[playerKey].accessory = btn.dataset.acc;
                refreshPreviews();
            });
        });
    }

    setupCustomizer('p1', 'p1');
    setupCustomizer('p2', 'p2');

    // Love Bet Selectors
    document.querySelectorAll('.bet-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.bet-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            const customInput = document.getElementById('custom-bet-input');
            if (chip.dataset.bet === 'custom') {
                customInput.style.display = 'block';
                state.bet = customInput.value || 'ตามตกลงกัน!';
            } else {
                customInput.style.display = 'none';
                state.bet = chip.dataset.bet;
            }
        });
    });

    document.getElementById('custom-bet-input').addEventListener('input', (e) => {
        state.bet = e.target.value;
    });

    // Start Game from Customize
    document.getElementById('btn-start-game').addEventListener('click', () => {
        startGame();
    });

    document.getElementById('btn-back-lobby').addEventListener('click', () => {
        switchView('lobby');
    });

    document.getElementById('btn-room-back').addEventListener('click', () => {
        switchView('lobby');
    });

    // Online Room Logic
    const roomCodeInput = document.getElementById('join-room-code');
    const myRoomCodeDisplay = document.getElementById('my-room-code');

    document.getElementById('btn-create-room').addEventListener('click', () => {
        state.mode = 'online_host';
        const randomCode = 'LOVE-' + Math.floor(1000 + Math.random() * 9000);
        myRoomCodeDisplay.innerText = randomCode;
        document.getElementById('host-section').style.display = 'block';
        document.getElementById('join-section').style.display = 'none';

        window.networkManager.initHost(randomCode, () => {
            console.log("Host room ready:", randomCode);
        }, () => {
            // Client joined! Send initial state & launch
            window.networkManager.send({
                type: 'INIT_MATCH',
                p1: state.p1,
                bet: state.bet
            });
            startGame();
        });
    });

    document.getElementById('btn-join-room').addEventListener('click', () => {
        const code = roomCodeInput.value.trim().toUpperCase();
        if (!code) {
            alert('กรุณากรอกรหัสห้อง!');
            return;
        }
        state.mode = 'online_join';
        document.getElementById('join-status').innerText = '⏳ กำลังเชื่อมต่อห้อง...';

        window.networkManager.joinRoom(code, () => {
            console.log("Connected to host peer");
        }, () => {
            document.getElementById('join-status').innerText = '💖 เชื่อมต่อสำเร็จ! กำลังเข้าเกม...';
        });

        window.networkManager.onDataCallback = (data) => {
            if (data.type === 'INIT_MATCH') {
                state.p2 = data.p1; // Host is P2 from Joiner perspective
                state.bet = data.bet;
                startGame();
            } else if (data.type === 'INPUT') {
                if (state.game) {
                    state.game.p2Keys = data.keys;
                }
            }
        };
    });

    // Game Launcher
    function startGame() {
        switchView('game');

        // Resize Canvas to fit screen aspect ratio
        resizeCanvas();

        state.game = new GameEngine(canvas, state.p1, state.p2, state.mode);
        state.game.start();

        // Update HUD
        document.getElementById('hud-p1-name').innerText = state.p1.name;
        document.getElementById('hud-p2-name').innerText = state.p2.name;
        document.getElementById('hud-bet-text').innerText = 'เดิมพัน: ' + state.bet;

        state.game.onGameOverCallback = (winner) => {
            setTimeout(() => {
                showResult(winner);
            }, 1200);
        };
    }

    function resizeCanvas() {
        const container = document.getElementById('canvas-container');
        const width = Math.min(window.innerWidth, 480);
        const height = Math.min(window.innerHeight - 80, 720);
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', () => {
        if (state.game && views.game.classList.contains('active')) {
            resizeCanvas();
        }
    });

    // Result Screen
    function showResult(winner) {
        switchView('result');
        const winnerText = document.getElementById('result-winner-name');
        const loserText = document.getElementById('result-loser-name');
        const betText = document.getElementById('result-bet-action');

        let loserName = '';
        if (winner.id === 1) {
            state.scores.p1++;
            winnerText.innerText = `🎉 ${state.p1.name} ชนะ! 👑`;
            loserName = state.p2.name;
        } else {
            state.scores.p2++;
            winnerText.innerText = `🎉 ${state.p2.name} ชนะ! 👑`;
            loserName = state.p1.name;
        }

        loserText.innerText = `ขอแสดงความเสียใจกับ ${loserName} ด้วยนะจ๊ะ 😜`;
        betText.innerText = `📜 บทลงโทษ: ${state.bet}`;

        updateScoreDisplay();
        saveScores();
    }

    function updateScoreDisplay() {
        const p1ScoreEl = document.getElementById('score-p1-val');
        const p2ScoreEl = document.getElementById('score-p2-val');
        if (p1ScoreEl) p1ScoreEl.innerText = state.scores.p1;
        if (p2ScoreEl) p2ScoreEl.innerText = state.scores.p2;
    }

    function saveScores() {
        localStorage.setItem('heartjump_scores', JSON.stringify(state.scores));
    }

    // Play Again / Reset Buttons
    document.getElementById('btn-play-again').addEventListener('click', () => {
        startGame();
    });

    document.getElementById('btn-result-lobby').addEventListener('click', () => {
        switchView('lobby');
    });

    document.getElementById('btn-reset-scores').addEventListener('click', () => {
        if (confirm('ต้องการรีเซ็ตคะแนนสะสมทั้งหมดใช่หรือไม่?')) {
            state.scores.p1 = 0;
            state.scores.p2 = 0;
            saveScores();
            updateScoreDisplay();
        }
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
        if (!state.game || state.game.gameState !== 'playing') return;

        // Player 1 (A, D, W, Space/E for item)
        if (e.key === 'a' || e.key === 'A') state.game.p1Keys.left = true;
        if (e.key === 'd' || e.key === 'D') state.game.p1Keys.right = true;
        if (e.key === 'w' || e.key === 'W') state.game.p1Keys.jump = true;
        if (e.key === 'e' || e.key === 'E' || e.key === ' ') state.game.p1Keys.useItem = true;

        // Player 2 (Arrow keys, Enter/Shift for item)
        if (state.mode === 'local') {
            if (e.key === 'ArrowLeft') state.game.p2Keys.left = true;
            if (e.key === 'ArrowRight') state.game.p2Keys.right = true;
            if (e.key === 'ArrowUp') state.game.p2Keys.jump = true;
            if (e.key === 'Enter' || e.key === 'Shift') state.game.p2Keys.useItem = true;
        }

        // Online sync
        if (state.mode.startsWith('online')) {
            window.networkManager.send({
                type: 'INPUT',
                keys: state.game.p1Keys
            });
        }
    });

    window.addEventListener('keyup', (e) => {
        if (!state.game) return;

        if (e.key === 'a' || e.key === 'A') state.game.p1Keys.left = false;
        if (e.key === 'd' || e.key === 'D') state.game.p1Keys.right = false;
        if (e.key === 'w' || e.key === 'W') state.game.p1Keys.jump = false;

        if (state.mode === 'local') {
            if (e.key === 'ArrowLeft') state.game.p2Keys.left = false;
            if (e.key === 'ArrowRight') state.game.p2Keys.right = false;
            if (e.key === 'ArrowUp') state.game.p2Keys.jump = false;
        }

        if (state.mode.startsWith('online')) {
            window.networkManager.send({
                type: 'INPUT',
                keys: state.game.p1Keys
            });
        }
    });

    // Touch & On-screen Control Buttons
    function setupTouchButton(id, onDown, onUp) {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            onDown();
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            onUp();
        });
        btn.addEventListener('mousedown', onDown);
        btn.addEventListener('mouseup', onUp);
    }

    setupTouchButton('btn-touch-p1-left', () => { if (state.game) state.game.p1Keys.left = true; }, () => { if (state.game) state.game.p1Keys.left = false; });
    setupTouchButton('btn-touch-p1-right', () => { if (state.game) state.game.p1Keys.right = true; }, () => { if (state.game) state.game.p1Keys.right = false; });
    setupTouchButton('btn-touch-p1-jump', () => { if (state.game) state.game.p1Keys.jump = true; }, () => { if (state.game) state.game.p1Keys.jump = false; });
    setupTouchButton('btn-touch-p1-item', () => { if (state.game) state.game.p1Keys.useItem = true; }, () => { if (state.game) state.game.p1Keys.useItem = false; });

    setupTouchButton('btn-touch-p2-left', () => { if (state.game) state.game.p2Keys.left = true; }, () => { if (state.game) state.game.p2Keys.left = false; });
    setupTouchButton('btn-touch-p2-right', () => { if (state.game) state.game.p2Keys.right = true; }, () => { if (state.game) state.game.p2Keys.right = false; });
    setupTouchButton('btn-touch-p2-jump', () => { if (state.game) state.game.p2Keys.jump = true; }, () => { if (state.game) state.game.p2Keys.jump = false; });
    setupTouchButton('btn-touch-p2-item', () => { if (state.game) state.game.p2Keys.useItem = true; }, () => { if (state.game) state.game.p2Keys.useItem = false; });
});
