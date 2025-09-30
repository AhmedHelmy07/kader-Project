import React from 'react';
import type { Product } from '../services/firestore';

const ProductCard: React.FC<{ product: Product; onAdd?: (p: Product) => void }> = ({ product, onAdd }) => {
  return (
    <div className="bg-gradient-to-br from-black/20 to-black/10 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col">
      <div className="h-48 w-full bg-gray-800">
        <img src={product.image || '/images/7.jpg'} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-white mb-1">{product.title}</h3>
        <p className="text-sm text-gray-300 mb-4 flex-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
          <button onClick={() => onAdd?.(product)} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transform transition">Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
