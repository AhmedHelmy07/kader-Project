import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './Toast';
import { onProductsChanged, onTicketsChanged, updateTicketStatus, createOrUpdateProduct, deleteProduct, onOrdersChanged, updateOrderStatus, onContactMessagesChanged, onMessagesChanged, deleteCommunityMessage, deleteContactMessage, getAdminPassword, setAdminPassword, setUserAdmin } from '../services/firestore';
import { KaderLogo } from './icons/KaderLogo';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contactMsgs, setContactMsgs] = useState<any[]>([]);
  const [communityMsgs, setCommunityMsgs] = useState<any[]>([]);
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
    const offOrders = onOrdersChanged(items => setOrders(items));
    const offContact = onContactMessagesChanged(items => setContactMsgs(items));
    const offCommunity = onMessagesChanged(items => setCommunityMsgs(items));
    return () => {
      offTickets(); offProducts(); offOrders(); offContact(); offCommunity();
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
    toast?.push('Product deleted');
  };

  const removeCommunity = async (id: string) => {
    await deleteCommunityMessage(id);
    toast?.push('Community message deleted');
  };

  const removeContact = async (id: string) => {
    await deleteContactMessage(id);
    toast?.push('Contact message deleted');
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createOrUpdateProduct({ title, description, price, stock, image } as any);
      toast?.push('Product added');
      setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
    } catch (err) {
      console.error('create product failed', err);
      toast?.push('Failed to add product');
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
      toast?.push('Product updated');
      setEditingProduct(null);
    } catch (err) {
      console.error('edit failed', err);
      toast?.push('Failed to update product');
    } finally {
      setAdding(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'products'|'tickets'|'orders'|'contact'|'community'>('products');
  const [unlocked, setUnlocked] = useState<boolean>(() => !!sessionStorage.getItem('admin_unlocked'));
  const [passwordInput, setPasswordInput] = useState('');

  const handleOrderAction = async (id: string, status: any) => {
    await updateOrderStatus(id, status);
    toast?.push('Order updated');
  };

  const tryUnlock = async () => {
    const pwd = await getAdminPassword();
    if (!pwd) { alert('No admin password set. Please set it in Firestore admin_pass collection.'); return; }
    if (passwordInput === pwd) {
      sessionStorage.setItem('admin_unlocked', '1');
      setUnlocked(true);
      setPasswordInput('');
      toast?.push('Admin unlocked');
    } else {
      toast?.push('Wrong password');
    }
  };

  const { user } = useAuth();
  const toast = useToast();

  const handleSetAdminPassword = async () => {
    if (!passwordInput) return toast?.push('Enter a password');
    await setAdminPassword(passwordInput);
    toast?.push('Admin password saved to Firestore');
    setPasswordInput('');
  };

  const handleMakeMeAdmin = async () => {
    if (!user) return toast?.push('Sign in first');
    await setUserAdmin(user.uid, true);
    toast?.push('You are now an admin (users/{uid}.admin set)');
    sessionStorage.setItem('admin_unlocked', '1');
    setUnlocked(true);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 rounded bg-black shadow"><KaderLogo className="w-14 h-14" /></div>
          <div>
            <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
            <div className="text-sm text-gray-600">Manage products, orders, messages and tickets in realtime</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('products')} className={`px-3 py-2 rounded ${activeTab==='products' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Products</button>
              <button onClick={() => setActiveTab('tickets')} className={`px-3 py-2 rounded ${activeTab==='tickets' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Tickets</button>
              <button onClick={() => setActiveTab('orders')} className={`px-3 py-2 rounded ${activeTab==='orders' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Orders</button>
              <button onClick={() => setActiveTab('contact')} className={`px-3 py-2 rounded ${activeTab==='contact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Contact</button>
              <button onClick={() => setActiveTab('community')} className={`px-3 py-2 rounded ${activeTab==='community' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Community</button>
            </div>
            <div>
              {!unlocked ? (
                <div className="flex items-center gap-2">
                  <input type="password" placeholder="Admin password" value={passwordInput} onChange={e=>setPasswordInput(e.target.value)} className="px-3 py-2 border rounded" />
                  <button onClick={tryUnlock} className="px-3 py-2 bg-green-600 text-white rounded">Unlock</button>
                </div>
              ) : (
                <div className="text-sm text-green-600 font-medium">Unlocked</div>
              )}
            </div>
          </div>
          <div className="p-4">
            {/* TAB CONTENT */}
            {activeTab === 'products' && (
              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Products</h3>
                <form onSubmit={editingProduct ? submitEdit : submitAdd} className="mb-4 p-3 bg-gray-50 rounded">
                  <div className="grid md:grid-cols-3 gap-3">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 rounded border" required />
                    <input value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" type="number" className="p-2 rounded border" required />
                    <input value={stock} onChange={e => setStock(Number(e.target.value))} placeholder="Stock" type="number" className="p-2 rounded border" />
                    <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="p-2 rounded border col-span-2" />
                    <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="p-2 rounded border col-span-3" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className={`px-4 py-2 rounded ${unlocked ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`} disabled={!unlocked || adding}>{adding ? 'Working...' : (editingProduct ? 'Save Changes' : 'Add Product')}</button>
                    {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage(''); }} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
                  </div>
                </form>
                <div className="grid md:grid-cols-3 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white shadow rounded overflow-hidden">
                      {p.image && <img src={p.image} alt={p.title} className="h-44 w-full object-cover" />}
                      <div className="p-3">
                        <div className="font-bold text-lg">{p.title}</div>
                        <div className="text-sm text-gray-700">${p.price}</div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => startEdit(p)} className={`px-3 py-1 rounded ${unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Edit</button>
                          <button onClick={() => removeProduct(p.id)} className={`px-3 py-1 rounded ${unlocked ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'tickets' && (
              <section>
                <h3 className="text-xl font-semibold mb-2">Tickets</h3>
                <div className="space-y-3">
                  {tickets.map(t => (
                    <div key={t.id} className="bg-gray-50 p-3 rounded flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-600">{t.userEmail} • {new Date(t.createdAt?.seconds ? t.createdAt.seconds*1000 : Date.now()).toLocaleString()}</div>
                        <div className="font-bold">{t.subject}</div>
                        <div className="mt-1 text-gray-700">{t.message}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded-full text-sm ${t.status === 'open' ? 'bg-yellow-400 text-black' : t.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-green-600 text-white'}`}>{t.status}</div>
                        <div className="flex gap-2">
                          <button onClick={() => markProcessing(t.id)} className={`px-3 py-1 rounded ${unlocked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Processing</button>
                          <button onClick={() => markClosed(t.id)} className={`px-3 py-1 rounded ${unlocked ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Close</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'orders' && (
              <section>
                <h3 className="text-xl font-semibold mb-2">Orders</h3>
                <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600">{o.userEmail} • {new Date(o.createdAt?.seconds ? o.createdAt.seconds*1000 : Date.now()).toLocaleString()}</div>
                          <div className="font-bold">Total: ${o.total}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm ${o.status === 'pending' ? 'bg-yellow-400 text-black' : o.status === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>{o.status}</div>
                          <button onClick={() => handleOrderAction(o.id, 'paid')} className={`px-3 py-1 rounded ${unlocked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Mark Paid</button>
                          <button onClick={() => handleOrderAction(o.id, 'shipped')} className={`px-3 py-1 rounded ${unlocked ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Mark Shipped</button>
                        </div>
                      </div>
                      <div className="mt-2">
                        {o.items?.map((it: any, idx: number) => (
                          <div key={idx} className="text-sm text-gray-700">{it.qty}× {it.productId} — ${it.price}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'contact' && (
              <section>
                <h3 className="text-xl font-semibold mb-2">Contact Messages</h3>
                <div className="space-y-3">
                  {contactMsgs.map(c => (
                    <div key={c.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">{c.userEmail} • {new Date(c.createdAt?.seconds ? c.createdAt.seconds*1000 : Date.now()).toLocaleString()}</div>
                        <div className="mt-1 text-gray-700">{c.text}</div>
                      </div>
                      <div>
                        <button onClick={() => removeContact(c.id)} className={`px-3 py-1 rounded ${unlocked ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'community' && (
              <section>
                <h3 className="text-xl font-semibold mb-2">Community Messages</h3>
                <div className="space-y-3">
                  {communityMsgs.map(m => (
                    <div key={m.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">{m.userEmail} • {new Date(m.createdAt?.seconds ? m.createdAt.seconds*1000 : Date.now()).toLocaleString()}</div>
                        <div className="mt-1 text-gray-700">{m.text}</div>
                      </div>
                      <div>
                        <button onClick={() => removeCommunity(m.id)} className={`px-3 py-1 rounded ${unlocked ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`} disabled={!unlocked}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
