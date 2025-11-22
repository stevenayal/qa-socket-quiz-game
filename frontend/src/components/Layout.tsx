import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
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
                </div>
            </header>

            <main className="relative z-10 container mx-auto p-6 max-w-5xl">
                {children}
            </main>
        </div>
    );
};
