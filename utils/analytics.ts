// utils/analytics.ts

// Extend the Window interface to include gtag and GA_MEASUREMENT_ID
declare global {
    interface Window {
        gtag?: (command: string, action: string, params: object) => void;
        GA_MEASUREMENT_ID?: string;
    }
}

/**
 * Tracks a page view event for a Single Page Application (SPA).
 * This should be called on every route change.
 * The initial page load is tracked by the 'config' command in index.html.
 * @param path The new path of the page (e.g., '#/home').
 * @param title The title of the page.
 */
export const trackPageView = (path: string, title: string) => {
    // Check if gtag function and Measurement ID are available on the window object
    if (window.gtag && window.GA_MEASUREMENT_ID) {
        const page_location = window.location.origin + window.location.pathname + path;
        
        // Send a 'page_view' event to Google Analytics
        window.gtag('event', 'page_view', {
            page_title: title,
            page_location: page_location,
            page_path: window.location.pathname + path,
        });
    } else {
        // Silently log to the console if analytics is not available (e.g., blocked by an ad blocker)
        // This prevents runtime errors in the application.
        console.log(`Analytics disabled: gtag not found. Page view for ${path} not tracked.`);
    }
};
