
import React from 'react';

export const JobCardSkeleton: React.FC = () => {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex flex-col justify-between animate-pulse">
        <div>
            {/* Title Skeleton */}
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            
            {/* Description Skeleton */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>

            {/* Meta info Skeleton */}
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
        </div>
      
        {/* Dates Skeleton */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-1.5"></div>
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4"></div>
                </div>
                <div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-1.5"></div>
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4"></div>
                </div>
            </div>
        </div>
    </article>
  );
};