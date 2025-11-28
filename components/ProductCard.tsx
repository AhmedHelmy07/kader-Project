import React from 'react';
import type { Product } from '../services/firestore';
import { useLanguage } from '../i18n/LanguageContext';

const ProductCard: React.FC<{ product: Product; onAdd?: (p: Product) => void }> = ({ product, onAdd }) => {
  const { t } = useLanguage();
  // Use base64Image if available, otherwise use image URL, otherwise use placeholder
  const imageSource = product.base64Image || product.image || '/images/7.jpg';
  
  return (
    <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-500 transition-all duration-500 flex flex-col hover:scale-105 transform">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none"></div>
      <div className="relative h-64 w-full bg-gray-900/50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
        <img
          src={imageSource}
          alt={product.title}
          className="max-h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="relative p-6 flex-1 flex flex-col z-10">
        <h3 className="font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">{product.title}</h3>
        <p className="text-sm text-gray-400 mb-4 flex-1 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{product.description}</p>
        <button
          onClick={() => onAdd?.(product)}
          className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden group/btn"
        >
          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover/btn:w-full"></span>
          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t('store.addToCart')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
