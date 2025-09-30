import React, { useEffect, useState } from 'react';
import type { Product } from '../services/firestore';
import { createOrder, setCartForUser, getCartForUser, onCartChanged } from '../services/firestore';
import { useAuth } from '../auth/AuthContext';

interface CartItem { product: Product; qty: number }

const CartPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) setItems(JSON.parse(raw));
    if (user?.uid) {
      (async () => {
        const remote = await getCartForUser(user.uid);
        if (remote && remote.length) setItems(remote);
      })();
      const off = onCartChanged(user.uid, (it: any[]) => setItems(it));
      return () => off && off();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    if (user?.uid) {
      setCartForUser(user.uid, items).catch(console.error);
    }
  }, [items]);

  const total = items.reduce((s, it) => s + (it.product.price * it.qty), 0);

  const handlePay = async () => {
    // simulate payment
    const userEmail = user?.email || 'guest';
    const orderId = await createOrder({ userEmail, items: items.map(i => ({ productId: i.product.id || '', qty: i.qty, price: i.product.price })), total } as any);
    localStorage.removeItem('cart');
    setItems([]);
    if (user?.uid) await setCartForUser(user.uid, []);
    navigate('#/store');
    alert('Payment simulated. Order ID: ' + orderId);
  };

  const removeAt = (idx: number) => {
    const copy = [...items]; copy.splice(idx, 1); setItems(copy);
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
              <img src={it.product.image || '/images/7.jpg'} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-bold">{it.product.title}</div>
                <div className="text-sm text-gray-300">${it.product.price.toFixed(2)} x {it.qty}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { const copy = [...items]; copy[idx].qty++; setItems(copy); }} className="bg-blue-600 px-3 py-1 rounded">+</button>
                <button onClick={() => { const copy = [...items]; copy[idx].qty = Math.max(1, copy[idx].qty-1); setItems(copy); }} className="bg-gray-700 px-3 py-1 rounded">-</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-2">
              <button onClick={() => navigate('#/store')} className="bg-gray-700 px-4 py-2 rounded">Continue Shopping</button>
              <button onClick={handlePay} className="bg-green-600 px-4 py-2 rounded text-white">Pay (simulate)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
