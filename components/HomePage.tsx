import React, { useState } from 'react';
import { Footer } from './Footer';
import { LoginModal } from './LoginModal';
import { KaderLogo } from './icons/KaderLogo';
import { WheelchairIcon } from './icons/WheelchairIcon';

interface HomePageProps {
  onAdminLogin: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">{title}</h2>
        <div className="max-w-3xl mx-auto text-gray-300 space-y-4 text-lg text-center">
            {children}
        </div>
    </section>
);

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p>{description}</p>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ onAdminLogin }) => {
    const [isLoginOpen, setLoginOpen] = useState(false);

    return (
        <div className="bg-black text-white min-h-screen font-sans">
            {isLoginOpen && <LoginModal onLogin={onAdminLogin} onClose={() => setLoginOpen(false)} />}
            
            <header className="p-4 sm:p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <KaderLogo className="w-12 h-12 sm:w-16 sm:h-16" />
                    <span className="text-xl sm:text-2xl font-bold">Kader Project</span>
                </div>
                <button 
                    onClick={() => setLoginOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Login as Admin
                </button>
            </header>

            <main className="px-4">
                <div className="text-center py-20 sm:py-32">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
                        Revolutionizing Patient Mobility
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        A Smart Autonomous Wheelchair with Indoor Navigation and AI-based Obstacle Avoidance.
                    </p>
                </div>

                <Section title="Project Summary">
                    <p>
                        This project aims to develop a Smart Electric Wheelchair equipped with indoor navigation, AI-powered obstacle detection, and remote control. The system addresses a real challenge in hospitals: helping elderly and disabled patients move autonomously, especially when they have medical appointments.
                    </p>
                </Section>
                
                <hr className="border-gray-800 max-w-md mx-auto" />

                <Section title="Key Functionalities">
                   <div className="grid md:grid-cols-2 gap-6 text-left">
                        <Feature title="Autonomous Navigation" description="The wheelchair automatically navigates inside the hospital, picking up patients and delivering them to their destination while avoiding obstacles." />
                        <Feature title="Appointment Booking" description="Patients or staff can book appointments through a dedicated mobile app and website for seamless scheduling and system control." />
                        <Feature title="Real-time Monitoring" description="An admin panel allows for live tracking of the entire wheelchair fleet, ensuring safety and operational efficiency." />
                        <Feature title="Manual Override" description="For complex situations or emergencies, staff have the ability to take remote manual control of any wheelchair." />
                   </div>
                </Section>

                <hr className="border-gray-800 max-w-md mx-auto" />

                <Section title="Objectives">
                    <ul className="list-disc list-inside space-y-3 text-left max-w-2xl mx-auto">
                        <li>Design and build a fully autonomous, motorized wheelchair.</li>
                        <li>Implement real-time indoor localization using BLE beacons or visual tags.</li>
                        <li>Integrate computer vision to detect obstacles, people, and ramps.</li>
                        <li>Build a mobile app and web dashboard for booking and system control.</li>
                        <li>Ensure the system is safe, user-friendly, and adaptable to hospital environments.</li>
                    </ul>
                </Section>
            </main>
            
            <Footer theme="dark" />
        </div>
    );
};

export default HomePage;
