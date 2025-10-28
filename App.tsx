
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Job } from './types';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import { SearchIcon, ArrowLeftIcon } from './components/IconComponents';
import { formatDateISO } from './utils/date';
import { JobDetailModal } from './components/JobDetailModal';
import { JobFilters } from './components/JobFilters';
import { ContactPage } from './components/ContactPage';
import { CalculatorsPage } from './components/CalculatorsPage';
import { Footer } from './components/Footer';
import { JobCardSkeleton } from './components/JobCardSkeleton';
import { JobFiltersSkeleton } from './components/JobFiltersSkeleton';
import { ServicesPage } from './components/ServicesPage';
import { GiftArticlesPage } from './components/GiftArticlesPage';
import { MockTestsPage, mockExamsData } from './components/MockTestsPage';
import { AboutUsPage } from './components/AboutUsPage';
import { BajajEmiModal } from './components/BajajEmiModal';
import { csvToJson } from './utils/csv';
import { ErrorDisplay } from './components/ErrorDisplay';
import { PromotionalBanner } from './components/PromotionalBanner';
import { WhatsAppIcon } from './components/IconComponents';
import { CategoryDashboard } from './components/CategoryDashboard';
import { FeaturedGiftsSection } from './components/FeaturedGiftsSection';
import { NewsTicker } from './components/NewsTicker';
import { trackPageView } from './utils/analytics';


export type Page = 'home' | 'contact' | 'calculators' | 'services' | 'gift-articles' | 'mock-tests' | 'about';
const validPages: Page[] = ['home', 'contact', 'calculators', 'services', 'gift-articles', 'mock-tests', 'about'];

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

// --- WhatsApp Banner Component ---
const WHATSAPP_CHANNEL_LINK = "https://www.whatsapp.com/channel/0029Vb5yZWO1Hsq1iW0DeQ3s";

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


