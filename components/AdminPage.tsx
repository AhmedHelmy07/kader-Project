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
    toast?.push('Ticket closed');
  };

  const markProcessing = async (id: string) => {
    await updateTicketStatus(id, 'in-progress');
    toast?.push('Ticket marked as in-progress');
  };

  const removeProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    toast?.push('Product deleted');
  };

  const removeCommunity = async (id: string) => {
    if (!window.confirm('Delete this community message?')) return;
    await deleteCommunityMessage(id);
    toast?.push('Community message deleted');
  };

  const removeContact = async (id: string) => {
    if (!window.confirm('Delete this contact message?')) return;
    await deleteContactMessage(id);
    toast?.push('Contact message deleted');
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createOrUpdateProduct({ title, description, price, stock, image } as any);
      toast?.push('Product added successfully!');
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
      toast?.push('Product updated successfully!');
      setEditingProduct(null);
      setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
    } catch (err) {
      console.error('edit failed', err);
      toast?.push('Failed to update product');
    } finally {
      setAdding(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'dashboard'|'products'|'tickets'|'orders'|'contact'|'community'>('dashboard');
  const [unlocked, setUnlocked] = useState<boolean>(() => !!sessionStorage.getItem('admin_unlocked'));
  const [passwordInput, setPasswordInput] = useState('');

  const handleOrderAction = async (id: string, status: any) => {
    await updateOrderStatus(id, status);
    toast?.push(`Order marked as ${status}`);
  };

  const tryUnlock = async () => {
    const pwd = await getAdminPassword();
    if (!pwd) { alert('No admin password set. Please set it in Firestore admin_pass collection.'); return; }
    if (passwordInput === pwd) {
      sessionStorage.setItem('admin_unlocked', '1');
      setUnlocked(true);
      setPasswordInput('');
      toast?.push('Admin access granted');
    } else {
      toast?.push('Incorrect password');
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
    toast?.push('You are now an admin');
    sessionStorage.setItem('admin_unlocked', '1');
    setUnlocked(true);
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    communityMessages: communityMsgs.length,
    contactMessages: contactMsgs.length,
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-full">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">Admin Access</h2>
            <p className="text-gray-300 text-center mb-8">Enter your admin password to continue</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && tryUnlock()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <button
                onClick={tryUnlock}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Unlock Dashboard
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Development Options</span>
                </div>
              </div>

              <button
                onClick={handleMakeMeAdmin}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium py-2 rounded-lg transition-all duration-300"
              >
                Make Me Admin (Dev)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-50"></div>
                <div className="relative p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
                  <KaderLogo className="w-10 h-10" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage your platform in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Admin Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
              title="Total Products"
              value={stats.totalProducts}
              color="blue"
              trend="+12%"
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              title="Total Orders"
              value={stats.totalOrders}
              color="green"
              subtitle={`${stats.pendingOrders} pending`}
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              title="Open Tickets"
              value={stats.openTickets}
              color="yellow"
              subtitle={`of ${tickets.length} total`}
            />
            <StatCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              color="purple"
              trend="+23%"
            />
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-8 animate-fade-in-delay">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'products', label: 'Products', icon: '🛍️', count: products.length },
                { id: 'tickets', label: 'Tickets', icon: '🎫', count: tickets.length },
                { id: 'orders', label: 'Orders', icon: '📦', count: orders.length },
                { id: 'contact', label: 'Contact', icon: '✉️', count: contactMsgs.length },
                { id: 'community', label: 'Community', icon: '💬', count: communityMsgs.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg shadow-red-500/30'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-delay-2">
          {activeTab === 'dashboard' && <DashboardOverview stats={stats} tickets={tickets} orders={orders} />}
          {activeTab === 'products' && (
            <ProductsSection
              products={products}
              editingProduct={editingProduct}
              title={title}
              setTitle={setTitle}
              price={price}
              setPrice={setPrice}
              stock={stock}
              setStock={setStock}
              image={image}
              setImage={setImage}
              description={description}
              setDescription={setDescription}
              submitAdd={submitAdd}
              submitEdit={submitEdit}
              adding={adding}
              startEdit={startEdit}
              setEditingProduct={setEditingProduct}
              removeProduct={removeProduct}
            />
          )}
          {activeTab === 'tickets' && <TicketsSection tickets={tickets} markProcessing={markProcessing} markClosed={markClosed} />}
          {activeTab === 'orders' && <OrdersSection orders={orders} handleOrderAction={handleOrderAction} />}
          {activeTab === 'contact' && <ContactSection messages={contactMsgs} removeContact={removeContact} />}
          {activeTab === 'community' && <CommunitySection messages={communityMsgs} removeCommunity={removeCommunity} />}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; trend?: string; subtitle?: string }> = ({
  icon, title, value, color, trend, subtitle
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    yellow: 'from-yellow-500 to-orange-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-400 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<{ stats: any; tickets: any[]; orders: any[] }> = ({ stats, tickets, orders }) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order, idx) => (
              <div key={order.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{order.userEmail}</p>
                    <p className="text-gray-400 text-sm">${order.total}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Recent Tickets
          </h3>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket, idx) => (
              <div key={ticket.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-medium">{ticket.subject}</p>
                    <p className="text-gray-400 text-sm">{ticket.userEmail}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                    ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsSection: React.FC<any> = ({
  products, editingProduct, title, setTitle, price, setPrice, stock, setStock,
  image, setImage, description, setDescription, submitAdd, submitEdit, adding,
  startEdit, setEditingProduct, removeProduct
}) => {
  return (
    <div className="space-y-6">
      {/* Add/Edit Product Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={editingProduct ? submitEdit : submitAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Product Title"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="Price ($)"
              type="number"
              step="0.01"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              placeholder="Stock Quantity"
              type="number"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <input
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Image URL"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Product Description"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {adding ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <div key={p.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            {p.image && (
              <div className="h-48 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <h4 className="text-white font-bold text-lg mb-1">{p.title}</h4>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-400">${p.price}</span>
                <span className="text-sm text-gray-400">Stock: {p.stock}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TicketsSection: React.FC<{ tickets: any[]; markProcessing: (id: string) => void; markClosed: (id: string) => void }> = ({
  tickets, markProcessing, markClosed
}) => {
  return (
    <div className="space-y-4">
      {tickets.map((t, idx) => (
        <div key={t.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-white font-bold text-lg">{t.subject}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  t.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                  t.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{t.userEmail}</p>
              <p className="text-gray-300">{t.message}</p>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(t.createdAt?.seconds ? t.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => markProcessing(t.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark In Progress
            </button>
            <button
              onClick={() => markClosed(t.id)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark Closed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const OrdersSection: React.FC<{ orders: any[]; handleOrderAction: (id: string, status: string) => void }> = ({
  orders, handleOrderAction
}) => {
  return (
    <div className="space-y-4">
      {orders.map((o, idx) => (
        <div key={o.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-white font-bold text-xl">${o.total}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  o.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {o.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{o.userEmail}</p>
              <div className="space-y-1">
                {o.items?.map((it: any, idx: number) => (
                  <div key={idx} className="text-gray-300 text-sm">
                    {it.qty}× {it.productId} — ${it.price}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(o.createdAt?.seconds ? o.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleOrderAction(o.id, 'paid')}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark Paid
            </button>
            <button
              onClick={() => handleOrderAction(o.id, 'shipped')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark Shipped
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ContactSection: React.FC<{ messages: any[]; removeContact: (id: string) => void }> = ({ messages, removeContact }) => {
  return (
    <div className="space-y-4">
      {messages.map((m, idx) => (
        <div key={m.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{m.userEmail}</p>
              <p className="text-gray-300 mb-2">{m.text}</p>
              <p className="text-gray-500 text-xs">
                {new Date(m.createdAt?.seconds ? m.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeContact(m.id)}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommunitySection: React.FC<{ messages: any[]; removeCommunity: (id: string) => void }> = ({ messages, removeCommunity }) => {
  return (
    <div className="space-y-4">
      {messages.map((m, idx) => (
        <div key={m.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{m.userEmail}</p>
              <p className="text-gray-300 mb-2">{m.text}</p>
              <p className="text-gray-500 text-xs">
                {new Date(m.createdAt?.seconds ? m.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeCommunity(m.id)}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
