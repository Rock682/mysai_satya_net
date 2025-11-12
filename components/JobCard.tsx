
import React from 'react';
import { Job } from '../types';
import { CalendarDaysIcon, BriefcaseIcon, ArrowDownTrayIcon } from './IconComponents';
import { formatDate } from '../utils/date';


interface JobCardProps {
  job: Job;
  onClick: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const handleTitleClick = (e: React.MouseEvent) => {
    // If there is a link, let the default anchor tag behavior happen.
    // If not, trigger the modal opening.
    if (job.sourceSheetLink) {
        e.stopPropagation(); // Prevent modal from opening if it's a link
    }
  };
  
  const formattedStartDate = formatDate(job.startDate);
  const formattedLastDate = formatDate(job.lastDate);
  const showStartDate = formattedStartDate !== 'N/A';
  const showLastDate = formattedLastDate !== 'N/A';
  
  const categoryLower = job.category?.toLowerCase() || '';
  const shouldShowDatesSection = (showStartDate || showLastDate) && !['halltickets', 'results', 'counselling'].includes(categoryLower);
    
  return (
    <article 
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:border-green-400 dark:hover:border-green-500 hover:-translate-y-1 overflow-hidden cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
      aria-label={`View details for ${job.jobTitle}`}
    >
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 bg-green-50 dark:bg-green-900/20 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500 ease-in-out"></div>
      
      <div className="relative flex-grow z-10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
           {job.sourceSheetLink ? (
            <a 
              href={job.sourceSheetLink}
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={handleTitleClick}
              className="focus:outline-none focus:ring-2 focus:ring-green-400 rounded-sm"
            >
              {job.jobTitle}
            </a>
          ) : (
            job.jobTitle
          )}
        </h3>
        
        {job.blogContent && (
          <div className="relative mt-1 z-10">
            <span className="text-sm font-semibold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
              Read More &rarr;
            </span>
          </div>
        )}
      </div>

       <div className="relative mt-2 space-y-1 z-10 text-sm">
        {job.employmentType && (
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <BriefcaseIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
            <span className="inline-block bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{job.employmentType}</span>
          </div>
        )}
      </div>
      
      {shouldShowDatesSection && (
        <div className="relative mt-2 pt-2 border-t border-gray-200 dark:border-slate-700 z-10">
          <div className="grid grid-cols-2 gap-2">
            {/* Start Date Block */}
            {showStartDate ? (
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400">Start Date</span>
                <div className="inline-flex items-center text-xs space-x-1.5 bg-teal-50 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 font-medium py-0.5 px-2 rounded-full" title={`Start Date: ${formattedStartDate}`}>
                    <CalendarDaysIcon className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span className="font-semibold">{formattedStartDate}</span>
                </div>
              </div>
            ) : <div />}
            {/* End Date Block */}
            {showLastDate ? (
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400">Last Date</span>
                 <div className="inline-flex items-center text-xs space-x-1.5 bg-rose-50 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-medium py-0.5 px-2 rounded-full" title={`Last Date: ${formattedLastDate}`}>
                    <CalendarDaysIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="font-semibold">{formattedLastDate}</span>
                </div>
              </div>
            ) : <div />}
          </div>
        </div>
      )}

      {job.syllabusLink && (
        <div className="relative mt-3 pt-3 border-t border-gray-200 dark:border-slate-700 z-10">
          <a
            href={job.syllabusLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-semibold text-center text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Download Syllabus
          </a>
        </div>
      )}
    </article>
  );
};
