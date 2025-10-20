
import React, { useState, useEffect } from 'react';
import { ExcelIcon, CalculatorIcon, AcademicCapIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from './IconComponents';

type Page = 'home' | 'contact' | 'calculators' | 'services' | 'gift-articles' | 'mock-tests' | 'about';
type Theme = 'light' | 'dark' | 'system';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const navLinks: { page: Page; label: string; Icon?: React.FC<React.SVGProps<SVGSVGElement>>; iconClassName?: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'mock-tests', label: 'Mock Tests', Icon: AcademicCapIcon, iconClassName: 'h-5 w-5' },
    { page: 'calculators', label: 'Calculators', Icon: CalculatorIcon, iconClassName: 'h-4 w-4' },
    { page: 'gift-articles', label: 'Gift Articles' },
    { page: 'services', label: 'Services' },
    { page: 'about', label: 'About Us' },
    { page: 'contact', label: 'Contact' },
];

const ThemeSwitcher: React.FC<{ theme: Theme, setTheme: (theme: Theme) => void, className?: string }> = ({ theme, setTheme, className }) => {
    const handleThemeChange = () => {
        const themes: Theme[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
    };

    const icons: Record<Theme, React.ReactNode> = {
        light: <SunIcon className="w-5 h-5" />,
        dark: <MoonIcon className="w-5 h-5" />,
        system: <ComputerDesktopIcon className="w-5 h-5" />,
    };

    const labels: Record<Theme, string> = {
        light: 'Switch to Dark Mode',
        dark: 'Switch to System Mode',
        system: 'Switch to Light Mode',
    };

    return (
        <button
            onClick={handleThemeChange}
            className={`p-2 rounded-md transition-colors ${className}`}
            aria-label={labels[theme]}
            title={labels[theme]}
        >
            {icons[theme]}
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, theme, setTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };
    
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);
    
    useEffect(() => {
        const styleId = 'header-animations';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
          }
        `;
        document.head.appendChild(style);
    }, []);

    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2";
    const activeLinkClasses = "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300";
    const inactiveLinkClasses = "text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100";
    const themeButtonClasses = "text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100";

    return (
        <header id="app-header" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-20">
            <div className="container mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => handleNavigate('home')}
                        className="flex items-center space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md p-1 -m-1 transition-opacity hover:opacity-80"
                        aria-label="Sai Satya Net, go to homepage"
                    >
                        <ExcelIcon className="h-8 w-8 text-green-700 flex-shrink-0" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-400 tracking-tight">
                                Sai Satya Net
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                                Your One stop solution for internet services & customized Gift Articles.
                            </p>
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center space-x-1 lg:space-x-2" aria-label="Main navigation">
                        {navLinks.map(({ page, label, Icon, iconClassName }) => (
                            <button
                                key={page}
                                onClick={() => handleNavigate(page)}
                                className={`${navLinkClasses} ${currentPage === page ? activeLinkClasses : inactiveLinkClasses}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {Icon && <Icon className={iconClassName} />}
                                <span className={Icon ? "hidden lg:inline" : ""}>{label}</span>
                            </button>
                        ))}
                        <ThemeSwitcher theme={theme} setTheme={setTheme} className={themeButtonClasses} />
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden flex items-center space-x-2">
                         <ThemeSwitcher theme={theme} setTheme={setTheme} className={themeButtonClasses} />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div id="mobile-menu" className="sm:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 shadow-lg border-t border-gray-200 dark:border-slate-700 animate-fade-in-down">
                    <nav className="flex flex-col p-4 space-y-2" aria-label="Main mobile navigation">
                        {navLinks.map(({ page, label, Icon, iconClassName }) => (
                            <button
                                key={page}
                                onClick={() => handleNavigate(page)}
                                className={`${navLinkClasses} ${currentPage === page ? activeLinkClasses : inactiveLinkClasses} justify-start text-base`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {Icon && <Icon className={iconClassName} />}
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};
