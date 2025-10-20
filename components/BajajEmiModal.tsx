import React, { useEffect, useRef } from 'react';
import { XMarkIcon, EmiCardIcon } from './IconComponents';

interface BajajEmiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// IMPORTANT: Replace this placeholder with your actual affiliate link.
const AFFILIATE_LINK = "https://www.bajajfinserv.in/insta-emi-card";

export const BajajEmiModal: React.FC<BajajEmiModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const applyButtonRef = useRef<HTMLAnchorElement>(null);

    // Close modal on escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Focus trapping for accessibility
    useEffect(() => {
        if (!isOpen) return;
        
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements?.[0];
        const lastElement = focusableElements?.[focusableElements.length - 1];

        const handleTabKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };
        
        // Focus the primary action button by default
        applyButtonRef.current?.focus();
        
        const currentModalRef = modalRef.current;
        currentModalRef?.addEventListener('keydown', handleTabKeyPress);

        return () => {
            currentModalRef?.removeEventListener('keydown', handleTabKeyPress);
        };
    }, [isOpen]);
    
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bajaj-modal-title"
            aria-describedby="bajaj-modal-description"
        >
            <div
                ref={modalRef}
                className="relative bg-white dark:bg-slate-800 w-full max-w-md m-4 rounded-xl shadow-2xl animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                        <EmiCardIcon className="h-9 w-9 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 id="bajaj-modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Get Your Bajaj EMI Card!
                    </h2>
                    <p id="bajaj-modal-description" className="mt-2 text-gray-600 dark:text-gray-300">
                        Enjoy <strong>No Cost EMI</strong> on our services! Apply for your Bajaj Finserv EMI Network Card through our link and get instant approval.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row-reverse sm:gap-3">
                         <a
                            href={AFFILIATE_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose} // Also close the modal when they click apply
                            ref={applyButtonRef}
                            className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 sm:w-auto"
                        >
                            Apply Now
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-slate-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 sm:mt-0 sm:w-auto"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                    aria-label="Close"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
