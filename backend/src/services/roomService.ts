import { Room, Player, RoomStatus, Answer } from '../models/types';
import { QuestionService } from './questionService';
import { ScoringService } from './scoringService';

export class RoomService {
    private static rooms: Map<string, Room> = new Map();

    static createRoom(hostId: string): Room {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room: Room = {
            id: code, // using code as id for simplicity
            code,
            hostId,
            players: [],
            currentQuestionIndex: -1,
            status: 'lobby',
            createdAt: new Date(),
            questions: [],
            answers: {}
        };
        this.rooms.set(code, room);
        return room;
    }

    static getRoom(code: string): Room | undefined {
        return this.rooms.get(code);
    }

    static addPlayer(roomCode: string, player: Player): Room | undefined {
        const room = this.rooms.get(roomCode);
        if (!room) return undefined;

        if (room.status !== 'lobby') {
            throw new Error('Game already started');
        }

        if (room.players.find(p => p.nickname === player.nickname)) {
            throw new Error('Nickname taken');
        }

        room.players.push(player);
        return room;
    }

    static removePlayer(roomCode: string, playerId: string): Room | undefined {
        const room = this.rooms.get(roomCode);
        if (!room) return undefined;

        room.players = room.players.filter(p => p.id !== playerId);
        if (room.players.length === 0) {
            // Optional: remove room if empty? Keep for now.
        }
        return room;
    }

    static startGame(roomCode: string, category: string): Room | undefined {
        const room = this.rooms.get(roomCode);
        if (!room) return undefined;

        const questions = QuestionService.getQuestionsByCategory(category);
        if (questions.length === 0) {
            // Fallback to all questions if category empty or not found
            room.questions = QuestionService.getAllQuestions();
        } else {
            room.questions = questions;
        }

        room.status = 'in_progress';
        room.currentQuestionIndex = 0;
        return room;
    }

    static nextQuestion(roomCode: string): Room | undefined {
        const room = this.rooms.get(roomCode);
        if (!room) return undefined;

        if (room.currentQuestionIndex < room.questions.length - 1) {
            room.currentQuestionIndex++;
        } else {
            room.status = 'finished';
        }
        return room;
    }

    static submitAnswer(roomCode: string, answer: Answer): { room: Room, score: number, correct: boolean } | undefined {
        const room = this.rooms.get(roomCode);
        if (!room) return undefined;

        const question = room.questions[room.currentQuestionIndex];
        if (question.id !== answer.questionId) return undefined; // Answering wrong question

        // Check if already answered
        if (!room.answers[answer.questionId]) {
            room.answers[answer.questionId] = [];
        }
        const existingAnswer = room.answers[answer.questionId].find(a => a.playerId === answer.playerId); // Actually answers is map playerId -> answers in interface? 
        // Wait, interface said answers: Record<string, Answer[]>; // playerId -> answers
        // But logic here suggests questionId -> answers list.
        // Let's fix the interface or the logic.
        // Logic: We need to know if THIS player answered THIS question.

        // Let's stick to the interface: answers: Record<string, Answer[]>; // playerId -> answers
        // So room.answers[playerId] gives all answers for that player.

        // Initialize if needed
        // Actually, maybe it's better to store by questionId for easier stats?
        // Let's change the interface in my mind or code.
        // I'll assume answers is Record<string, Answer[]> where key is playerId.

        // Wait, I defined it as: answers: Record<string, Answer[]>; // playerId -> answers

        // Let's check if player answered this question
        /*
        const playerAnswers = room.answers[answer.playerId] || [];
        if (playerAnswers.find(a => a.questionId === answer.questionId)) {
            return undefined; // Already answered
        }
        */

        // But for round summary, we want to know who answered what.
        // Let's implement it properly.

        const isCorrect = answer.selectedOptionIndex === question.correctOptionIndex;
        const score = ScoringService.calculateScore(isCorrect, answer.responseTimeMs);

        const player = room.players.find(p => p.id === answer.playerId);
        if (player) {
            // Check if already answered
            // We need a way to track answers per question.
            // Let's use a temporary tracking for the current question or just check the list.
            // I'll use the `answers` map as playerId -> list of answers.

            if (!room.answers[player.id]) {
                room.answers[player.id] = [];
            }

            if (room.answers[player.id].find(a => a.questionId === question.id)) {
                // Already answered
                return { room, score: 0, correct: isCorrect }; // Or throw error
            }

            const fullAnswer = { ...answer, isCorrect, score };
            room.answers[player.id].push(fullAnswer);
            player.score += score;

            return { room, score, correct: isCorrect };
        }

        return undefined;
    }

    static endGame(roomCode: string): Room | undefined {
        const room = this.rooms.get(roomCode);
        if (!room) return undefined;
        room.status = 'finished';
        return room;
    }
}
