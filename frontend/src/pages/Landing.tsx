import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <h2 className="text-4xl font-bold text-center mb-8">
                    Bienvenido al <span className="text-blue-500">QA Quiz Game</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
                    <button
                        onClick={() => navigate('/create')}
                        className="p-8 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all transform hover:scale-105 flex flex-col items-center"
                    >
                        <span className="text-2xl font-bold mb-2">Soy Host</span>
                        <span className="text-blue-200">Crear una nueva sala</span>
                    </button>

                    <button
                        onClick={() => navigate('/join')}
                        className="p-8 bg-green-600 hover:bg-green-700 rounded-xl transition-all transform hover:scale-105 flex flex-col items-center"
                    >
                        <span className="text-2xl font-bold mb-2">Soy Jugador</span>
                        <span className="text-green-200">Unirse a una sala</span>
                    </button>
                </div>
            </div>
        </Layout>
    );
};
