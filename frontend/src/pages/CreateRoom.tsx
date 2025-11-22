import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlayerList } from '../components/PlayerList';
import { socketService } from '../services/socket';
import { useGameStore } from '../store/gameStore';

export const CreateRoom: React.FC = () => {
    const navigate = useNavigate();
    const { room, setRoom, setIsHost } = useGameStore();
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socket = socketService.connect();
        setIsHost(true);

        // Fetch categories
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');
        fetch(`${API_URL}/api/questions/categories`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                if (data.length > 0) setSelectedCategory(data[0]);
            })
            .catch(err => console.error('Failed to fetch categories', err));

        socket.on('room:state_update', (updatedRoom) => {
            setRoom(updatedRoom);
            if (updatedRoom.status === 'in_progress') {
                navigate('/game/host');
            }
        });

        return () => {
            socket.off('room:state_update');
        };
    }, [setRoom, setIsHost, navigate]);

    const createRoom = () => {
        setLoading(true);
        socketService.getSocket()?.emit('host:create_room', (response: any) => {
            setLoading(false);
            if (response.success) {
                // Room created, wait for update
            } else {
                alert('Error creating room: ' + response.error);
            }
        });
    };

    const startGame = () => {
        if (!room) return;
        socketService.getSocket()?.emit('host:start_game', {
            roomCode: room.code,
            category: selectedCategory
        }, (response: any) => {
            if (!response.success) {
                alert('Error starting game: ' + response.error);
            }
        });
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                {!room ? (
                    <div className="text-center min-h-[50vh] flex flex-col items-center justify-center">
                        <button
                            onClick={createRoom}
                            disabled={loading}
                            className="neon-button bg-gradient-to-r from-neon-purple to-neon-pink text-white text-2xl px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <span className="animate-spin">⚙️</span> Creando...
                                </span>
                            ) : '⚡ Crear Sala Nueva'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        <div className="glass-panel p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-cyan"></div>
                            <p className="text-gray-400 mb-4 uppercase tracking-widest text-sm">Código de la Sala</p>
                            <h2 className="text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan tracking-wider drop-shadow-lg">
                                {room.code}
                            </h2>
                        </div>

                        <div className="glass-panel p-8">
                            <label className="block text-neon-cyan mb-4 font-bold uppercase tracking-wide">Categoría de Preguntas</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-field text-lg bg-black/50"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-dark-bg">{cat}</option>
                                ))}
                            </select>
                        </div>

                        <PlayerList players={room.players} />

                        <button
                            onClick={startGame}
                            disabled={room.players.length === 0}
                            className="w-full neon-button bg-gradient-to-r from-neon-cyan to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            🚀 Iniciar Juego
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};
