import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { socketService } from '../services/socket';
import { useGameStore } from '../store/gameStore';

export const JoinRoom: React.FC = () => {
    const navigate = useNavigate();
    const { setRoom, setPlayerId, setNickname } = useGameStore();
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socket = socketService.connect();

        socket.on('room:state_update', (updatedRoom) => {
            setRoom(updatedRoom);
            if (updatedRoom.status === 'in_progress') {
                navigate('/game/player');
            }
        });

        return () => {
            socket.off('room:state_update');
        };
    }, [setRoom, navigate]);

    const joinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !name) return;

        setLoading(true);
        socketService.getSocket()?.emit('player:join_room', {
            roomCode: code.toUpperCase(),
            nickname: name
        }, (response: any) => {
            setLoading(false);
            if (response.success) {
                setPlayerId(response.playerId);
                setNickname(name);
                // Wait for room update to navigate or show lobby
                // Actually, we are already listening to room:state_update which sets room.
                // We can show a "Waiting for host to start" screen here if room is set.
            } else {
                alert('Error joining room: ' + response.error);
            }
        });
    };

    const { room } = useGameStore();

    if (room) {
        return (
            <Layout>
                <div className="text-center space-y-8">
                    <h2 className="text-3xl font-bold">¡Estás dentro!</h2>
                    <p className="text-xl text-gray-400">Esperando a que el host inicie el juego...</p>
                    <div className="animate-pulse text-6xl">⏳</div>
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Jugadores en sala:</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {room.players.map(p => (
                                <span key={p.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm">{p.nickname}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Unirse a una Sala</h2>
                <form onSubmit={joinRoom} className="space-y-6 bg-gray-800 p-8 rounded-xl">
                    <div>
                        <label className="block text-gray-400 mb-2">Código de Sala</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none text-center font-mono text-xl uppercase"
                            placeholder="ABCD12"
                            maxLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Nickname</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none"
                            placeholder="Tu nombre"
                            maxLength={15}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !code || !name}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold disabled:opacity-50"
                    >
                        {loading ? 'Uniéndose...' : 'Unirse'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};
