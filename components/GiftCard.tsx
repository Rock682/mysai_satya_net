import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

export interface GiftItem {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    images?: string[];
}

interface GiftCardProps {
    item: GiftItem;
    highlighted?: boolean;
}

export const GiftCard: React.FC<GiftCardProps> = ({ item, highlighted }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const hasImages = item.images && item.images.length > 0;

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (item.images) {
            setCurrentImageIndex((prev) => (prev + 1) % item.images!.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (item.images) {
            setCurrentImageIndex((prev) => (prev - 1 + item.images!.length) % item.images!.length);
        }
    };

    // Auto-advance logic
    useEffect(() => {
        let interval: number;
        if (hasImages && !isHovered) {
            interval = window.setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % item.images!.length);
            }, 3000); // Change slide every 3 seconds
        }
        return () => clearInterval(interval);
    }, [hasImages, isHovered, item.images]);


    const baseClasses = "bg-white dark:bg-slate-800 rounded-lg border shadow-sm p-6 flex flex-col text-center items-center hover:shadow-lg transition-all duration-300 relative overflow-hidden group h-full";
    const normalClasses = "border-gray-200 dark:border-slate-700";
    const highlightedClasses = "border-2 border-green-500 dark:border-green-400 shadow-lg shadow-green-500/20 dark:shadow-green-400/20 hover:-translate-y-1";

    return (
        <div 
            className={`${baseClasses} ${highlighted ? highlightedClasses : normalClasses}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {highlighted && (
                <div className="absolute top-2 right-2 transform rotate-12 bg-green-500 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-md z-10">
                    Popular
                </div>
            )}

            {/* Image Carousel or Static Icon */}
            <div className="w-full mb-4 relative flex items-center justify-center">
                {hasImages ? (
                    <div className="relative w-full h-48 sm:h-56 rounded-md overflow-hidden group/carousel">
                         <img 
                            src={item.images![currentImageIndex]} 
                            alt={`${item.title} example ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500"
                            loading="lazy"
                        />
                        {/* Navigation Buttons (Only show if more than 1 image) */}
                        {item.images!.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 focus:outline-none"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 focus:outline-none"
                                    aria-label="Next image"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                                {/* Dots Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                                    {item.images!.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 transition-transform duration-300 group-hover:scale-110">
                        <item.icon className="h-10 w-10" />
                    </div>
                )}
            </div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{item.title}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">{item.description}</p>
        </div>
    );
};