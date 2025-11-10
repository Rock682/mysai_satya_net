import React from 'react';
import { GiftIcon } from './IconComponents';
import { giftCategories } from '../data/gifts';
import { GiftCard } from './GiftCard';


const GiftArticlesPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="text-center mb-12">
                <GiftIcon className="mx-auto h-12 w-12 text-green-600" />
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">Customized Gift Articles</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                    Create unique, personalized gifts for your loved ones for any occasion.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {giftCategories.map(item => (
                    <GiftCard 
                        key={item.title} 
                        item={item} 
                        highlighted={item.title === "Photo Frames"}
                    />
                ))}
            </div>
        </div>
    );
};

// Add keyframes for animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default GiftArticlesPage;
