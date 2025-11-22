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
            } else {
                alert('Error joining room: ' + response.error);
            }
        });
    };

    const { room } = useGameStore();

    if (room) {
        return (
            <Layout>
                <div className="text-center space-y-8 animate-fade-in">
                    <div className="glass-panel p-12 inline-block">
                        <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink mb-4">¡Estás dentro!</h2>
                        <p className="text-xl text-gray-300 mb-8">Esperando a que el host inicie el juego...</p>
                        <div className="text-6xl animate-bounce">🎮</div>
                    </div>

                    <div className="mt-12 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-6 text-neon-cyan uppercase tracking-widest">Jugadores en sala</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {room.players.map(p => (
                                <span key={p.id} className="px-6 py-2 bg-black/40 border border-neon-purple/30 rounded-full text-white font-bold shadow-[0_0_10px_rgba(176,38,255,0.2)] animate-pulse-glow">
                                    {p.nickname}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-md mx-auto pt-10">
                <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                    <h2 className="text-3xl font-display font-bold mb-8 text-center text-white">Unirse a una Sala</h2>

                    <form onSubmit={joinRoom} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-neon-cyan mb-2 font-bold text-sm uppercase tracking-wider">Código de Sala</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="input-field text-center font-mono text-2xl uppercase tracking-[0.2em]"
                                placeholder="ABCD12"
                                maxLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-neon-cyan mb-2 font-bold text-sm uppercase tracking-wider">Nickname</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field text-lg"
                                placeholder="Tu nombre de guerrero"
                                maxLength={15}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !code || !name}
                            className="w-full neon-button bg-gradient-to-r from-neon-purple to-neon-pink text-white mt-4 disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? 'Conectando...' : '🚀 Unirse'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
