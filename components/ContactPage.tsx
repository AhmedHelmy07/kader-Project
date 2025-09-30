import React, { useState } from 'react';
import { postMessage } from '../services/firestore';

const ContactPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  const submit = async () => {
    if (!email || !text) return alert('Please fill email and message');
    await postMessage({ userEmail: email, text });
    setText('');
    alert('Message sent');
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <div className="max-w-lg">
        <input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 bg-white/5 rounded" />
        <textarea placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 mb-2 bg-white/5 rounded" rows={6} />
        <div className="flex gap-2">
          <button onClick={submit} className="bg-blue-600 px-4 py-2 rounded text-white">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
