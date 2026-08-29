// WebRTC Peer-to-Peer Network Manager using PeerJS for zero-server multiplayer
class NetworkManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.isHost = false;
        this.roomId = null;
        this.connected = false;
        this.onConnectCallback = null;
        this.onDataCallback = null;
        this.onDisconnectCallback = null;
    }

    initHost(roomId, onReady, onPeerJoin) {
        this.isHost = true;
        this.roomId = roomId;

        if (window.Peer) {
            try {
                this.peer = new Peer(roomId, {
                    debug: 1
                });

                this.peer.on('open', (id) => {
                    this.roomId = id;
                    if (onReady) onReady(id);
                });

                this.peer.on('connection', (conn) => {
                    this.conn = conn;
                    this.setupConnection(onPeerJoin);
                });

                this.peer.on('error', (err) => {
                    console.warn("PeerJS host error:", err);
                });
            } catch (e) {
                console.error("PeerJS initialization failed", e);
            }
        }
    }

    joinRoom(roomId, onReady, onConnected) {
        this.isHost = false;
        this.roomId = roomId;

        if (window.Peer) {
            try {
                this.peer = new Peer({
                    debug: 1
                });

                this.peer.on('open', () => {
                    if (onReady) onReady();
                    this.conn = this.peer.connect(roomId, {
                        reliable: true
                    });
                    this.setupConnection(onConnected);
                });

                this.peer.on('error', (err) => {
                    console.warn("PeerJS join error:", err);
                    alert("ไม่พบห้องนี้ หรือห้องกำลังเล่นอยู่! กรุณาตรวจสอบรหัสห้องอีกครั้ง");
                });
            } catch (e) {
                console.error("PeerJS join failed", e);
            }
        }
    }

    setupConnection(onConnected) {
        if (!this.conn) return;

        this.conn.on('open', () => {
            this.connected = true;
            if (onConnected) onConnected();
            if (this.onConnectCallback) this.onConnectCallback();
        });

        this.conn.on('data', (data) => {
            if (this.onDataCallback) {
                this.onDataCallback(data);
            }
        });

        this.conn.on('close', () => {
            this.connected = false;
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        });

        this.conn.on('error', (err) => {
            console.error("Connection error:", err);
        });
    }

    send(data) {
        if (this.conn && this.connected) {
            try {
                this.conn.send(data);
            } catch (e) {
                console.warn("Failed to send network packet:", e);
            }
        }
    }

    disconnect() {
        if (this.conn) {
            this.conn.close();
            this.conn = null;
        }
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.connected = false;
    }
}

window.networkManager = new NetworkManager();
