import React, { useEffect, useState, useRef } from 'react';
import type { Product } from '../services/firestore';
import { createOrder, setCartForUser, getCartForUser, onCartChanged } from '../services/firestore';
import { useToast } from './Toast';
import { useAuth } from '../auth/AuthContext';

interface CartItem { product: Product; qty: number }

const CartPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const toast = useToast();

  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      setError('Failed to load cart');
    }

    let off: any;
    if (user?.uid) {
      (async () => {
        try {
          const remote = await getCartForUser(user.uid);
          if (remote && Array.isArray(remote) && remote.length) {
            setItems(remote);
          }
          off = onCartChanged(user.uid, (it: any[]) => {
            try {
              if (Array.isArray(it)) {
                const a = JSON.stringify(it || []);
                const b = JSON.stringify(itemsRef.current || []);
                if (a !== b) setItems(it);
              }
            } catch (e) { 
              console.error('Cart update error:', e);
              if (Array.isArray(it)) setItems(it);
            }
          });
        } catch (err) {
          console.error('Failed to sync cart from Firestore:', err);
          setError('Failed to sync cart');
        }
      })();
    }
    return () => off && off();
  }, [user]);

  useEffect(() => {
    setError(null); // Clear errors on successful update
    const id = setTimeout(() => {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
        if (user?.uid) {
          setCartForUser(user.uid, items).catch((err) => {
            console.error('Failed to save cart to Firestore:', err);
            setError('Failed to save cart');
          });
        }
      } catch (err) {
        console.error('Failed to save cart:', err);
        setError('Failed to save cart');
      }
    }, 150);
    return () => clearTimeout(id);
  }, [items, user]);

  const total = items.reduce((s, it) => s + (it.product.price * it.qty), 0);
  const subtotal = total;
  const tax = subtotal * 0.1; // 10% tax
  const finalTotal = subtotal + tax;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const userEmail = user?.email || 'guest';
      const orderId = await createOrder({ 
        userEmail, 
        items: items.map(i => ({ 
          productId: i.product.id || '', 
          qty: i.qty, 
          price: i.product.price 
        })), 
        total: finalTotal 
      } as any);
      
      localStorage.removeItem('cart');
      setItems([]);
      if (user?.uid) await setCartForUser(user.uid, []);
      
      setShowCheckout(false);
      toast?.push(`✅ Order placed successfully! Order ID: ${orderId}`);
      
      setTimeout(() => navigate('#/store'), 1500);
    } catch (err) {
      console.error('Payment failed:', err);
      toast?.push('❌ Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeAt = (productId: string | undefined) => {
    if (!productId) {
      toast?.push('❌ Error: Product ID not found');
      return;
    }
    const copy = items.filter(item => item.product.id !== productId);
    setItems(copy);
    toast?.push('✅ Item removed from cart');
  };

  const updateQuantity = (productId: string | undefined, qty: number) => {
    if (!productId) {
      toast?.push('❌ Error: Product ID not found');
      return;
    }
    const validQty = Math.max(1, qty);
    const copy = items.map(item =>
      item.product.id === productId ? { ...item, qty: validQty } : item
    );
    setItems(copy);
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      try {
        setItems([]);
        localStorage.removeItem('cart');
        if (user?.uid) setCartForUser(user.uid, []).catch(err => {
          console.error('Failed to clear cart in Firestore:', err);
          setError('Failed to clear cart');
        });
        toast?.push('✅ Cart cleared');
      } catch (err) {
        console.error('Failed to clear cart:', err);
        setError('Failed to clear cart');
        toast?.push('❌ Failed to clear cart');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Shopping Cart</h1>
              <p className="text-gray-400 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
            </div>
            <button
              onClick={() => navigate('#/store')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-red-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <svg className="w-20 h-20 mx-auto mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h3>
              <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
              <button
                onClick={() => navigate('#/store')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.product.id || Math.random()}
                    className="p-6 border-b border-white/10 last:border-0 hover:bg-white/5 transition-all duration-300 flex gap-6"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-800 rounded-xl overflow-hidden">
                      <img
                        src={item.product.base64Image || item.product.image || '/images/7.jpg'}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{item.product.title}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.product.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-400">
                          ${(item.product.price * item.qty).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          ${item.product.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.qty - 1)}
                          className="p-1 hover:bg-white/20 rounded transition-all duration-200"
                          title="Decrease quantity"
                        >
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-12 bg-transparent text-center font-bold text-white focus:outline-none text-lg"
                        />
                        <button
                          onClick={() => updateQuantity(item.product.id, item.qty + 1)}
                          className="p-1 hover:bg-white/20 rounded transition-all duration-200"
                          title="Increase quantity"
                        >
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeAt(item.product.id)}
                        className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-gray-200 rounded-lg transition-all duration-300 border border-gray-700 text-sm"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-6 sticky top-32 space-y-4">
                <h3 className="text-xl font-bold text-white">Order Summary</h3>

                <div className="space-y-3 py-4 border-t border-white/10">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>

                  {!showCheckout ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </span>
                        ) : (
                          <span>Confirm Payment</span>
                        )}
                      </button>
                      <button
                        onClick={() => setShowCheckout(false)}
                        disabled={isProcessing}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back to Cart
                      </button>
                      <p className="text-xs text-gray-400 text-center pt-2">
                        💳 This is a simulation. No actual payment will be processed.
                      </p>
                    </div>
                  )}
                </div>

                {/* Info Cards */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex gap-2 text-sm text-gray-400">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-400">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-400">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
