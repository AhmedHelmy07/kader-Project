import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import hospitalFloor from '../images/hospital_floor.jpg';
import img1 from '../images/1.jpg';
import img2 from '../images/2.jpg';
import img3 from '../images/3.jpg';
import img4 from '../images/4.jpg';
import img5 from '../images/5.jpg';
import img7 from '../images/7.jpg';
import img8 from '../images/8.jpg';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

interface HomePageProps {
  navigate: (path: string) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl text-center transform hover:scale-105 hover:border-blue-500 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-500"></div>
        <div className="relative z-10">
            <div className="text-5xl mb-4 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{children}</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    const images = [img1, img2, img3, img4, img5, img7, img8];
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % images.length), 3000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="bg-black text-white min-h-screen font-sans">
            <Navbar navigate={navigate} />

            <main>
                {/* Hero Section */}
                <section className="relative text-center py-32 sm:py-48 px-4 min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-8 animate-float">
                            <span className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-full p-6 flex items-center justify-center border-4 border-blue-600 shadow-2xl shadow-blue-500/50">
                                <img src={logo} alt="Kader Logo" className="w-24 h-24" />
                                <span className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></span>
                            </span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-fade-in">
                            Revolutionizing Patient Mobility
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-200 max-w-3xl mx-auto mb-10 animate-fade-in-delay">
                            Smart Autonomous Wheelchair System with Indoor Navigation, AI-based Obstacle Avoidance, and Real-time Fleet Management.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-300 text-base mb-10 animate-fade-in-delay-2">
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                                <strong className="text-blue-400 group-hover:text-blue-300 transition-colors">AI Navigation</strong> for safe, efficient transport
                            </div>
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                                <strong className="text-blue-400 group-hover:text-blue-300 transition-colors">Real-time Monitoring</strong> for staff & admins
                            </div>
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                                <strong className="text-blue-400 group-hover:text-blue-300 transition-colors">Seamless Booking</strong> for patients
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('#/register')}
                            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 overflow-hidden animate-fade-in-delay-3"
                        >
                            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                            <span className="relative flex items-center gap-2">
                                Get Started
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </section>

                {/* Image Carousel */}
                <section className="py-16 px-4 flex justify-center bg-gray-900/50">
                    <div className="w-full max-w-5xl">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                            <img src={images[idx]} alt={`slide-${idx}`} className="w-full h-96 object-cover transition-all duration-1000 group-hover:scale-110" />
                            <div className="absolute left-6 bottom-6 z-20">
                                <div className="bg-blue-600/90 backdrop-blur-sm text-white px-5 py-2 rounded-lg shadow-xl font-semibold">
                                    Photo {idx+1} of {images.length}
                                </div>
                            </div>
                            <div className="absolute right-6 bottom-6 z-20 flex gap-2">
                                {images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            i === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'
                                        }`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 sm:py-28 bg-gradient-to-b from-gray-900 to-black px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Why Kader Project?</h2>
                        <p className="text-gray-400 text-center mb-16 text-lg">Cutting-edge technology for modern healthcare mobility</p>
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

                {/* NEW: Kader Hub Section */}
                <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-black via-cyan-900/20 to-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.1),transparent_50%)]"></div>
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-4">
                                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                                    NEW
                                </span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Introducing Kader Hub
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Empowering your career and knowledge with professional courses and job opportunities
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {/* Courses Card */}
                            <div className="group relative bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-cyan-600/0 group-hover:from-cyan-600/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Professional Courses</h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        Upskill with expert-led courses in healthcare technology, AI, robotics, and more. Learn from industry professionals and advance your career.
                                    </p>
                                    <ul className="space-y-2 mb-6">
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Expert instructors
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Flexible learning
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Certificates included
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => navigate('#/hub')}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                                    >
                                        Browse Courses
                                    </button>
                                </div>
                            </div>

                            {/* Jobs Card */}
                            <div className="group relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 hover:border-green-400 transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 transition-all duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Career Opportunities</h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        Discover exciting job opportunities in healthcare innovation, medical technology, and smart mobility systems. Your dream job awaits.
                                    </p>
                                    <ul className="space-y-2 mb-6">
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Top companies
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Remote options
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Competitive salaries
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => navigate('#/hub')}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
                                    >
                                        View Jobs
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => navigate('#/hub')}
                                className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
                            >
                                <span>Explore Kader Hub</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-gray-900">
                    <div className="max-w-5xl mx-auto">
                         <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Simple, Safe, and Efficient</h2>
                         <p className="text-gray-400 text-center mb-16 text-lg">How the Kader system works in 4 easy steps</p>
                         <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2 group">
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                    <img src={hospitalFloor} alt="Hospital hallway" className="w-full transform group-hover:scale-110 transition-transform duration-700"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>
                            <div className="md:w-1/2 space-y-6">
                                {[
                                    { num: '1', title: 'Book a Ride', desc: 'A patient or staff member requests a wheelchair via the mobile app.' },
                                    { num: '2', title: 'Navigate Autonomously', desc: 'The nearest available chair travels to the patient, avoiding obstacles.' },
                                    { num: '3', title: 'Reach the Destination', desc: 'The patient is safely transported to their appointment location.' },
                                    { num: '4', title: 'Monitor and Manage', desc: 'Admins oversee the entire operation from the central dashboard.' }
                                ].map((step) => (
                                    <div key={step.num} className="group flex gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            {step.num}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
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
