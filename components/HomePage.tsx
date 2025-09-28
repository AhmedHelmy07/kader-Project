import React from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

interface HomePageProps {
  navigate: (path: string) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg text-center transform hover:scale-105 hover:bg-gray-800 transition-all duration-300">
        <div className="text-blue-400 text-4xl mb-4 mx-auto">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Navbar navigate={navigate} />

            <main>
                {/* Hero Section */}
                <section className="relative text-center py-32 sm:py-48 px-4 h-[80vh] flex flex-col justify-center items-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582719478212-c85ab65348b3?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
                            Revolutionizing Patient Mobility
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            A Smart Autonomous Wheelchair with Indoor Navigation and AI-based Obstacle Avoidance.
                        </p>
                        <button onClick={() => navigate('#/register')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 sm:py-28 bg-gray-900 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Why Kader Project?</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard icon="🤖" title="Autonomous Navigation">
                                AI-powered pathfinding ensures safe and efficient transport within complex hospital environments.
                            </FeatureCard>
                            <FeatureCard icon="📱" title="Seamless Booking">
                                An intuitive app for patients and staff to schedule rides and manage appointments effortlessly.
                            </FeatureCard>
                             <FeatureCard icon="📡" title="Real-time Monitoring">
                                A powerful admin dashboard provides live tracking and status updates for the entire fleet.
                            </FeatureCard>
                            <FeatureCard icon="⚙️" title="Manual Override">
                                Staff can take remote control at any time, ensuring ultimate safety and flexibility in emergencies.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                 <section id="how-it-works" className="py-20 sm:py-28 px-4">
                    <div className="max-w-4xl mx-auto">
                         <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Simple, Safe, and Efficient</h2>
                         <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <img src="https://images.unsplash.com/photo-1512431184984-2571e7f3c1a3?q=80&w=1964&auto=format&fit=crop" alt="Hospital hallway" className="rounded-lg shadow-2xl"/>
                            </div>
                            <div className="md:w-1/2 space-y-6 text-gray-300 text-lg">
                                <p><strong className="text-white">1. Book a Ride:</strong> A patient or staff member requests a wheelchair via the mobile app.</p>
                                <p><strong className="text-white">2. Navigate Autonomously:</strong> The nearest available chair travels to the patient, avoiding obstacles.</p>
                                <p><strong className="text-white">3. Reach the Destination:</strong> The patient is safely transported to their appointment location.</p>
                                <p><strong className="text-white">4. Monitor and Manage:</strong> Admins oversee the entire operation from the central dashboard.</p>
                            </div>
                         </div>
                    </div>
                 </section>

            </main>
            
            <Footer theme="dark" />
        </div>
    );
};

export default HomePage;