import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext<any>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number; text: string }>>([]);
  const push = (text: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 top-4 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="bg-black text-white px-4 py-2 rounded shadow">{t.text}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
