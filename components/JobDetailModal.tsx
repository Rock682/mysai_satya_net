
import React, { useEffect, useRef } from 'react';
import { Job } from '../types';
import { CalendarDaysIcon, XMarkIcon, MapPinIcon, BriefcaseIcon } from './IconComponents';
import { formatDate } from '../utils/date';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

/**
 * Parses a string for simple inline markdown: **bold**, *italic*, and [links](url).
 */
const renderInlineMarkdown = (text: string) => {
  // Regex to split by **bold**, *italic*, or [link](url)
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <a href={linkMatch[2]} key={index} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
};

/**
 * Renders a block of text, formatting it with lists and bold headers.
 */
const renderJobDescription = (text: string | undefined) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            const ListComponent = listType === 'ul' ? 'ul' : 'ol';
            const listClasses = listType === 'ul' ? 'list-disc' : 'list-decimal';
            elements.push(
                <ListComponent key={`list-${elements.length}`} className={`${listClasses} list-inside space-y-1 my-2 pl-4`}>
                    {listItems}
                </ListComponent>
            );
            listItems = [];
        }
        listType = null;
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine === '') {
            // Treat blank lines as paragraph breaks
            flushList();
            return;
        }

        const isUnorderedListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
        const isOrderedListItem = /^\d+\.\s/.test(trimmedLine);

        if (isUnorderedListItem) {
            if (listType !== 'ul') flushList();
            listType = 'ul';
            listItems.push(<li key={index}>{renderInlineMarkdown(trimmedLine.substring(2))}</li>);
        } else if (isOrderedListItem) {
            if (listType !== 'ol') flushList();
            listType = 'ol';
            listItems.push(<li key={index}>{renderInlineMarkdown(trimmedLine.replace(/^\d+\.\s/, ''))}</li>);
        } else {
            flushList();
            if (trimmedLine.endsWith(':') && trimmedLine.length < 100) { // Check length to avoid formatting long paragraphs
                elements.push(<p key={index} className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-1">{renderInlineMarkdown(trimmedLine)}</p>);
            } else {
                elements.push(<p key={index}>{renderInlineMarkdown(trimmedLine)}</p>);
            }
        }
    });

    flushList(); // Flush any remaining list items at the end

    return elements;
};


/**
 * Renders a block of text with simple markdown support for headings and lists.
 */
const renderMarkdown = (text: string) => {
    const blocks = text.split(/(\n\s*\n)/); // Split by blank lines
    
    const elements = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
            listItems = [];
        }
    };

    blocks.forEach((block, index) => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return;

        // Check for list items
        if (trimmedBlock.split('\n').every(line => line.trim().startsWith('*') || line.trim().startsWith('-'))) {
            flushList(); // Flush previous list if any
            const items = trimmedBlock.split('\n').map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineMarkdown(line.trim().substring(1).trim())}</li>
            ));
            elements.push(<ul key={`ul-${index}`}>{items}</ul>);
        } else {
            flushList(); // End any list before processing other blocks
            if (trimmedBlock.startsWith('# ')) {
                elements.push(<h2 key={index}>{renderInlineMarkdown(trimmedBlock.substring(2))}</h2>);
            } else if (trimmedBlock.startsWith('## ')) {
                elements.push(<h3 key={index}>{renderInlineMarkdown(trimmedBlock.substring(3))}</h3>);
            } else {
                elements.push(<p key={index}>{renderInlineMarkdown(trimmedBlock)}</p>);
            }
        }
    });

    flushList(); // Flush any remaining list items
    return elements;
};


export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const formattedStartDate = formatDate(job.startDate);
    const formattedLastDate = formatDate(job.lastDate);
    const showStartDate = formattedStartDate !== 'N/A';
    const showLastDate = formattedLastDate !== 'N/A';
    
    const categoryLower = job.category?.toLowerCase() || '';
    const shouldShowDatesSection = (showStartDate || showLastDate) && categoryLower !== 'halltickets' && categoryLower !== 'results';


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
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
        
        firstElement?.focus();
        modalRef.current?.addEventListener('keydown', handleTabKeyPress);

        return () => {
            modalRef.current?.removeEventListener('keydown', handleTabKeyPress);
        };
    }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-slate-800 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl flex flex-col m-0 sm:m-4 rounded-none sm:rounded-xl shadow-2xl animate-slide-up sm:animate-scale-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-slate-700 rounded-t-none sm:rounded-t-xl bg-gray-50 dark:bg-slate-900/70">
          <div className="flex-1 space-y-2">
            <h2 id="job-title" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {job.sourceSheetLink ? (
                    <a 
                        href={job.sourceSheetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                        {job.jobTitle}
                    </a>
                ) : (
                    job.jobTitle
                )}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                {job.location && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{job.location}</span>
                  </div>
                )}
                 {job.employmentType && (
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                     <span className="font-medium text-gray-700 dark:text-gray-300">{job.employmentType}</span>
                  </div>
                )}
            </div>
            {shouldShowDatesSection && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 pt-1">
                  {showStartDate && (
                      <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4 text-teal-500" />
                          <span>Start: <span className="font-semibold text-gray-700 dark:text-gray-300">{formattedStartDate}</span></span>
                      </div>
                  )}
                  {showLastDate && (
                      <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4 text-rose-500" />
                          <span>End: <span className="font-semibold text-gray-700 dark:text-gray-300">{formattedLastDate}</span></span>
                      </div>
                  )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 ml-auto bg-transparent rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b dark:border-slate-700 pb-2">Description</h3>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                {renderJobDescription(job.description)}
            </div>
          </div>

          {job.responsibilities && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b dark:border-slate-700 pb-2">Responsibilities</h3>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                {renderJobDescription(job.responsibilities)}
              </div>
            </div>
          )}

          {job.blogContent && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b dark:border-slate-700 pb-2">A Deeper Dive</h3>
              <div className="prose-custom text-gray-700 dark:text-gray-300">
                  {renderMarkdown(job.blogContent)}
              </div>
            </div>
          )}

          {job.requiredDocuments && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b dark:border-slate-700 pb-2">Required Documents</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 pl-2">
                {job.requiredDocuments
                  .split(/[\n,]+/)
                  .map(doc => doc.trim())
                  .filter(Boolean)
                  .map((doc, index) => (
                    <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {job.salary && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b dark:border-slate-700 pb-2">Salary</h3>
              <p className="text-gray-600 dark:text-gray-300">{job.salary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add keyframes to index.css or a style tag if not using a CSS file
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-up {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes slide-up {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .prose-custom h2, .prose-custom h3 {
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    line-height: 1.2;
  }
  .prose-custom h2 { font-size: 1.25em; }
  .prose-custom h3 { font-size: 1.1em; }
  .prose-custom p {
    margin-bottom: 1em;
    line-height: 1.6;
  }
  .prose-custom ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .prose-custom ul li {
    margin-bottom: 0.35em;
  }
  .prose-custom a {
    color: #16a34a; /* green-600 */
    text-decoration: none;
    font-weight: 500;
  }
  .prose-custom a:hover {
    text-decoration: underline;
  }
  .dark .prose-custom a {
    color: #4ade80; /* green-400 */
  }
`;
document.head.appendChild(style);