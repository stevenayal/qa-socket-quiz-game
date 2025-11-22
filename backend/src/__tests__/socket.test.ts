import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import { AddressInfo } from 'net';
import { setupSocketHandlers } from '../socket/socketHandler';

describe('Game Socket Logic', () => {
    let io: Server;
    let serverSocket: any;
    let clientSocket: any;
    let httpServer: any;
    let port: number;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);
        setupSocketHandlers(io);

        httpServer.listen(() => {
            port = (httpServer.address() as AddressInfo).port;
            clientSocket = Client(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
        httpServer.close();
    });

    test('should allow a client to connect', (done) => {
        expect(clientSocket.connected).toBe(true);
        done();
    });

    test('should allow a host to create a room', (done) => {
        clientSocket.emit('host:create_room', (response: any) => {
            expect(response.success).toBe(true);
            expect(response.roomCode).toBeDefined();
            expect(response.roomCode.length).toBe(6);
            done();
        });
    });

    test('should allow a player to join an existing room', (done) => {
        // First create a room
        clientSocket.emit('host:create_room', (createRes: any) => {
            const roomCode = createRes.roomCode;

            // Create a second client to join as player
            const playerSocket = Client(`http://localhost:${port}`);

            playerSocket.on('connect', () => {
                playerSocket.emit('player:join_room', {
                    roomCode: roomCode,
                    nickname: 'TestPlayer'
                }, (joinRes: any) => {
                    expect(joinRes.success).toBe(true);
                    expect(joinRes.playerId).toBeDefined();
                    playerSocket.close();
                    done();
                });
            });
        });
    });

    test('should not allow joining a non-existent room', (done) => {
        clientSocket.emit('player:join_room', {
            roomCode: 'INVALID',
            nickname: 'TestPlayer'
        }, (response: any) => {
            expect(response.success).toBe(false);
            expect(response.error).toBeDefined();
            done();
        });
    });
});
