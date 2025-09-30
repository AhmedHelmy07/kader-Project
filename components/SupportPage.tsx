import React, { useEffect, useState } from 'react';
import { createTicket, listTickets, onTicketsChanged } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';
import { KaderLogo } from './icons/KaderLogo';

const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const off = onTicketsChanged(items => setTickets(items.filter(i => i.userEmail === (user.email || ''))));
    return () => off();
  }, [user]);

  const submit = async () => {
    if (!user) { alert('Please login to create tickets'); return; }
    if (!subject.trim() || !message.trim()) return alert('Please fill subject and message');
    await createTicket({ userEmail: user.email || 'unknown', subject: subject.trim(), message: message.trim(), status: 'open' });
    setSubject(''); setMessage('');
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-4/5 max-w-3xl mx-auto bg-gradient-to-br from-black/40 to-black/20 rounded p-6">
        <div className="flex items-center gap-4 mb-4">
          <KaderLogo className="w-12 h-12" />
          <div>
            <h2 className="text-2xl font-bold">Support</h2>
            <div className="text-sm text-gray-300">Create tickets and track their status.</div>
          </div>
        </div>

        <div className="mb-6 bg-black/20 p-4 rounded">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full p-3 mb-3 bg-transparent border rounded text-gray-200" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the issue" className="w-full p-3 bg-transparent rounded text-gray-200" rows={4} />
          <div className="flex justify-end mt-3">
            <button onClick={submit} className="bg-blue-600 px-4 py-2 rounded text-white">Create Ticket</button>
          </div>
        </div>

        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="bg-white/5 p-3 rounded flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-300">{t.createdAt?.toDate?.()?.toLocaleString?.() || ''}</div>
                <div className="mt-1 font-bold">{t.subject}</div>
                <div className="mt-1">{t.message}</div>
              </div>
              <div className="ml-4 text-right">
                <StatusPill status={t.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const mapping: Record<string, string> = {
    open: 'bg-yellow-500 text-black',
    'in-progress': 'bg-blue-500 text-white',
    closed: 'bg-green-600 text-white',
  };
  return <div className={`px-3 py-1 rounded-full text-sm ${mapping[status] || 'bg-gray-500 text-white'}`}>{status}</div>;
};

export default SupportPage;