const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
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
            location: row['location'],
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

  useEffect(() => {
    if (page === 'home') {
        fetchJobs();
    }
  }, [page, fetchJobs]);
  
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
    return Array.from(categories).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
        const categoryMatch = categoryFilter.length === 0 || (job.category && categoryFilter.includes(job.category));
        
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
    return sortedJobs.slice(0, 10);
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
  
  // SEO & Analytics: Dynamically update page title, meta tags, and track page views
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
          selectedJob.location, 
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
    } else if (page === 'mock-tests') {
      title = 'Mock Tests | Sai Satya Net';
      description = "Prepare for competitive exams like SSC and Banking with our free online mock tests. Get detailed performance analysis and improve your scores.";
      keywords = "ssc mock test, online exam practice, free mock test, competitive exams, banking exams";
    }
    
    updateMetaTags(title, description, keywords, path);
    trackPageView(path, title);
    
  }, [selectedJob, page, path]);


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

          if (job.location) {
            jobSchema.jobLocation = {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
              }
            };
          }
          
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
            "description": "A comprehensive list of services provided by Sai Satya Net.",
            "itemListElement": serviceList.map((service, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Service",
                    "name": service,
                    "provider": {
                        "@type": "Organization",
                        "name": "Sai Satya Net"
                    }
                }
            }))
        };
    } else if (page === 'gift-articles') {
        const giftList = ["Photo Mugs", "Custom T-Shirts", "Personalized Photo Frames", "Custom Keychains", "Photo Pillows", "Personalized Wall Clocks"];
        schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Sai Satya Net Gift Articles",
            "description": "A collection of customizable gift articles available at Sai Satya Net.",
            "itemListElement": giftList.map((gift, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": gift,
                    "description": `Personalized ${gift.toLowerCase()} perfect for any occasion.`,
                    "brand": {
                        "@type": "Brand",
                        "name": "Sai Satya Net"
                    }
                }
            }))
        };
    } else if (page === 'contact') {
        schema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Sai Satya Net",
          "description": "Your one-stop solution for internet services & customized gift articles.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Beside Bridge Down, Garividi",
            "addressLocality": "Vizianagaram",
            "addressRegion": "Andhra Pradesh",
            "postalCode": "535101",
            "addressCountry": "IN"
          },
          "email": "saisatyanet1@gmail.com",
          "telephone": "+91-8977846407",
          "url": url
        };
    } else if (page === 'mock-tests') {
        schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Online Mock Tests for Competitive Exams",
            "description": "Prepare for SSC and Banking exams with free online mock tests from Sai Satya Net.",
            "itemListElement": mockExamsData
              .filter(exam => exam.published === 'TRUE')
              .map((exam, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Quiz",
                    "name": exam.examName,
                    "description": `A practice test for ${exam.examType} exams with ${exam.totalQuestions} questions.`,
                    "timeRequired": `PT${exam.durationMinutes}M`
                }
              }))
          };
    }
      
    if (schema) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [jobs, page, path]);

  // Accessibility & Modal state management
  useEffect(() => {
    const header = document.getElementById('app-header');
    const main = document.getElementById('main-content');
    const footer = document.getElementById('app-footer');
    
    const isModalOpen = !!selectedJob || isBajajModalOpen;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      header?.setAttribute('aria-hidden', 'true');
      main?.setAttribute('aria-hidden', 'true');
      footer?.setAttribute('aria-hidden', 'true');
    } else {
      // Modal is closed
      document.body.style.overflow = 'auto';
      header?.removeAttribute('aria-hidden');
      main?.removeAttribute('aria-hidden');
      footer?.removeAttribute('aria-hidden');
      // Return focus to the element that opened the modal
      if (triggerRef.current) {
          triggerRef.current.focus();
          triggerRef.current = null; // Clear ref after focus is returned
      }
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      header?.removeAttribute('aria-hidden');
      main?.removeAttribute('aria-hidden');
      footer?.removeAttribute('aria-hidden');
    };
  }, [selectedJob, isBajajModalOpen]);


  const renderPage = () => {
    switch(page) {
      case 'home':
        if (isLoading) {
          return (
            <div>
              <JobFiltersSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </div>
            </div>
          );
        }

        if (error) {
          return <ErrorDisplay message={error} onDismiss={() => setError(null)} onRetry={fetchJobs} />;
        }

        if (selectedDashboardCategory) {
            return (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {`Openings in ${selectedDashboardCategory}`}
                  </h2>
                  <button
                    onClick={handleBackToCategories}
                    className="flex self-start sm:self-center items-center px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    All Categories
                  </button>
                </div>
  
                <JobFilters
                  textFilter={textFilter}
                  onTextFilterChange={setTextFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  categories={allJobCategories}
                  showCategoryFilter={true}
                />
  
                {filteredJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} onClick={(e) => handleJobClick(job, e)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg max-w-4xl mx-auto shadow-sm">
                    <SearchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No Matching Jobs Found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Try adjusting your search filters or check another category.
                    </p>
                  </div>
                )}
              </>
            );
          }

        return (
            <>
              <PromotionalBanner 
                text="Free mock test for Govt Exams"
                onClick={() => handleNavigate('mock-tests')}
              />
              
              <NewsTicker jobs={tickerJobs} onItemClick={handleJobClick} />

               <section className="my-8" aria-labelledby="latest-updates-title">
                <h2 id="latest-updates-title" className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Latest Updates
                </h2>
                {latestJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestJobs.map((job) => (
                      <JobCard key={job.id} job={job} onClick={(e) => handleJobClick(job, e)} />
                    ))}
                  </div>
                ) : (
                   <div className="mt-4 text-center py-10 px-6 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No new updates right now. Check back soon!</p>
                  </div>
                )}
              </section>

              <FeaturedGiftsSection onNavigate={handleNavigate} />

              <WhatsAppBanner />

              <CategoryDashboard onSelectCategory={handleSelectCategory} />
            </>
        );

      case 'about':
        return <AboutUsPage />;
      case 'contact':
        return <ContactPage />;
      case 'services':
        return <ServicesPage />;
      case 'gift-articles':
        return <GiftArticlesPage />;
      case 'calculators':
        return <CalculatorsPage />;
      case 'mock-tests':
        return <MockTestsPage />;
      default:
        return <div>Page not found</div>;
    }
  };


  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col">
      <Header currentPage={page} onNavigate={handleNavigate} theme={theme} setTheme={setTheme} />
      <div className="sr-only" aria-live="polite" role="status">
        {liveText}
      </div>
      <main id="main-content" className="container mx-auto px-4 py-6 sm:py-8 flex-grow" aria-busy={isLoading}>
        {renderPage()}
      </main>
      
      {selectedJob && <JobDetailModal job={selectedJob} onClose={handleCloseModal} />}
      {isBajajModalOpen && <BajajEmiModal isOpen={isBajajModalOpen} onClose={handleCloseBajajModal} />}
      <Footer />
    </div>
  );
};

export default App;