import React from 'react';
import type { Player } from '../types';

interface PlayerListProps {
    players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
    return (
        <div className="w-full">
            <h3 className="text-xl font-display font-bold mb-6 text-neon-cyan flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></span>
                Jugadores Conectados ({players.length})
            </h3>

            {players.length === 0 ? (
                <div className="glass-panel p-8 text-center text-gray-400 italic border-dashed border-2 border-gray-700">
                    Esperando jugadores...
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {players.map((player, index) => (
                        <div
                            key={player.id}
                            className="glass-panel p-4 flex items-center gap-3 transform transition-all hover:scale-105 hover:border-neon-purple/50 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg">
                                {player.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-bold truncate text-white">{player.nickname}</span>
                                <span className="text-xs text-neon-cyan">Conectado</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
