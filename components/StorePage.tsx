import React, { useEffect, useState } from 'react';
import { listProducts, Product, setCartForUser, getCartForUser, onCartChanged } from '../services/firestore';
import ProductCard from './ProductCard';
import { useAuth } from '../auth/AuthContext';

interface StorePageProps { navigate: (path: string) => void }

const StorePage: React.FC<StorePageProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const [cart, setCart] = useState<Array<{ product: Product; qty: number }>>([]);

  useEffect(() => {
    (async () => {
      const p = await listProducts();
      setProducts(p);
    })();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) setCart(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (user?.uid) {
      setCartForUser(user.uid, cart).catch(console.error);
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user?.uid) return;
    let off: any; (async () => {
      const remote = await getCartForUser(user.uid);
      if (remote && remote.length) setCart(remote);
      off = onCartChanged(user.uid, (items: any[]) => setCart(items));
    })();
    return () => off && off();
  }, [user]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev]; copy[idx].qty++; return copy;
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Store</h2>
            <p className="text-gray-400">Premium wheelchair accessories and equipment</p>
          </div>
          <button
            onClick={() => navigate('#/cart')}
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cart ({cart.reduce((s,i)=>s+i.qty,0)})</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {cart.reduce((s,i)=>s+i.qty,0)}
              </span>
            )}
          </button>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-400 text-lg">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onAdd={(prod)=>addToCart(prod)} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
