import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import hospitalFloor from '../images/hospital_floor.jpg';
import banner1 from '../images/banner1.jpg';
import banner2 from '../images/banner2.jpg';
import banner3 from '../images/banner3.jpg';
import banner4 from '../images/banner4.jpg';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

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
    const { user } = useAuth();
    const { t } = useLanguage();
    const bannerImages = [
      { src: banner1, title: t('home.banner1') },
      { src: banner2, title: t('home.banner2') },
      { src: banner3, title: t('home.banner3') },
      { src: banner4, title: t('home.banner4') }
    ];
    const [idx, setIdx] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    
    useEffect(() => {
        if (!isAutoPlay) return;
        const t = setInterval(() => setIdx(i => (i + 1) % bannerImages.length), 4000);
        return () => clearInterval(t);
    }, [isAutoPlay, bannerImages.length]);

    const goToSlide = (slideIdx: number) => {
      setIdx(slideIdx);
      setIsAutoPlay(false);
    };

    const nextSlide = () => {
      setIdx((i) => (i + 1) % bannerImages.length);
      setIsAutoPlay(false);
    };

    const prevSlide = () => {
      setIdx((i) => (i - 1 + bannerImages.length) % bannerImages.length);
      setIsAutoPlay(false);
    };
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
                                <img src={logo} alt="Kader Logo" className="h-24" />
                                <span className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></span>
                            </span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-fade-in">
                            {t('home.heroTitle')}
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-200 max-w-3xl mx-auto mb-10 animate-fade-in-delay">
                            {t('home.heroSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-300 text-base mb-10 animate-fade-in-delay-2">
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                                <strong className="text-blue-400 group-hover:text-blue-300 transition-colors">{t('home.aiNav').split(' for ')[0]}</strong> {t('home.aiNav').split(' for ').slice(1).join(' for ')}
                            </div>
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                                <strong className="text-blue-400 group-hover:text-blue-300 transition-colors">{t('home.realtime').split(' for ')[0]}</strong> {t('home.realtime').split(' for ').slice(1).join(' for ')}
                            </div>
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                                <strong className="text-blue-400 group-hover:text-blue-300 transition-colors">{t('home.booking').split(' for ')[0]}</strong> {t('home.booking').split(' for ').slice(1).join(' for ')}
                            </div>
                        </div>
                        <button
                            onClick={() => user ? navigate('#/dashboard') : navigate('#/register')}
                            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 overflow-hidden animate-fade-in-delay-3"
                        >
                            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                            <span className="relative flex items-center gap-2">
                                {user ? t('home.goToDashboard') : t('home.getStarted')}
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </section>

                {/* Image Carousel */}
                <section className="py-16 px-4 flex justify-center bg-gradient-to-b from-gray-900/50 to-black">
                    <div className="w-full max-w-7xl">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group" onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)}>
                            {/* Main Image with Fade Effect */}
                            <div className="relative h-96 sm:h-[500px] overflow-hidden bg-gray-900">
                                {bannerImages.map((banner, i) => (
                                    <img
                                        key={i}
                                        src={banner.src}
                                        alt={banner.title}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                                            i === idx
                                                ? 'opacity-100 scale-100'
                                                : i === (idx - 1 + bannerImages.length) % bannerImages.length
                                                ? 'opacity-0 scale-95'
                                                : 'opacity-0 scale-105'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                            {/* Banner Title */}
                            <div className="absolute bottom-12 left-0 right-0 z-20 px-6 sm:px-12">
                                <h3 className="text-3xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                    {bannerImages[idx].title}
                                </h3>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 group/btn"
                                aria-label="Previous slide"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 group/btn"
                                aria-label="Next slide"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Slide Counter */}
                            <div className="absolute left-6 bottom-6 z-20">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    <span>/</span>
                                    <span>{bannerImages.length}</span>
                                </div>
                            </div>

                            {/* Dot Indicators */}
                            <div className="absolute right-6 bottom-6 z-20 flex gap-3">
                                {bannerImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToSlide(i)}
                                        className={`transition-all duration-300 rounded-full backdrop-blur-sm hover:scale-125 ${
                                            i === idx
                                                ? 'w-8 h-3 bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/50'
                                                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                                        }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    ></button>
                                ))}
                            </div>

                            {/* Auto-play Indicator */}
                            {isAutoPlay && (
                                <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-300">
                                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    {t('home.autoplays')}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 sm:py-28 bg-gradient-to-b from-gray-900 to-black px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t('home.whyKader')}</h2>
                        <p className="text-gray-400 text-center mb-16 text-lg">{t('home.whySubtitle')}</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard icon="🤖" title={t('home.autonomousNav')}>
                                {t('home.autonomousDesc')}
                            </FeatureCard>
                            <FeatureCard icon="📱" title={t('home.seamlessBooking')}>
                                {t('home.bookingDesc')}
                            </FeatureCard>
                             <FeatureCard icon="📡" title={t('home.realtimeMonitor')}>
                                {t('home.monitorDesc')}
                            </FeatureCard>
                            <FeatureCard icon="⚙️" title={t('home.manualOverride')}>
                                {t('home.overrideDesc')}
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
                                    {t('home.newBadge')}
                                </span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                {t('home.kaderHub')}
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                {t('home.hubSubtitle')}
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
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{t('home.courses')}</h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {t('home.coursesDesc')}
                                    </p>
                                    <ul className="space-y-2 mb-6">
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {t('home.expertInstructors')}
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {t('home.flexibleLearning')}
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {t('home.certificatesIncluded')}
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => navigate('#/hub')}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                                    >
                                        {t('home.courseBrowse')}
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
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">{t('home.jobs')}</h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {t('home.jobsDesc')}
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
                                        {t('home.jobBrowse')}
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
