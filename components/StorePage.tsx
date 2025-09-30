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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Store</h2>
          <button onClick={() => navigate('#/cart')} className="bg-blue-600 px-3 py-2 rounded text-white">Cart ({cart.reduce((s,i)=>s+i.qty,0)})</button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} onAdd={(prod)=>addToCart(prod)} />)}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
