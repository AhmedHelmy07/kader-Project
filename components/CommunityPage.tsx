import React, { useEffect, useState } from 'react';
import { postMessage, listRecentMessages, onMessagesChanged } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';
import { KaderLogo } from './icons/KaderLogo';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const off = onMessagesChanged(items => setMessages(items), 200);
    return () => off();
  }, []);

  const send = async () => {
    if (!user) { alert('Please login to post'); return; }
    if (!text.trim()) { return alert('Please write a message'); }
    await postMessage({ userEmail: user.email || 'unknown', text: text.trim() });
    setText('');
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-4/5 max-w-3xl mx-auto bg-gradient-to-br from-black/40 to-black/20 rounded p-6">
        <div className="flex items-center gap-4 mb-4">
          <KaderLogo className="w-12 h-12" />
          <div>
            <h2 className="text-2xl font-bold">Community</h2>
            <div className="text-sm text-gray-300">Share updates and chat with other users.</div>
          </div>
        </div>

        <div className="mb-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-transparent border rounded text-gray-200" rows={3} placeholder="Write something..." />
          <div className="flex justify-end mt-2">
            <button onClick={send} className="bg-blue-600 px-4 py-2 rounded text-white">Post</button>
          </div>
        </div>

        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="bg-white/5 p-3 rounded">
              <div className="flex justify-between text-sm text-gray-300"> 
                <div>{m.userEmail}</div>
                <div>{m.createdAt?.toDate?.()?.toLocaleString?.() || ''}</div>
              </div>
              <div className="mt-1 text-gray-200">{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
