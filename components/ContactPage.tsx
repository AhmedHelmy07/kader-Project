import React, { useState } from 'react';
import { postContactMessage } from '../services/firestore';
import { KaderLogo } from './icons/KaderLogo';
import { useToast } from './Toast';

const ContactPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  const toast = useToast();
  const submit = async () => {
    if (!email || !text.trim()) return toast?.push ? toast.push('Please fill email and message') : alert('Please fill email and message');
    try {
      await postContactMessage({ userEmail: email, text: text.trim() });
      setText('');
      toast?.push ? toast.push('Message sent — we will contact you soon') : alert('Message sent — we will contact you soon');
    } catch (err) {
      console.error(err);
      toast?.push ? toast.push('Failed to send message') : alert('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded p-6 text-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <KaderLogo className="w-14 h-14" />
          <div>
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <div className="text-sm text-gray-300">Send us a message and we'll respond to your email.</div>
          </div>
        </div>
        <div className="bg-gray-900/60 p-4 rounded border border-gray-700">
          <input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-3 bg-transparent border rounded text-gray-100 placeholder-gray-400" />
          <textarea placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 mb-3 bg-transparent border rounded text-gray-100 placeholder-gray-400" rows={6} />
          <div className="flex justify-end">
            <button onClick={submit} className="bg-blue-600 px-4 py-2 rounded text-white">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
