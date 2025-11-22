import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
                <div className="text-center space-y-4 animate-float">
                    <h2 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan drop-shadow-[0_0_30px_rgba(176,38,255,0.6)]">
                        QA QUIZ
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-200 font-light tracking-wide">
                        Desafía tu conocimiento en tiempo real
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                    <button
                        onClick={() => navigate('/create')}
                        className="group relative p-1 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-[0_0_40px_rgba(176,38,255,0.6)] transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="bg-dark-bg h-full rounded-xl p-8 flex flex-col items-center justify-center relative z-10 group-hover:bg-opacity-90 transition-all">
                            <span className="text-4xl mb-4">👑</span>
                            <span className="text-2xl font-bold font-display mb-2 text-white">Soy Host</span>
                            <span className="text-gray-400 group-hover:text-white transition-colors">Crear una nueva sala</span>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/join')}
                        className="group relative p-1 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:shadow-[0_0_40px_rgba(5,217,232,0.6)] transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="bg-dark-bg h-full rounded-xl p-8 flex flex-col items-center justify-center relative z-10 group-hover:bg-opacity-90 transition-all">
                            <span className="text-4xl mb-4">🎮</span>
                            <span className="text-2xl font-bold font-display mb-2 text-white">Soy Jugador</span>
                            <span className="text-gray-400 group-hover:text-white transition-colors">Unirse a una sala</span>
                        </div>
                    </button>
                </div>
            </div>
        </Layout>
    );
};
