import React from 'react';
import type { Player } from '../types';

interface PlayerListProps {
    players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Jugadores ({players.length})</h3>
            <ul className="space-y-2">
                {players.map((player) => (
                    <li key={player.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <span className="font-medium">{player.nickname}</span>
                        <span className="text-sm text-gray-400">{player.score} pts</span>
                    </li>
                ))}
                {players.length === 0 && (
                    <li className="text-gray-500 italic">Esperando jugadores...</li>
                )}
            </ul>
        </div>
    );
};
