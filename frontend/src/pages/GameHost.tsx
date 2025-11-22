import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CountdownTimer } from '../components/CountdownTimer';
import { socketService } from '../services/socket';
import { useGameStore } from '../store/gameStore';
import type { Question } from '../types';

export const GameHost: React.FC = () => {
    const navigate = useNavigate();
    const { room, setRoom } = useGameStore();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [answerCount, setAnswerCount] = useState(0);

    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) {
            navigate('/');
            return;
        }

        socket.on('game:new_question', (question: Question) => {
            setCurrentQuestion(question);
            setAnswerCount(0);
        });

        socket.on('host:answers_update', ({ count }: { count: number }) => {
            setAnswerCount(count);
        });

        socket.on('room:state_update', (updatedRoom) => {
            setRoom(updatedRoom);
            if (updatedRoom.status === 'finished') {
                navigate('/results');
            }
        });

        return () => {
            socket.off('game:new_question');
            socket.off('host:answers_update');
            socket.off('room:state_update');
        };
    }, [navigate, setRoom]);

    const nextQuestion = () => {
        if (!room) return;
        socketService.getSocket()?.emit('host:next_question', { roomCode: room.code }, (res: any) => {
            if (!res.success) alert(res.error);
        });
    };

    const endGame = () => {
        if (!room) return;
        socketService.getSocket()?.emit('host:end_game', { roomCode: room.code }, (res: any) => {
            if (!res.success) alert(res.error);
        });
    };

    if (!currentQuestion) return <Layout><div>Cargando...</div></Layout>;

    return (
        <Layout>
            <div className="space-y-8 text-center">
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                    <div className="text-xl">Sala: <span className="font-bold text-yellow-400">{room?.code}</span></div>
                    <CountdownTimer initialSeconds={20} />
                    <div className="text-xl">Respuestas: <span className="font-bold text-green-400">{answerCount}</span> / {room?.players.length}</div>
                </div>

                <div className="bg-gray-800 p-8 rounded-xl">
                    <h2 className="text-2xl font-bold mb-6">{currentQuestion.text}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((opt, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border-2 ${idx === currentQuestion.correctOptionIndex ? 'border-green-500 bg-green-900/20' : 'border-gray-600'}`}>
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={nextQuestion} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">
                        Siguiente Pregunta
                    </button>
                    <button onClick={endGame} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold">
                        Finalizar Juego
                    </button>
                </div>
            </div>
        </Layout>
    );
};
