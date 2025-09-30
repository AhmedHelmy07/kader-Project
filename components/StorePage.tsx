import React, { useEffect, useState } from 'react';
import { listProducts, Product } from '../services/firestore';
import ProductCard from './ProductCard';

interface StorePageProps { navigate: (path: string) => void }

const StorePage: React.FC<StorePageProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const p = await listProducts();
      setProducts(p);
    })();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Store</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} onBuy={() => navigate('#/cart')} />)}
      </div>
    </div>
  );
};

export default StorePage;
