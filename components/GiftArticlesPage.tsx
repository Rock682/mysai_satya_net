
import React from 'react';
import { GiftIcon } from './IconComponents';

const giftCategories = [
    {
        title: "Photo Mugs",
        description: "Start your day with a smile. Personalize mugs with your favorite photos, text, or designs.",
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
    },
    {
        title: "Custom T-Shirts",
        description: "Wear your story. Design custom t-shirts for events, teams, or personal expression.",
        icon: (props: any) => (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h5.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125zm0 0V4.5m0 2.25h5.25m-5.25 0h-1.5m1.5 0v3.375m0 0h5.25m-5.25 0h-1.5m1.5 0v3.375" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H18.375c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
        ),
    },
    {
        title: "Photo Frames",
        description: "Frame your memories beautifully. A wide range of customizable frames for any occasion.",
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
    },
    {
        title: "Keychains",
        description: "Carry your memories with you. Custom keychains with photos, names, or special dates.",
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
        ),
    },
    {
        title: "Pillows & Cushions",
        description: "Add a personal touch to your home decor. Cozy, custom-printed pillows and cushions.",
         icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 4.25H3a.75.75 0 00-.75.75v14c0 .414.336.75.75.75h18a.75.75 0 00.75-.75V5a.75.75 0 00-.75-.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12a4.5 4.5 0 109 0 4.5 4.5 0 00-9 0z" />
            </svg>
        ),
    },
    {
        title: "Wall Clocks",
        description: "Tell time your way. Design a unique wall clock with your own images and art.",
         icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

const GiftCard: React.FC<{ item: typeof giftCategories[0] }> = ({ item }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col text-center items-center hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 mb-4">
            <item.icon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{item.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">{item.description}</p>
    </div>
);

export const GiftArticlesPage: React.FC = () => {
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
                    <GiftCard key={item.title} item={item} />
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