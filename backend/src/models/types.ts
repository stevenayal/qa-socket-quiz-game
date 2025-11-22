export interface Player {
    id: string;
    nickname: string;
    score: number;
    connected: boolean;
}

export interface Question {
    id: string;
    category: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
}

export type RoomStatus = 'lobby' | 'in_progress' | 'finished';

export interface Answer {
    playerId: string;
    questionId: string;
    selectedOptionIndex: number;
    responseTimeMs: number;
    isCorrect: boolean;
    score: number;
}

export interface Room {
    id: string;
    code: string;
    hostId: string;
    players: Player[];
    currentQuestionIndex: number;
    status: RoomStatus;
    createdAt: Date;
    questions: Question[];
    answers: Record<string, Answer[]>; // playerId -> answers
}
