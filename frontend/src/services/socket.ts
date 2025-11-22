import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

class SocketService {
    public socket: Socket | null = null;

    connect() {
        if (!this.socket) {
            this.socket = io(URL);
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }
}

export const socketService = new SocketService();
