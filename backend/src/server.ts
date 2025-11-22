import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/roomRoutes';
import { setupSocketHandlers } from './socket/socketHandler';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api', roomRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

setupSocketHandlers(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
