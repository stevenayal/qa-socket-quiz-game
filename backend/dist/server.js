"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const socketHandler_1 = require("./socket/socketHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api', roomRoutes_1.default);
(0, socketHandler_1.setupSocketHandlers)(io);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
