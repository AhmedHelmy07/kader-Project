import React, { useEffect, useState } from 'react';
import { onProductsChanged, onTicketsChanged, updateTicketStatus, createOrUpdateProduct, deleteProduct } from '../services/firestore';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState('');

  useEffect(() => {
    const offTickets = onTicketsChanged(items => setTickets(items));
    const offProducts = onProductsChanged(items => setProducts(items));
    return () => {
      offTickets();
      offProducts();
    };
  }, []);

  const markClosed = async (id: string) => {
    await updateTicketStatus(id, 'closed');
  };

  const removeProduct = async (id: string) => {
    await deleteProduct(id);
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createOrUpdateProduct({ title, description, price, stock, image } as any);
      setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
    } catch (err) {
      console.error('create product failed', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        <form onSubmit={submitAdd} className="mb-4 p-3 bg-white/3 rounded">
          <div className="grid md:grid-cols-3 gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 rounded bg-black/20" required />
            <input value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" type="number" className="p-2 rounded bg-black/20" required />
            <input value={stock} onChange={e => setStock(Number(e.target.value))} placeholder="Stock" type="number" className="p-2 rounded bg-black/20" />
            <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="p-2 rounded bg-black/20 col-span-2" />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="p-2 rounded bg-black/20 col-span-3" />
          </div>
          <div className="mt-3">
            <button className="bg-blue-600 px-4 py-2 rounded" disabled={adding}>{adding ? 'Adding...' : 'Add Product'}</button>
          </div>
        </form>
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
