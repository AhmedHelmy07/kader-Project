import React from 'react';
import type { Product } from '../services/firestore';

const ProductCard: React.FC<{ product: Product; onBuy?: () => void }> = ({ product, onBuy }) => {
  return (
    <div className="bg-white/5 border border-gray-700 rounded-lg p-4 flex flex-col">
      <img src={product.image || '/images/7.jpg'} alt={product.title} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="font-bold text-lg mb-2">{product.title}</h3>
      <p className="text-sm text-gray-300 mb-4">{product.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
        <button onClick={onBuy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Buy</button>
      </div>
    </div>
  );
};

export default ProductCard;
