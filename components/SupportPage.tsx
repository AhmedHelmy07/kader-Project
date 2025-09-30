import React, { useEffect, useState } from 'react';
import { createTicket, listTickets } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';

const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const t = await listTickets();
      setTickets(t);
    })();
  }, []);

  const submit = async () => {
    if (!user) { alert('Please login to create tickets'); return; }
    await createTicket({ userEmail: user.email || 'unknown', subject, message, status: 'open' });
    setSubject(''); setMessage('');
    const t = await listTickets(); setTickets(t);
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
      <div className="mb-6 bg-white/5 p-4 rounded">
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full p-2 mb-2 bg-transparent border-b" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the issue" className="w-full p-2 bg-transparent" rows={4} />
        <div className="flex gap-2 mt-2">
          <button onClick={submit} className="bg-blue-600 px-4 py-2 rounded text-white">Create Ticket</button>
        </div>
      </div>
      <div className="space-y-3">
        {tickets.map(t => (
          <div key={t.id} className="bg-white/5 p-3 rounded">
            <div className="text-sm text-gray-300">{t.userEmail} • {t.status}</div>
            <div className="mt-1 font-bold">{t.subject}</div>
            <div className="mt-1">{t.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportPage;
