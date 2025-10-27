import React from 'react';

export interface GiftItem {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface GiftCardProps {
    item: GiftItem;
    highlighted?: boolean;
}

export const GiftCard: React.FC<GiftCardProps> = ({ item, highlighted }) => {
  const baseClasses = "bg-white dark:bg-slate-800 rounded-lg border shadow-sm p-6 flex flex-col text-center items-center hover:shadow-lg transition-all duration-300 relative overflow-hidden group h-full";
  const normalClasses = "border-gray-200 dark:border-slate-700";
  const highlightedClasses = "border-2 border-green-500 dark:border-green-400 shadow-lg shadow-green-500/20 dark:shadow-green-400/20 hover:-translate-y-1";

  return (
    <div className={`${baseClasses} ${highlighted ? highlightedClasses : normalClasses}`}>
        {highlighted && (
            <div className="absolute top-2 right-2 transform rotate-12 bg-green-500 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-md z-10">
                Popular
            </div>
        )}
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 mb-4 transition-transform duration-300 group-hover:scale-110">
            <item.icon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{item.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">{item.description}</p>
    </div>
  );
};
