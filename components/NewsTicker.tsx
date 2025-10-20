import React from 'react';
import { Job } from '../types';

interface NewsTickerProps {
  jobs: Job[];
  onItemClick: (job: Job, event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ jobs, onItemClick }) => {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  // Calculate a dynamic duration based on the number of items to keep the speed consistent.
  // Approx 5 seconds per item.
  const animationDuration = `${jobs.length * 5}s`;

  return (
    <div className="relative group flex overflow-hidden bg-white dark:bg-slate-800 border-y border-gray-200 dark:border-slate-700 mt-8 mb-2 shadow-sm">
      <div 
        className="flex animate-marquee"
        style={{ animationPlayState: 'running', animationDuration }}
      >
        {/* Render the list twice for a seamless loop */}
        {[...jobs, ...jobs].map((job, index) => (
          <button
            key={`${job.id}-${index}`}
            onClick={(e) => onItemClick(job, e)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemClick(job, e)}
            className="flex-shrink-0 flex items-center py-2 px-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label={`View details for ${job.jobTitle}`}
          >
            <span className="bg-red-500 text-white text-xs font-bold uppercase px-2 py-0.5 rounded-full mr-3">
              New
            </span>
            <span className="font-semibold truncate" title={job.jobTitle}>
              {job.jobTitle}
            </span>
            <span className="mx-4 text-gray-300 dark:text-slate-600" aria-hidden="true">|</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Inject the animation styles into the document head.
const styleId = 'news-ticker-animation-style';
if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee linear infinite;
      }
      .group:hover .animate-marquee {
        animation-play-state: paused;
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-marquee {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
}
