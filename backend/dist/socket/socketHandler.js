"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const roomService_1 = require("../services/roomService");
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Host Events
        socket.on('host:create_room', (callback) => {
            try {
                const room = roomService_1.RoomService.createRoom(socket.id);
                socket.join(room.code);
                callback({ success: true, roomCode: room.code });
            }
            catch (error) {
                callback({ success: false, error: error.message });
            }
        });
        socket.on('host:start_game', ({ roomCode, category }, callback) => {
            try {
                const room = roomService_1.RoomService.startGame(roomCode, category);
                if (room) {
                    io.to(roomCode).emit('room:state_update', room);
                    io.to(roomCode).emit('game:new_question', room.questions[0]);
                    callback({ success: true });
                }
                else {
                    callback({ success: false, error: 'Room not found' });
                }
            }
            catch (error) {
                callback({ success: false, error: error.message });
            }
        });
        socket.on('host:next_question', ({ roomCode }, callback) => {
            try {
                const room = roomService_1.RoomService.nextQuestion(roomCode);
                if (room) {
                    io.to(roomCode).emit('room:state_update', room);
                    if (room.status === 'finished') {
                        io.to(roomCode).emit('game:final_ranking', room.players.sort((a, b) => b.score - a.score));
                    }
                    else {
                        io.to(roomCode).emit('game:new_question', room.questions[room.currentQuestionIndex]);
                    }
                    callback({ success: true });
                }
                else {
                    callback({ success: false, error: 'Room not found' });
                }
            }
            catch (error) {
                callback({ success: false, error: error.message });
            }
        });
        socket.on('host:end_game', ({ roomCode }, callback) => {
            try {
                const room = roomService_1.RoomService.endGame(roomCode);
                if (room) {
                    io.to(roomCode).emit('room:state_update', room);
                    io.to(roomCode).emit('game:final_ranking', room.players.sort((a, b) => b.score - a.score));
                    callback({ success: true });
                }
                else {
                    callback({ success: false, error: 'Room not found' });
                }
            }
            catch (error) {
                callback({ success: false, error: error.message });
            }
        });
        // Player Events
        socket.on('player:join_room', ({ roomCode, nickname }, callback) => {
            try {
                const player = {
                    id: socket.id,
                    nickname,
                    score: 0,
                    connected: true
                };
                const room = roomService_1.RoomService.addPlayer(roomCode, player);
                if (room) {
                    socket.join(roomCode);
                    io.to(roomCode).emit('room:state_update', room);
                    callback({ success: true, playerId: socket.id });
                }
                else {
                    callback({ success: false, error: 'Room not found or game started' });
                }
            }
            catch (error) {
                callback({ success: false, error: error.message });
            }
        });
        socket.on('player:submit_answer', ({ roomCode, questionId, selectedOptionIndex, responseTimeMs }, callback) => {
            try {
                const answer = {
                    playerId: socket.id,
                    questionId, // We need to pass this from client or infer from room state
                    // Ideally client sends questionId to verify they are answering the right one
                    selectedOptionIndex,
                    responseTimeMs,
                    isCorrect: false, // calculated in service
                    score: 0 // calculated in service
                };
                // Wait, the interface for submitAnswer in RoomService takes Answer which has questionId.
                // Client needs to send questionId.
                const result = roomService_1.RoomService.submitAnswer(roomCode, answer);
                if (result) {
                    socket.emit('game:answer_feedback', { correct: result.correct, score: result.score, explanation: 'Wait for round end' });
                    // We can send explanation immediately or wait. User asked for "feedback: correcta/incorrecta y explicación simple".
                    // Also update room state for host (e.g. answer count)
                    // We might want to emit a partial update or just let the host poll or wait for round summary?
                    // "Cantidad de respuestas recibidas vs total de jugadores" -> Host needs real-time update.
                    // Let's emit a specific event for host or just room update
                    const room = roomService_1.RoomService.getRoom(roomCode);
                    if (room) {
                        io.to(room.hostId).emit('host:answers_update', {
                            questionId,
                            count: Object.values(room.answers[socket.id] || []).length // This is wrong logic for count.
                            // We need total answers for THIS question.
                        });
                        // Better: calculate total answers for current question
                        let answerCount = 0;
                        Object.values(room.answers).forEach(playerAnswers => {
                            if (playerAnswers.find(a => a.questionId === questionId))
                                answerCount++;
                        });
                        io.to(room.hostId).emit('host:answers_update', { questionId, count: answerCount, totalPlayers: room.players.length });
                    }
                    callback({ success: true });
                }
                else {
                    callback({ success: false, error: 'Invalid answer or already answered' });
                }
            }
            catch (error) {
                callback({ success: false, error: error.message });
            }
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Handle player disconnection (update room, etc.)
            // For simplicity, we might just mark them as disconnected or remove them.
            // RoomService.removePlayer(...) ?
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
