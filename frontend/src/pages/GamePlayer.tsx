import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CountdownTimer } from '../components/CountdownTimer';
import { socketService } from '../services/socket';
import { useGameStore } from '../store/gameStore';
import type { Question } from '../types';

export const GamePlayer: React.FC = () => {
    const navigate = useNavigate();
    const { room, setRoom } = useGameStore();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; score: number; explanation: string } | null>(null);
    const [timerStartedAt, setTimerStartedAt] = useState<number>(0);

    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) {
            navigate('/');
            return;
        }

        socket.on('game:new_question', (question: Question) => {
            setCurrentQuestion(question);
            setSelectedOption(null);
            setFeedback(null);
            setTimerStartedAt(Date.now());
        });

        socket.on('game:answer_feedback', (data) => {
            setFeedback(data);
        });

        socket.on('room:state_update', (updatedRoom) => {
            setRoom(updatedRoom);
            if (updatedRoom.status === 'finished') {
                navigate('/results');
            }
        });

        return () => {
            socket.off('game:new_question');
            socket.off('game:answer_feedback');
            socket.off('room:state_update');
        };
    }, [navigate, setRoom]);

    const submitAnswer = (index: number) => {
        if (selectedOption !== null || !room || !currentQuestion) return;

        const responseTimeMs = Date.now() - timerStartedAt;
        setSelectedOption(index);

        socketService.getSocket()?.emit('player:submit_answer', {
            roomCode: room.code,
            questionId: currentQuestion.id,
            selectedOptionIndex: index,
            responseTimeMs
        });
    };

    if (!currentQuestion) return <Layout><div>Esperando pregunta...</div></Layout>;

    return (
        <Layout>
            <div className="space-y-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">{room?.players.find(p => p.id === socketService.getSocket()?.id)?.score || 0} pts</div>
                    <CountdownTimer initialSeconds={20} />
                </div>

                <div className="bg-gray-800 p-6 rounded-xl text-center">
                    <h2 className="text-2xl font-bold mb-6">{currentQuestion.text}</h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => submitAnswer(idx)}
                                disabled={selectedOption !== null}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${selectedOption === idx
                                    ? 'border-blue-500 bg-blue-900/30'
                                    : 'border-gray-600 hover:border-gray-400'
                                    } ${selectedOption !== null ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {feedback && (
                    <div className={`p-4 rounded-xl text-center ${feedback.correct ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
                        <h3 className="text-xl font-bold mb-2">{feedback.correct ? '¡Correcto!' : 'Incorrecto'}</h3>
                        <p className="text-lg">+{feedback.score} puntos</p>
                        <p className="text-gray-300 mt-2 text-sm">{feedback.explanation}</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};
