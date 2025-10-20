
import React from 'react';

export const JobFiltersSkeleton: React.FC = () => {
    return (
        <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Search Input Skeleton */}
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-md md:col-span-2"></div>
                
                {/* Category Multiselect Skeleton */}
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
            </div>
        </div>
    );
};