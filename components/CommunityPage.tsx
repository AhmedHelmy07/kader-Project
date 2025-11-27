import React, { useEffect, useState } from 'react';
import { postMessage, listRecentMessages, onMessagesChanged } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';
import { KaderLogo } from './icons/KaderLogo';
import { useToast } from './Toast';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const off = onMessagesChanged(items => setMessages(items), 200);
    return () => off();
  }, []);

  const toast = useToast();
  const send = async () => {
    if (!user) { return toast?.push ? toast.push('Please login to post') : alert('Please login to post'); }
    if (!text.trim()) { return toast?.push ? toast.push('Please write a message') : alert('Please write a message'); }
    
    setIsPosting(true);
    try {
      await postMessage({ userEmail: user.email || 'unknown', text: text.trim() });
      setText('');
      toast?.push?.('Posted successfully!');
    } catch (error) {
      toast?.push?.('Failed to post message');
    } finally {
      setIsPosting(false);
    }
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <KaderLogo className="h-20 relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Community Hub
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Connect, share experiences, and engage with the Kader community
          </p>
        </div>

        {/* Post Creation Card */}
        <div className="mb-8 animate-fade-in-delay">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              {user && (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {getInitials(user.email || 'U')}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows={4}
                  placeholder={user ? "Share your thoughts with the community..." : "Please login to post..."}
                  disabled={!user}
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-400">
                    {text.length > 0 && `${text.length} characters`}
                  </div>
                  <button
                    onClick={send}
                    disabled={!user || !text.trim() || isPosting}
                    className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      {isPosting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Post Message
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="space-y-4 animate-fade-in-delay-2">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Recent Posts
            <span className="text-sm font-normal text-blue-300">({messages.length})</span>
          </h2>
          
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No messages yet. Be the first to post!</p>
            </div>
          ) : (
            messages.map((m, index) => (
              <div
                key={m.id}
                className="group bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-purple-500/50 transition-shadow duration-300">
                      {getInitials(m.userEmail)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">
                          {m.userEmail}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {m.createdAt?.toDate?.()?.toLocaleString?.() || ''}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                      {m.text}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
