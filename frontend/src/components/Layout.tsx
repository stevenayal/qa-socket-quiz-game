import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <header className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-400">QA Socket Quiz</h1>
            </header>
            <main className="container mx-auto p-4 max-w-4xl">
                {children}
            </main>
        </div>
    );
};
