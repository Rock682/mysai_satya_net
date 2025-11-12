import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from './IconComponents';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

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
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe'
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
        
        closeButtonRef.current?.focus();
        
        const currentModalRef = modalRef.current;
        currentModalRef?.addEventListener('keydown', handleTabKeyPress);

        return () => {
            currentModalRef?.removeEventListener('keydown', handleTabKeyPress);
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const embedSrc = "https://docs.google.com/forms/d/e/1FAIpQLSeP3aQ-GjXfXXMX_cfs7kOk4UWgzzSKVOJk--UuzHsDs3kEJg/viewform?embedded=true";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="suggestion-modal-title"
        >
            <div
                ref={modalRef}
                className="relative bg-white dark:bg-slate-800 w-full max-w-lg m-4 rounded-xl shadow-2xl animate-scale-up flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 id="suggestion-modal-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Leave a Suggestion
                    </h2>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        aria-label="Close suggestion box"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                {/* Body with iFrame */}
                <div className="bg-white dark:bg-slate-800 rounded-b-xl overflow-hidden">
                    <iframe
                        src={embedSrc}
                        width="100%"
                        height="450"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        title="Suggestion Form"
                    >
                        Loading…
                    </iframe>
                </div>
            </div>
        </div>
    );
};
