import React from 'react';
import { Footer } from './Footer';

interface PlaceholderPageProps {
    title: string;
    message: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message }) => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <main className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-50">
                <div className="bg-white p-10 rounded-lg shadow-md border">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
                    <p className="text-lg text-gray-600 max-w-md">{message}</p>
                </div>
            </main>
            <Footer theme="light" />
        </div>
    );
};
