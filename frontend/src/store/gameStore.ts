import { create } from 'zustand';
import type { Room } from '../types';

interface GameState {
    room: Room | null;
    playerId: string | null;
    nickname: string | null;
    isHost: boolean;
    setRoom: (room: Room | null) => void;
    setPlayerId: (id: string | null) => void;
    setNickname: (name: string | null) => void;
    setIsHost: (isHost: boolean) => void;
    reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    room: null,
    playerId: null,
    nickname: null,
    isHost: false,
    setRoom: (room) => set({ room }),
    setPlayerId: (playerId) => set({ playerId }),
    setNickname: (nickname) => set({ nickname }),
    setIsHost: (isHost) => set({ isHost }),
    reset: () => set({ room: null, playerId: null, nickname: null, isHost: false })
}));
