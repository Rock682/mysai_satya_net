import React from 'react';

interface PromotionalBannerProps {
  text: string;
  onClick: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ text, onClick }) => {
  // Inject animation styles into the head, replacing old ones if they exist
  const styleId = 'promo-banner-animation';
  const existingStyleEl = document.getElementById(styleId);
  const styleEl = existingStyleEl || document.createElement('style');
  
  if (!existingStyleEl) {
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  
  styleEl.innerHTML = `
    @keyframes shimmer-effect {
      0% { transform: translateX(-150%) skewX(-30deg); }
      100% { transform: translateX(150%) skewX(-30deg); }
    }
    .shimmer-overlay::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        110deg,
        transparent 20%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 80%
      );
      animation: shimmer-effect 2.5s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes pulse-tag {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7); }
      50% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(250, 204, 21, 0); }
    }
    .animate-pulse-tag {
      animation: pulse-tag 2s infinite;
    }
  `;

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-r from-teal-500 to-green-600 dark:from-teal-600 dark:to-green-700 text-white rounded-lg p-4 mb-4 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02] overflow-hidden shimmer-overlay"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={text + ", click to navigate"}
    >
      <span className="absolute top-2 left-2 bg-yellow-400 text-green-900 text-xs font-bold uppercase px-2 py-1 rounded-full shadow-md animate-pulse-tag">
        New
      </span>
      {/* Content wrapper to ensure it's above the pseudo-element */}
      <div className="relative z-10 flex items-center justify-center text-center">
        <p className="text-base sm:text-lg font-bold tracking-wide [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.4)]">
          {text}
        </p>
        <span className="ml-2 sm:ml-4 text-xs sm:text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity hidden sm:inline">
          Click here &rarr;
        </span>
      </div>
    </div>
  );
};