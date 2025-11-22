import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useGameStore } from '../store/gameStore';

export const Results: React.FC = () => {
    const navigate = useNavigate();
    const { room, reset } = useGameStore();

    const sortedPlayers = room?.players ? [...room.players].sort((a, b) => b.score - a.score) : [];

    const handleHome = () => {
        reset();
        navigate('/');
    };

    return (
        <Layout>
            <div className="text-center space-y-8">
                <h2 className="text-4xl font-bold text-yellow-400">Resultados Finales</h2>

                <div className="bg-gray-800 rounded-xl overflow-hidden max-w-2xl mx-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-4">Posición</th>
                                <th className="p-4">Jugador</th>
                                <th className="p-4 text-right">Puntaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, idx) => (
                                <tr key={player.id} className="border-b border-gray-700 last:border-0">
                                    <td className="p-4">
                                        {idx === 0 && '🥇'}
                                        {idx === 1 && '🥈'}
                                        {idx === 2 && '🥉'}
                                        {idx > 2 && `#${idx + 1}`}
                                    </td>
                                    <td className="p-4 font-bold">{player.nickname}</td>
                                    <td className="p-4 text-right font-mono text-yellow-400">{player.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={handleHome}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                >
                    Volver al Inicio
                </button>
            </div>
        </Layout>
    );
};
