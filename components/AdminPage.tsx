import React, { useEffect, useState } from 'react';
import { listProducts, listTickets, updateTicketStatus, createOrUpdateProduct, deleteProduct } from '../services/firestore';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setProducts(await listProducts());
      setTickets(await listTickets());
    })();
  }, []);

  const markClosed = async (id: string) => {
    await updateTicketStatus(id, 'closed');
    setTickets(await listTickets());
  };

  const removeProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts(await listProducts());
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white/5 p-3 rounded">
              <div className="font-bold">{p.title}</div>
              <div className="text-sm">${p.price}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => removeProduct(p.id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">Tickets</h3>
        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="bg-white/5 p-3 rounded">
              <div className="text-sm text-gray-300">{t.userEmail} • {t.status}</div>
              <div className="font-bold">{t.subject}</div>
              <div className="mt-1">{t.message}</div>
              <div className="mt-2">
                <button onClick={() => markClosed(t.id)} className="bg-green-600 px-3 py-1 rounded">Mark Closed</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
