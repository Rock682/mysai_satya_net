import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ShoppingCartIcon } from './IconComponents';

interface AffiliatePageProps {
  products: Product[];
  isLoading: boolean;
}

const ProductCardSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
    <div className="bg-gray-200 dark:bg-slate-700 pt-[100%]"></div>
    <div className="p-4">
      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="mt-4 h-10 bg-green-200 dark:bg-green-900/50 rounded-lg w-full"></div>
    </div>
  </div>
);


const AffiliatePage: React.FC<AffiliatePageProps> = ({ products, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const allCategories = new Set(products.map(p => p.category));
    return ['All', ...Array.from(allCategories).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="animate-fade-in-up">
      {/* New Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 md:p-12 mb-10 border border-gray-200 dark:border-slate-700 overflow-hidden text-center">
        <div className="absolute -top-10 -right-10 opacity-10 text-green-400 pointer-events-none">
          <ShoppingCartIcon className="w-48 h-48 transform rotate-12" />
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Curated for Your Success
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Explore our handpicked collection of books, electronics, and stationery to aid you in your competitive exam journey and daily tasks.
            </p>
        </div>
      </section>

      {/* Restyled Filters */}
      <nav className="mb-8" aria-label="Product Categories">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
           <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:block">Filter by:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-green-500
                ${selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                }`}
            >
                {category}
            </button>
          ))}
        </div>
      </nav>

      <main>
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
            </div>
        ) : (
            filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg max-w-4xl mx-auto shadow-sm">
                    <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No Products Found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      There are no products available in this category right now.
                    </p>
                  </div>
            )
        )}
      </main>
    </div>
  );
};

export default AffiliatePage;