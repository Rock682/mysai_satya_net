import React from 'react';
import { Page } from '../App';
import { giftCategories } from '../data/gifts';
import { GiftCard } from './GiftCard';

interface FeaturedGiftsSectionProps {
    onNavigate: (page: Page) => void;
}

export const FeaturedGiftsSection: React.FC<FeaturedGiftsSectionProps> = ({ onNavigate }) => {
    // Find the Photo Frames gift item specifically.
    const photoFrameGift = giftCategories.find(item => item.title === "Photo Frames");

    // If for some reason it's not found, don't render the section.
    if (!photoFrameGift) {
        return null;
    }

    return (
        <section className="mt-2 mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex justify-between items-center mb-6 border-b-2 border-green-200 dark:border-green-800 pb-3">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Popular Gift Articles
                </h2>
                <button
                    onClick={() => onNavigate('gift-articles')}
                    className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                    aria-label="View all gift articles"
                >
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>

            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm">
                    <GiftCard
                        item={photoFrameGift}
                        highlighted={true}
                    />
                </div>
            </div>
        </section>
    );
};
