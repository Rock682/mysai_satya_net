import React from 'react';

interface CategoryCardProps {
  category: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onSelect: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, Icon, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="group relative bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm text-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-green-400 dark:hover:border-green-500 hover:-translate-y-1 overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      aria-label={`View jobs in ${category} category`}
    >
      <div className="absolute top-0 right-0 h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-bl-full opacity-50 group-hover:scale-125 transition-transform duration-500 ease-in-out"></div>
      <div className="relative">
        <Icon className="mx-auto h-7 w-7 text-green-500 dark:text-green-400 mb-1 transition-transform group-hover:scale-110" />
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate" title={category}>{category}</h2>
        <div className="mt-1.5 text-xs font-semibold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
          View &rarr;
        </div>
      </div>
    </div>
  );
};
