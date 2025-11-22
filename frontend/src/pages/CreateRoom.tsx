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
            <div className="max-w-2xl mx-auto space-y-8">
                {!room ? (
                    <div className="text-center">
                        <button
                            onClick={createRoom}
                            disabled={loading}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-xl font-bold disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Sala'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-xl text-center">
                            <p className="text-gray-400 mb-2">Código de la Sala</p>
                            <h2 className="text-5xl font-mono font-bold text-yellow-400 tracking-wider">
                                {room.code}
                            </h2>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl">
                            <label className="block text-gray-400 mb-2">Categoría de Preguntas</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <PlayerList players={room.players} />

                        <button
                            onClick={startGame}
                            disabled={room.players.length === 0}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Iniciar Juego
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};
