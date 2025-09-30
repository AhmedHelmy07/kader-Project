import React, { useEffect, useState } from 'react';
import { onProductsChanged, onTicketsChanged, updateTicketStatus, createOrUpdateProduct, deleteProduct } from '../services/firestore';
import { KaderLogo } from './icons/KaderLogo';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

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

  const markProcessing = async (id: string) => {
    await updateTicketStatus(id, 'in-progress');
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

  const startEdit = (p: any) => {
    setEditingProduct(p);
    setTitle(p.title || ''); setDescription(p.description || ''); setPrice(p.price || 0); setStock(p.stock || 0); setImage(p.image || '');
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setAdding(true);
    try {
      await createOrUpdateProduct({ id: editingProduct.id, title, description, price, stock, image } as any);
      setEditingProduct(null);
    } catch (err) {
      console.error('edit failed', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <KaderLogo className="w-14 h-14" />
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="text-sm text-gray-400">Manage products and support tickets in realtime</div>
        </div>
      </div>
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        <form onSubmit={editingProduct ? submitEdit : submitAdd} className="mb-4 p-3 bg-white/3 rounded">
          <div className="grid md:grid-cols-3 gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 rounded bg-black/20" required />
            <input value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" type="number" className="p-2 rounded bg-black/20" required />
            <input value={stock} onChange={e => setStock(Number(e.target.value))} placeholder="Stock" type="number" className="p-2 rounded bg-black/20" />
            <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="p-2 rounded bg-black/20 col-span-2" />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="p-2 rounded bg-black/20 col-span-3" />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="bg-blue-600 px-4 py-2 rounded" disabled={adding}>{adding ? 'Working...' : (editingProduct ? 'Save Changes' : 'Add Product')}</button>
            {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage(''); }} className="bg-gray-700 px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white/5 p-3 rounded">
              {p.image && <img src={p.image} alt={p.title} className="h-28 w-full object-cover rounded mb-2" />}
              <div className="font-bold">{p.title}</div>
              <div className="text-sm">${p.price}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => startEdit(p)} className="bg-yellow-600 px-3 py-1 rounded">Edit</button>
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
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-300">{t.userEmail}</div>
                  <div className="font-bold">{t.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${t.status === 'open' ? 'bg-yellow-500 text-black' : t.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-green-600 text-white'}`}>{t.status}</div>
                  <button onClick={() => markProcessing(t.id)} className="bg-blue-600 px-3 py-1 rounded">Processing</button>
                  <button onClick={() => markClosed(t.id)} className="bg-green-600 px-3 py-1 rounded">Close</button>
                </div>
              </div>
              <div className="mt-2">{t.message}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
