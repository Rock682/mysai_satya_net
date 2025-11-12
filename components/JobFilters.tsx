import React, { useState, useRef, useEffect, useId } from 'react';
import { SearchIcon, ChevronDownIcon, Squares2x2Icon, XMarkIcon, ChevronUpIcon } from './IconComponents';

interface JobFiltersProps {
  textFilter: string;
  onTextFilterChange: (value: string) => void;
  categoryFilter: string[];
  onCategoryFilterChange: (values: string[]) => void;
  categories: string[];
  showCategoryFilter?: boolean;
}

const MultiSelectDropdown: React.FC<{
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}> = ({ options, selected, onChange, placeholder, Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const componentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const listboxId = useId();
    const buttonId = useId();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0) handleSelect(options[focusedIndex]);
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                buttonRef.current?.focus();
                break;
            case 'Tab':
                setIsOpen(false);
                break;
        }
    };

    useEffect(() => {
        if (isOpen && focusedIndex >= 0) {
            listRef.current?.children[focusedIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [isOpen, focusedIndex]);

    const handleButtonClick = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen) {
            const firstSelected = options.findIndex(opt => selected.includes(opt));
            setFocusedIndex(firstSelected !== -1 ? firstSelected : 0);
        }
    };
    
    useEffect(() => {
        if (isOpen) listRef.current?.focus();
    }, [isOpen]);

    return (
        <div className="relative w-full" ref={componentRef} onKeyDown={handleKeyDown}>
            <button
                ref={buttonRef}
                id={buttonId}
                onClick={handleButtonClick}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                className="flex items-center justify-between w-full h-9 pl-3 pr-2 text-left bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
                <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 dark:text-gray-400 mr-2" aria-hidden="true" />
                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                        {selected.length > 0 ? `${placeholder} (${selected.length})` : placeholder}
                    </span>
                </div>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {isOpen && (
                <ul
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    aria-multiselectable="true"
                    tabIndex={-1}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
                >
                    {options.map((option, index) => {
                        const isSelected = selected.includes(option);
                        const isFocused = focusedIndex === index;
                        return (
                            <li
                                key={option}
                                id={`${listboxId}-option-${index}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setFocusedIndex(index)}
                                className={`flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer ${ isFocused ? 'bg-gray-100 dark:bg-slate-600' : '' }`}
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 border-gray-300 dark:border-slate-500 rounded focus:ring-green-500 pointer-events-none"
                                    checked={isSelected}
                                    readOnly
                                    tabIndex={-1}
                                />
                                <span className="ml-3">{option}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};


export const JobFilters: React.FC<JobFiltersProps> = ({
  textFilter,
  onTextFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  showCategoryFilter = true,
}) => {
  const searchInputId = useId();
  const [internalText, setInternalText] = useState(textFilter);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync internal state if the parent filter state changes (e.g., from "Clear")
  useEffect(() => {
    setInternalText(textFilter);
  }, [textFilter]);
  
  const handleSearch = () => {
    onTextFilterChange(internalText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalText(value);
    // If user clears the input, immediately clear results without waiting for button click
    if (value === '') {
      onTextFilterChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if it's inside a form
      handleSearch();
    }
  };

  const activeFilterCount = categoryFilter.length + (textFilter ? 1 : 0);

  const handleClearFilters = () => {
    onTextFilterChange('');
    onCategoryFilterChange([]);
  };

  return (
    <div className="sticky md:static top-14 sm:top-16 md:top-auto z-10 mb-4 p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
      {!isExpanded ? (
        // --- Minimized View ---
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center text-sm font-medium text-gray-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            aria-label="Show search and filter options"
            aria-expanded="false"
          >
            <SearchIcon className="h-5 w-5 mr-2" />
            <span>Search & Filter</span>
          </button>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full" aria-live="polite">
                {activeFilterCount} {activeFilterCount > 1 ? 'filters' : 'filter'} active
              </span>
              <button
                onClick={handleClearFilters}
                className="flex-shrink-0 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Clear all filters"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      ) : (
        // --- Expanded View ---
        <div className="flex flex-col md:flex-row md:items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-grow">
              <label htmlFor={searchInputId} className="sr-only">
                Search by title or description
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={searchInputId}
                type="text"
                placeholder="Search by title or description..."
                value={internalText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="block w-full h-9 pl-10 pr-20 py-2 border border-gray-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <button
                    onClick={handleSearch}
                    className="inline-flex items-center justify-center h-7 px-3 text-xs font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    aria-label="Search jobs"
                >
                    Search
                </button>
              </div>
            </div>

            {/* Category Multiselect */}
            {showCategoryFilter && (
                <div className="md:w-56 flex-shrink-0">
                    <MultiSelectDropdown
                        options={categories}
                        selected={categoryFilter}
                        onChange={onCategoryFilterChange}
                        placeholder="Category"
                        Icon={Squares2x2Icon}
                    />
                </div>
            )}

            {/* Action Buttons */}
             <div className="flex items-center gap-2 flex-shrink-0">
                {activeFilterCount > 0 && (
                    <button
                        onClick={handleClearFilters}
                        className="h-9 flex items-center justify-center px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        aria-label="Clear all filters"
                    >
                        <XMarkIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                        Clear
                    </button>
                )}
                 <button
                    onClick={() => setIsExpanded(false)}
                    className="h-9 w-9 flex items-center justify-center px-2 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                    aria-label="Hide filters"
                >
                    <ChevronUpIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};