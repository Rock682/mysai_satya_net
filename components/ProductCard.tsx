import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article
      className="group flex flex-row sm:flex-col bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg sm:hover:-translate-y-1"
      aria-labelledby={`product-title-${product.id}`}
    >
      {/* Mobile: Larger, centered image container. Desktop: Square aspect ratio box. */}
      <div className="relative flex-shrink-0 w-40 h-40 sm:w-full sm:h-auto sm:pt-[100%] bg-white flex items-center justify-center p-2">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full sm:absolute sm:top-0 sm:left-0 object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.category && (
            <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {product.category}
            </div>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 id={`product-title-${product.id}`} className="text-sm sm:text-md font-bold text-gray-800 dark:text-gray-100 line-clamp-3">
          {product.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 hidden sm:block">
          {product.description}
        </p>
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-block w-full text-center bg-green-600 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
          aria-label={`Add ${product.title} to cart on Amazon`}
        >
          Add to Cart
        </a>
      </div>
    </article>
  );
};

// Add line-clamp style if not available in Tailwind
const style = document.createElement('style');
if (!document.getElementById('product-card-style')) {
    style.id = 'product-card-style';
    style.textContent = `
      .line-clamp-2, .line-clamp-3 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .line-clamp-2 {
        -webkit-line-clamp: 2;
      }
      .line-clamp-3 {
        -webkit-line-clamp: 3;
      }
    `;
    document.head.appendChild(style);
}