import React, { useEffect, useState } from 'react';
import { postMessage, listRecentMessages } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const m = await listRecentMessages(100);
      setMessages(m);
    })();
  }, []);

  const send = async () => {
    if (!user) { alert('Please login to post'); return; }
    await postMessage({ userEmail: user.email || 'unknown', text });
    setText('');
    const m = await listRecentMessages(100);
    setMessages(m);
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Community</h2>
      <div className="mb-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-white/5 rounded" rows={3} />
        <div className="flex gap-2 mt-2">
          <button onClick={send} className="bg-blue-600 px-4 py-2 rounded text-white">Post</button>
        </div>
      </div>
      <div className="space-y-3">
        {messages.map(m => (
          <div key={m.id} className="bg-white/5 p-3 rounded">
            <div className="text-sm text-gray-300">{m.userEmail} • {m.createdAt?.toDate?.()?.toLocaleString?.() || ''}</div>
            <div className="mt-1">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
