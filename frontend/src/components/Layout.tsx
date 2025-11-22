import React, { useEffect, useState } from 'react';
import { socketService } from '../services/socket';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socketService.socket?.connected || false);

    useEffect(() => {
        const socket = socketService.connect();

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className="min-h-screen text-white font-sans relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-neon-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-md bg-black/20">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan drop-shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                        QA Socket Quiz
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} transition-colors duration-300`}></div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{isConnected ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 container mx-auto p-6 max-w-5xl">
                {children}
            </main>
        </div>
    );
};
