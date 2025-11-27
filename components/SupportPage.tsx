import React, { useEffect, useState } from 'react';
import { createTicket, listTickets, onTicketsChanged } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';
import { KaderLogo } from './icons/KaderLogo';
import { useToast } from './Toast';

const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    if (!user) return;
    const off = onTicketsChanged(items => setTickets(items.filter(i => i.userEmail === (user.email || ''))));
    return () => off();
  }, [user]);

  const toast = useToast();
  const submit = async () => {
    if (!user) { return toast?.push ? toast.push('Please login to create tickets') : alert('Please login to create tickets'); }
    if (!subject.trim() || !message.trim()) return toast?.push ? toast.push('Please fill subject and message') : alert('Please fill subject and message');
    
    setIsSubmitting(true);
    try {
      await createTicket({ userEmail: user.email || 'unknown', subject: subject.trim(), message: message.trim(), status: 'open' });
      setSubject(''); 
      setMessage('');
      toast?.push?.('Support ticket created successfully!');
    } catch (error) {
      toast?.push?.('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return t.status === 'open' || t.status === 'in-progress';
    return t.status === 'closed';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <KaderLogo className="h-20 relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Support Center
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            We're here to help. Create a ticket and our team will respond promptly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Ticket Form */}
          <div className="animate-fade-in-delay">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Ticket</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    disabled={!user}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={user ? "Describe your issue in detail..." : "Please login to create support tickets..."}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    rows={6}
                    disabled={!user}
                  />
                  <div className="text-sm text-gray-400 mt-2">
                    {message.length > 0 && `${message.length} characters`}
                  </div>
                </div>

                <button
                  onClick={submit}
                  disabled={!user || !subject.trim() || !message.trim() || isSubmitting}
                  className="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Ticket...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submit Ticket
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Your Tickets */}
          <div className="animate-fade-in-delay-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Your Tickets</h2>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                  {tickets.length} Total
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                {(['all', 'open', 'closed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tickets List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {!user ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-gray-400">Please login to view your tickets</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-400">No {activeTab !== 'all' ? activeTab : ''} tickets found</p>
                  </div>
                ) : (
                  filteredTickets.map((t, index) => (
                    <div
                      key={t.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1">{t.subject}</h3>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t.createdAt?.toDate?.()?.toLocaleString?.() || ''}
                          </p>
                        </div>
                        <StatusPill status={t.status} />
                      </div>
                      <p className="text-gray-300 leading-relaxed line-clamp-2">{t.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const configs: Record<string, { bg: string; text: string; icon: string }> = {
    open: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      text: 'text-white',
      icon: '○'
    },
    'in-progress': {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'text-white',
      icon: '◐'
    },
    closed: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-white',
      icon: '✓'
    },
  };
  
  const config = configs[status] || { bg: 'bg-gray-500', text: 'text-white', icon: '?' };
  
  return (
    <div className={`${config.bg} ${config.text} px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 animate-fade-in-scale`}>
      <span className="text-base">{config.icon}</span>
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default SupportPage;
