import React, { useState, useCallback, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { Job, Product } from './types';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import { SearchIcon, ArrowLeftIcon } from './components/IconComponents';
import { formatDateISO, parseDate } from './utils/date';
import { JobDetailModal } from './components/JobDetailModal';
import { JobFilters } from './components/JobFilters';
import { Footer } from './components/Footer';
import { JobCardSkeleton } from './components/JobCardSkeleton';
import { JobFiltersSkeleton } from './components/JobFiltersSkeleton';
import { BajajEmiModal } from './components/BajajEmiModal';
import { csvToJson } from './utils/csv';
import { ErrorDisplay } from './components/ErrorDisplay';
import { PromotionalBanner } from './components/PromotionalBanner';
import { WhatsAppIcon } from './components/IconComponents';
import { CategoryDashboard } from './components/CategoryDashboard';
import { FeaturedGiftsSection } from './components/FeaturedGiftsSection';
import { NewsTicker } from './components/NewsTicker';
import { trackPageView } from './utils/analytics';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { mockExamsData } from './data/mockExams';
import { mockProductsData } from './data/mockProducts';

// Lazy load page components for code splitting
const AboutUsPage = lazy(() => import('./components/AboutUsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const CalculatorsPage = lazy(() => import('./components/CalculatorsPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const GiftArticlesPage = lazy(() => import('./components/GiftArticlesPage'));
const MockTestsPage = lazy(() => import('./components/MockTestsPage'));
const AffiliatePage = lazy(() => import('./components/AffiliatePage'));


export type Page = 'home' | 'contact' | 'calculators' | 'services' | 'gift-articles' | 'about' | 'store';
const validPages: Page[] = ['home', 'contact', 'calculators', 'services', 'gift-articles', 'about', 'store'];

/**
 * Derives the current page from the URL hash.
 * @param hash The current window.location.hash
 * @returns The page name. Defaults to 'home'.
 */
const getPageFromHash = (hash: string): Page => {
    const page = hash.replace(/^#\/?/, '').split('/')[0] as Page;
    return validPages.includes(page) ? page : 'home';
};


/**
 * Updates all relevant SEO meta tags in the document's head.
 * @param title The new page title.
 * @param description The new meta description.
 * @param keywords Optional comma-separated string of keywords.
 */
const updateMetaTags = (title: string, description: string, keywords?: string, path: string = '') => {
    document.title = title;

    const updateAttribute = (id: string, attribute: 'content' | 'href', value: string) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attribute, value);
    };
    
    // Use the full URL including the hash for canonical and OG tags
    const url = window.location.origin + window.location.pathname + path;

    updateAttribute('meta-description', 'content', description);
    
    if (keywords !== undefined) {
      updateAttribute('meta-keywords', 'content', keywords);
    }

    updateAttribute('og-title', 'content', title);
    updateAttribute('og-description', 'content', description);
    updateAttribute('twitter-title', 'content', title);
    updateAttribute('twitter-description', 'content', description);
    updateAttribute('og-url', 'content', url);
    updateAttribute('canonical-link', 'href', url);
};

// --- Banners ---
const WHATSAPP_CHANNEL_LINK = "https://www.whatsapp.com/channel/0029Vb5yZWO1Hsq1iW0DeQ3s";
const MOCK_TEST_LINK = "https://slate.freejobalert.com/mock-test/";

const WhatsAppBanner: React.FC = () => {
  return (
    <section 
      className="my-8 animate-fade-in-up" 
      style={{ animationDelay: '300ms' }}
      aria-labelledby="whatsapp-banner-title"
    >
      <div className="relative bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-lg p-3 sm:p-4 shadow-lg overflow-hidden">
        <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none">
          <WhatsAppIcon className="w-24 h-24 text-white" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
              <WhatsAppIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="whatsapp-banner-title" className="text-base sm:text-lg font-bold">
                Get Daily Job Updates on WhatsApp!
              </h2>
              <p className="mt-1 text-xs opacity-90">
                Join our channel for the latest job updates.
              </p>
            </div>
          </div>
          <a
            href={WHATSAPP_CHANNEL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block flex-shrink-0 w-full sm:w-auto bg-white text-green-600 font-bold py-1.5 px-4 text-sm rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Join Now
          </a>
        </div>
      </div>
    </section>
  );
};

const PageLoader: React.FC = () => (
    <div className="flex justify-center items-center py-20" aria-label="Loading page content">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400"></div>
    </div>
);


const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filter states
  const [textFilter, setTextFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [selectedDashboardCategory, setSelectedDashboardCategory] = useState<string | null>(null);
  
  // Page navigation state (now driven by URL hash)
  const [path, setPath] = useState(window.location.hash);
  const page = useMemo(() => getPageFromHash(path), [path]);

  // Theme state
  type Theme = 'light' | 'dark' | 'system';
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  
  // Accessibility state
  const [liveText, setLiveText] = useState('');
  
  // Bajaj EMI Modal state
  const [isBajajModalOpen, setIsBajajModalOpen] = useState(false);

  // Ref to store the element that triggered the modal for focus return
  const triggerRef = useRef<HTMLElement | null>(null);

  // Effect to handle routing via URL hash
  useEffect(() => {
    // Set a default hash if none exists
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '/home';
    }

    const handleHashChange = () => {
      setPath(window.location.hash);
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial call to sync state from URL on load
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNavigate = (newPage: Page) => {
    // Reset transient state when navigating between main pages
    if (page !== newPage) {
        setSelectedJob(null);
        setTextFilter('');
        setCategoryFilter([]);
        setSelectedDashboardCategory(null);
    }
    window.location.hash = `/${newPage}`;
  };
  
  const handleSelectCategory = (category: string) => {
    setSelectedDashboardCategory(category);
    setCategoryFilter([category]);
    setTextFilter('');
    window.scrollTo(0, 0);
  };
  
  const handleBackToCategories = () => {
    setSelectedDashboardCategory(null);
    setCategoryFilter([]);
  };

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setJobs([]);

    // IMPORTANT: Replace this with your public Google Sheet URL.
    // It must be shared as "Anyone with the link" and end with "/export?format=csv".
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1rovDxCJ58N9bGdbHlrXP-l1uxdRR4F1GxO19QsWm-vs/export?format=csv";

    if (!sheetUrl || sheetUrl.includes('YOUR_GOOGLE_SHEET_EXPORT_URL_HERE')) {
        setError("Configuration Error: The Google Sheet URL is missing. Please contact the site administrator to configure it correctly.");
        setIsLoading(false);
        return;
    }

    try {
        const response = await fetch(sheetUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet data. Status: ${response.statusText}. Ensure the URL is correct and the sheet is public.`);
        }
        
        let csvText = await response.text();
        
        // Remove Byte Order Mark (BOM) if present, as it can interfere with parsing
        if (csvText.charCodeAt(0) === 0xFEFF) {
            csvText = csvText.substring(1);
        }

        const json = csvToJson(csvText);

        if (json.length === 0) {
            setJobs([]);
            setIsLoading(false);
            return;
        }

        // Check for required headers to ensure the sheet is formatted correctly
        const actualHeaders = Object.keys(json[0]).map(h => h.toLowerCase().trim());
        const requiredHeaders = ['job title', 'description', 'last date', 'start date', 'category'];
        const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));

        if (missingHeaders.length > 0) {
            throw new Error(`Data Format Error: The spreadsheet is missing the following required columns: ${missingHeaders.join(', ')}. Please correct the sheet format.`);
        }

        const parsedJobs: Job[] = json.map((row: any, index: number) => ({
            id: row['id'] || `job-${index}`,
            jobTitle: row['job title'] || 'No Title',
            description: row['description'] || 'No Description',
            category: row['category'] || 'Other',
            lastDate: row['last date'],
            startDate: row['start date'],
            salary: row['salary'],
            responsibilities: row['responsibilities'],
            syllabusLink: row['syllabuslink'],
            employmentType: row['employment type'] || row['job type'],
            requiredDocuments: row['required documents'],
            sourceSheetLink: row['link'],
            blogContent: row['blog content'],
        }));
        
        setJobs(parsedJobs);

    } catch (err) {
        console.error("Error fetching or parsing jobs:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching jobs.";

        if (errorMessage.toLowerCase().includes('failed to fetch')) {
             setError('Network Error: Could not connect to the data source. Please check your internet connection and try again. If the problem persists, the data sheet may be private or unavailable.');
        } else {
             setError(errorMessage);
        }
    } finally {
        setIsLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProducts([]);

    // --- Developer Note ---
    // This section uses mock data. To use a Google Sheet, create a new sheet
    // in your document, publish it to the web as CSV, and get its unique 'gid'.
    // Then, replace the mock data logic with a fetch call similar to fetchJobs,
    // using a URL like: `https://docs.google.com/spreadsheets/d/YOUR_DOC_ID/export?format=csv&gid=YOUR_SHEET_GID`
    
    try {
        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // Use mock data
        if (mockProductsData.length === 0) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        const requiredHeaders = ['id', 'title', 'description', 'imageurl', 'affiliatelink', 'category'];
        const actualHeaders = Object.keys(mockProductsData[0]).map(h => h.toLowerCase().trim());
        const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));

        if (missingHeaders.length > 0) {
            throw new Error(`Product Data Format Error: The data is missing the following required columns: ${missingHeaders.join(', ')}.`);
        }
        
        const parsedProducts: Product[] = mockProductsData.map((row: any) => ({
            id: row['id'],
            title: row['title'],
            description: row['description'],
            imageUrl: row['imageUrl'],
            affiliateLink: row['affiliateLink'],
            category: row['category'],
        }));
        
        setProducts(parsedProducts);

    } catch (err) {
        console.error("Error fetching or parsing products:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching products.";
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page === 'home') {
        fetchJobs();
    } else if (page === 'store') {
        fetchProducts();
    }
  }, [page, fetchJobs, fetchProducts]);
  
  // Effect to show Bajaj EMI modal on homepage visit
  useEffect(() => {
    let timer: number;
    // Show the modal on the home page after the initial load is complete.
    // It will reappear every time the user navigates back to the home page.
    if (page === 'home' && !isLoading) {
      timer = window.setTimeout(() => {
        setIsBajajModalOpen(true);
      }, 3000); // 3-second delay
    } else {
      // If not on the home page or currently loading, ensure the modal is closed.
      setIsBajajModalOpen(false);
    }
    
    // Cleanup: clear the timer if the user navigates away before it fires.
    return () => clearTimeout(timer);
  }, [page, isLoading]);

  // Effect to handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === 'system') {
            root.classList.toggle('dark', mediaQuery.matches);
        }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const allJobCategories = useMemo(() => {
    const categories = new Set(jobs.map(job => job.category).filter(Boolean) as string[]);
    // Add 'SYLLABUS' as a virtual category if any job has a syllabus link
    if (jobs.some(job => job.syllabusLink)) {
        categories.add('SYLLABUS');
    }
    return Array.from(categories).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
        let categoryMatch = categoryFilter.length === 0;
        if (!categoryMatch) {
            // A job matches if its own category is selected
            const jobCategoryMatch = job.category && categoryFilter.includes(job.category);
            // OR if 'SYLLABUS' is selected and the job has a syllabus link
            const syllabusCategoryMatch = categoryFilter.includes('SYLLABUS') && !!job.syllabusLink;
            categoryMatch = jobCategoryMatch || syllabusCategoryMatch;
        }
        
        const textMatch = !textFilter ||
            job.jobTitle.toLowerCase().includes(textFilter.toLowerCase()) ||
            job.description.toLowerCase().includes(textFilter.toLowerCase());
        
        return categoryMatch && textMatch;
    });
  }, [jobs, textFilter, categoryFilter]);

  const sortedJobs = useMemo(() => {
    return [...jobs]
      .filter(job => job.jobTitle !== 'No Title')
      .sort((a, b) => {
        const dateA = formatDateISO(a.startDate);
        const dateB = formatDateISO(b.startDate);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB.localeCompare(dateA); // Descending sort
      });
  }, [jobs]);

  const latestJobs = useMemo(() => {
    return sortedJobs.slice(0, 4);
  }, [sortedJobs]);
  
  const tickerJobs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day for comparison

    return sortedJobs
      .filter(job => {
        const lastDate = parseDate(job.lastDate);
        // If there's no last date, or the date is invalid, we include it.
        // If there is a last date, it must be on or after today.
        return !lastDate || lastDate >= today;
      })
      .slice(0, 10);
  }, [sortedJobs]);


  // Accessibility: Announce filter results
  useEffect(() => {
    if (!isLoading && (textFilter || categoryFilter.length > 0)) {
        setLiveText(`${filteredJobs.length} jobs found.`);
    } else {
        setLiveText(''); 
    }
  }, [filteredJobs.length, isLoading, textFilter, categoryFilter]);


  const handleJobClick = (job: Job, event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    triggerRef.current = event.currentTarget;
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };
  
  const handleCloseBajajModal = () => {
    setIsBajajModalOpen(false);
  };
  
  const handleMockTestBannerClick = () => {
    window.open(MOCK_TEST_LINK, '_blank', 'rel=noopener,noreferrer');
  };

  // SEO: Dynamically update page title and meta tags
  useEffect(() => {
    let title = 'Sai Satya Net | Job Openings';
    let description = "Explore current job openings at Sai Satya Net. Your one-stop solution for internet services & customized gift articles.";
    let keywords = "jobs, careers, Sai Satya Net, Garividi, job openings, internet services, gift articles, ssc mock tests";

    if (page === 'home' && selectedJob) {
      title = `${selectedJob.jobTitle} | Sai Satya Net`;
      description = selectedJob.description;
      keywords = [
          selectedJob.jobTitle, 
          selectedJob.category, 
          'Sai Satya Net', 
          'job opening', 
          'career opportunity'
      ].filter(Boolean).join(', ');
    } else if (page === 'about') {
      title = 'About Us | Sai Satya Net';
      description = "Learn about the story, mission, and founder of Sai Satya Net. Discover our commitment to providing essential internet, job, and gift services to the Garividi community.";
      keywords = "about sai satya net, garividi services, a.satya narayana, internet services vizianagaram";
    } else if (page === 'contact') {
      title = 'Contact Us | Sai Satya Net';
      description = "Get in touch with Sai Satya Net. We're here to help with any questions about our job openings or services. Reach out via phone, email, WhatsApp, or visit us.";
      keywords = "contact sai satya net, sai satya net phone, sai satya net address, garividi, vizianagaram, saisatyanet1@gmail.com, 8977846407, whatsapp";
    } else if (page === 'calculators') {
      title = 'Calculators | Sai Satya Net';
      description = "Use our free and easy-to-use calculators for age and percentages. Find out your exact age or solve any percentage problem instantly.";
      keywords = "age calculator, percentage calculator, free online tools, sai satya net";
    } else if (page === 'services') {
      title = 'Our Services | Sai Satya Net';
      description = "Explore a wide range of services offered by Sai Satya Net, including CSC services, job works, PAN card assistance, ticket bookings, EPF services, and more.";
      keywords = "csc services, job works, pan card, ticket booking, epf services, garividi, vizianagaram";
    } else if (page === 'gift-articles') {
      title = 'Custom Gift Articles | Sai Satya Net';
      description = "Discover our unique collection of customized gift articles, including photo mugs, custom t-shirts, personalized frames, and more. Perfect for any occasion.";
      keywords = "custom gifts, photo mugs, personalized t-shirts, gift shop, garividi";
    } else if (page === 'store') {
      title = 'Recommended Products | Sai Satya Net';
      description = "Explore our curated list of recommended books, electronics, and stationery for competitive exams and office use. Shop our affiliate links to support us.";
      keywords = "ssc books, rrb books, exam preparation, affiliate products, recommended books, stationery";
    }
    
    updateMetaTags(title, description, keywords, path);
    
  }, [selectedJob, page, path]);

  // Analytics: Track page views for SPA navigation
  useEffect(() => {
    let title = 'Sai Satya Net | Job Openings';

    // Determine title based on the page, NOT the selected job modal for consistent analytics
    if (page === 'about') {
      title = 'About Us | Sai Satya Net';
    } else if (page === 'contact') {
      title = 'Contact Us | Sai Satya Net';
    } else if (page === 'calculators') {
      title = 'Calculators | Sai Satya Net';
    } else if (page === 'services') {
      title = 'Our Services | Sai Satya Net';
    } else if (page === 'gift-articles') {
      title = 'Custom Gift Articles | Sai Satya Net';
    } else if (page === 'store') {
      title = 'Recommended Products | Sai Satya Net';
    }
    
    trackPageView(path, title);
  }, [page, path]);


  // SEO: Inject JSON-LD structured data
  useEffect(() => {
    const scriptId = 'page-schema';
    
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }
    
    let schema: object | null = null;
    const url = window.location.origin + window.location.pathname + path;

    if (page === 'home' && jobs.length > 0) {
      schema = {
        "@context": "https://schema.org/",
        "@type": "ItemList",
        "name": "Available Jobs at Sai Satya Net",
        "itemListElement": jobs.map((job, index) => {
          const jobSchema: any = {
            "@type": "JobPosting",
            "title": job.jobTitle,
            "description": job.description,
            "hiringOrganization": {
              "@type": "Organization",
              "name": "Sai Satya Net",
              "sameAs": url,
            },
          };
          
          const datePosted = formatDateISO(job.startDate);
          if (datePosted) jobSchema.datePosted = datePosted;
          
          const validThrough = formatDateISO(job.lastDate);
          if (validThrough) jobSchema.validThrough = validThrough;

          if (job.employmentType) jobSchema.employmentType = job.employmentType;
          if (job.salary) jobSchema.baseSalary = { "@type": "MonetaryAmount", "currency": "INR", "value": job.salary };
          
          return {
            "@type": "ListItem",
            "position": index + 1,
            "item": jobSchema
          };
        })
      };
    } else if (page === 'about') {
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sai Satya Net",
          "url": url,
          "logo": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%2316a34a%22%20%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2250%22%20font-size%3D%2240%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22sans-serif%22%20font-weight%3D%22bold%22%3ESSN%3C%2Ftext%3E%3C%2Fsvg%3E",
          "founder": {
            "@type": "Person",
            "name": "A.Satya Narayana"
          },
          "foundingDate": "2010",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Beside Bridge Down, Garividi",
            "addressLocality": "Vizianagaram",
            "addressRegion": "Andhra Pradesh",
            "postalCode": "535101",
            "addressCountry": "IN"
          },
          "description": "Sai Satya Net is a one-stop solution for internet services, job assistance, government service facilitation, and customized gift articles in Garividi, Vizianagaram.",
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "saisatyanet1@gmail.com",
            "contactType": "customer service"
          }
        };
    } else if (page === 'calculators') {
        schema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Calculators",
            "description": "Free online calculators for age and percentages.",
            "url": url,
        };
    } else if (page === 'services') {
        const serviceList = [
            "Common Service Center (CSC)", "All types of Job works", "UTI Pan Card Services", "Aadhar & Pan Link", "Aadhar Update & Downloading", "Voter Id Card Apply & Correction & Downloading", "Passport New & Renewal Slot Booking", "LLR & Driving Licence Slot Booking", "Train / Bus / Flight Tickets Booking", "Toll Gates fasTag", "Travels", "Road Tax", "Trafic E Challana", "DTP Telugu Typing", "TTD Darshan Tickets & Accommodation Booking", "Shiridi Darshanam Tickets & Accommodation Booking", "Shabarimala Dharshnam Tickets Booking", "All Types PVC Cards Printing", "All types of Photo Printing", "Lamination", "Employee Health Cards", "Eshram Cards", "All Pension Holders Life Certificate", "Udyam Registration", "Marriage Certificate Registration", "Student Bus Pass", "Color & Black and Wight Zerox", "Spiral Binding", "AU, JNTU & Ambedkar Universitis Tatkal PC & OD Applications", "All types of Fee Payments", "Employment Exchange Registration", "Digi-Pay Service (AEPS)", "All Type of Banks Money Withdraw", "Money Transfer", "Balance Enquiry", "EPF Services", "UAN Number Allotment & Activation", "P F Withdraw", "EPF E- Nominee", "Epf Previous Account to Present Account Transfer", "Bank book & Pan Ekyc", "Joint Declaration Form", "APSRTC Logistics", "Parcle & Courier service"
        ];
        schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Sai Satya Net Services",
            "