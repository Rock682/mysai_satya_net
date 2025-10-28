
import React, { useState, useMemo } from 'react';
import { CalculatorIcon, CalendarDaysIcon, AlertTriangleIcon, PercentIcon, ArrowLeftIcon } from './IconComponents';

// --- Age Calculator Logic ---

/**
 * Determines the zodiac sign based on a given date.
 * @param date The date of birth.
 * @returns An object containing the zodiac sign name and its emoji.
 */
const getZodiacSign = (date: Date): { sign: string; emoji: string } => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is 0-indexed

    if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return { sign: "Aries", emoji: "♈" };
    if ((month === 4 && day >= 21) || (month === 5 && day <= 21)) return { sign: "Taurus", emoji: "♉" };
    if ((month === 5 && day >= 22) || (month === 6 && day <= 21)) return { sign: "Gemini", emoji: "♊" };
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return { sign: "Cancer", emoji: "♋" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 23)) return { sign: "Leo", emoji: "♌" };
    if ((month === 8 && day >= 24) || (month === 9 && day <= 22)) return { sign: "Virgo", emoji: "♍" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return { sign: "Libra", emoji: "♎" };
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return { sign: "Scorpio", emoji: "♏" };
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return { sign: "Sagittarius", emoji: "♐" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return { sign: "Capricorn", emoji: "♑" };
    if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) return { sign: "Aquarius", emoji: "♒" };
    if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) return { sign: "Pisces", emoji: "♓" };

    return { sign: "", emoji: "" }; // Fallback
};

const AgeCalculator: React.FC = () => {
    const today = new Date();
    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [asOfDay, setAsOfDay] = useState<string>(String(today.getDate()));
    const [asOfMonth, setAsOfMonth] = useState<string>(String(today.getMonth() + 1));
    const [asOfYear, setAsOfYear] = useState<string>(String(today.getFullYear()));
    const [result, setResult] = useState<AgeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    interface AgeResult {
        years: number;
        months: number;
        days: number;
        totalWeeks: number;
        totalDays: number;
        totalHours: number;
        totalMinutes: number;
        zodiacSign: { sign: string; emoji: string };
        asOfDateString: string;
    }

    const calculateAge = () => {
        // 1. Validate and parse Date of Birth
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (!day || !month || !year || isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
            setError('Please enter a valid date of birth.');
            setResult(null);
            return;
        }
        if (yearNum < 1900 || yearNum > 9999) {
            setError('Please enter a valid birth year.');
            setResult(null);
            return;
        }
        if (monthNum < 1 || monthNum > 12) {
            setError('Please enter a valid birth month (1-12).');
            setResult(null);
            return;
        }
        const daysInBirthMonth = new Date(yearNum, monthNum, 0).getDate();
        if (dayNum < 1 || dayNum > daysInBirthMonth) {
            setError(`Please enter a valid day for the selected birth month (1-${daysInBirthMonth}).`);
            setResult(null);
            return;
        }
        const birthDate = new Date(yearNum, monthNum - 1, dayNum);
        birthDate.setHours(0, 0, 0, 0);

        // 2. Validate and parse "As of" date
        const asOfDayNum = parseInt(asOfDay, 10);
        const asOfMonthNum = parseInt(asOfMonth, 10);
        const asOfYearNum = parseInt(asOfYear, 10);

        if (!asOfDay || !asOfMonth || !asOfYear || isNaN(asOfDayNum) || isNaN(asOfMonthNum) || isNaN(asOfYearNum)) {
            setError('Please enter a valid "as of" date.');
            setResult(null);
            return;
        }
        if (asOfYearNum < 1900 || asOfYearNum > 9999) {
            setError('Please enter a valid "as of" year.');
            setResult(null);
            return;
        }
        if (asOfMonthNum < 1 || asOfMonthNum > 12) {
            setError('Please enter a valid "as of" month (1-12).');
            setResult(null);
            return;
        }
        const daysInAsOfMonth = new Date(asOfYearNum, asOfMonthNum, 0).getDate();
        if (asOfDayNum < 1 || asOfDayNum > daysInAsOfMonth) {
            setError(`Please enter a valid day for the selected "as of" month (1-${daysInAsOfMonth}).`);
            setResult(null);
            return;
        }
        const toDate = new Date(asOfYearNum, asOfMonthNum - 1, asOfDayNum);
        toDate.setHours(0, 0, 0, 0);

        // 3. Final validation
        if (birthDate > toDate) {
            setError('The "as of" date must be after the date of birth.');
            setResult(null);
            return;
        }
        
        setError(null);
        
        // 4. Calculation logic
        let years = toDate.getFullYear() - birthDate.getFullYear();
        let months = toDate.getMonth() - birthDate.getMonth();
        let days = toDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }
        
        const totalDays = Math.floor((toDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const zodiac = getZodiacSign(birthDate);

        const asOfDateFormatted = toDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        setResult({ years, months, days, totalWeeks, totalDays, totalHours, totalMinutes, zodiacSign: zodiac, asOfDateString: asOfDateFormatted });
    };

    const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<string>>, maxLength: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= maxLength) {
            setter(value);
        }
    };

    const setToToday = () => {
        const today = new Date();
        setAsOfDay(String(today.getDate()));
        setAsOfMonth(String(today.getMonth() + 1));
        setAsOfYear(String(today.getFullYear()));
    };

    return (
        <div>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Enter your date of birth and specify the date you want to calculate your age for. Perfect for job applications with age cut-offs.
            </p>
            <div className="space-y-4" id="age-calculator-input">
                <div>
                    <label htmlFor="dob-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Enter your Date of Birth
                    </label>
                    <div className="flex items-center space-x-2">
                         <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            id="dob-day"
                            name="dob-day"
                            value={day}
                            onChange={handleNumericInput(setDay, 2)}
                            placeholder="DD"
                            className="block w-full h-10 text-center px-2 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                            aria-label="Day"
                        />
                        <span className="text-gray-500 dark:text-gray-400 font-semibold text-lg">/</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            id="dob-month"
                            name="dob-month"
                            value={month}
                            onChange={handleNumericInput(setMonth, 2)}
                            placeholder="MM"
                            className="block w-full h-10 text-center px-2 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                            aria-label="Month"
                        />
                        <span className="text-gray-500 dark:text-gray-400 font-semibold text-lg">/</span>
                         <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            id="dob-year"
                            name="dob-year"
                            value={year}
                            onChange={handleNumericInput(setYear, 4)}
                            placeholder="YYYY"
                            className="block w-full h-10 text-center px-2 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                            aria-label="Year"
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="asof-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Calculate Age as of
                        </label>
                        <button
                            onClick={setToToday}
                            className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                        >
                            Use Today
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            id="asof-day"
                            name="asof-day"
                            value={asOfDay}
                            onChange={handleNumericInput(setAsOfDay, 2)}
                            placeholder="DD"
                            className="block w-full h-10 text-center px-2 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                            aria-label="As of Day"
                        />
                        <span className="text-gray-500 dark:text-gray-400 font-semibold text-lg">/</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            id="asof-month"
                            name="asof-month"
                            value={asOfMonth}
                            onChange={handleNumericInput(setAsOfMonth, 2)}
                            placeholder="MM"
                            className="block w-full h-10 text-center px-2 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                            aria-label="As of Month"
                        />
                        <span className="text-gray-500 dark:text-gray-400 font-semibold text-lg">/</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            id="asof-year"
                            name="asof-year"
                            value={asOfYear}
                            onChange={handleNumericInput(setAsOfYear, 4)}
                            placeholder="YYYY"
                            className="block w-full h-10 text-center px-2 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                            aria-label="As of Year"
                        />
                    </div>
                </div>
                <button
                    id="age-calculator-button"
                    onClick={calculateAge}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    Calculate Age
                </button>
            </div>

            {error && (
                 <div className="mt-6 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                    <div className="flex">
                        <div className="py-1"><AlertTriangleIcon className="h-5 w-5 text-red-400 mr-3" /></div>
                        <div>
                            <p className="font-bold text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div id="age-calculator-result" className="mt-8 border-t border-gray-200 dark:border-slate-700 pt-6 animate-fade-in-up" aria-live="polite">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">Your Age as of {result.asOfDateString}</h3>
                    <div className="mt-4 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-center text-gray-800 dark:text-gray-100">
                           <span className="text-4xl font-bold text-green-600 dark:text-green-400">{result.years}</span> years, 
                           <span className="text-2xl font-bold text-green-600 dark:text-green-400"> {result.months}</span> months, and
                           <span className="text-2xl font-bold text-green-600 dark:text-green-400"> {result.days}</span> days
                        </p>
                        {result.zodiacSign.sign && (
                            <p className="text-center text-gray-600 dark:text-gray-300 mt-3 text-lg">
                                Your Zodiac Sign is <span className="font-bold text-green-700 dark:text-green-300">{result.zodiacSign.sign} {result.zodiacSign.emoji}</span>
                            </p>
                        )}
                    </div>
                     <div className="mt-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fun Facts</h4>
                         <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg"><div className="font-bold text-gray-800 dark:text-gray-100">{result.totalWeeks.toLocaleString()}</div><div className="text-gray-600 dark:text-gray-400">Total Weeks</div></div>
                            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg"><div className="font-bold text-gray-800 dark:text-gray-100">{result.totalDays.toLocaleString()}</div><div className="text-gray-600 dark:text-gray-400">Total Days</div></div>
                            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg"><div className="font-bold text-gray-800 dark:text-gray-100">{result.totalHours.toLocaleString()}</div><div className="text-gray-600 dark:text-gray-400">Total Hours</div></div>
                            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg"><div className="font-bold text-gray-800 dark:text-gray-100">{result.totalMinutes.toLocaleString()}</div><div className="text-gray-600 dark:text-gray-400">Total Minutes</div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Percentage Calculator Logic ---
const PercentageCalculator: React.FC = () => {
    const [val1, setVal1] = useState('');
    const [val2, setVal2] = useState('');
    const [val3, setVal3] = useState('');
    const [val4, setVal4] = useState('');
    const [val5, setVal5] = useState('');
    const [val6, setVal6] = useState('');

    const result1 = useMemo(() => {
        const num1 = parseFloat(val1);
        const num2 = parseFloat(val2);
        if (isNaN(num1) || isNaN(num2)) return null;
        return (num1 / 100) * num2;
    }, [val1, val2]);

    const result2 = useMemo(() => {
        const num3 = parseFloat(val3);
        const num4 = parseFloat(val4);
        if (isNaN(num3) || isNaN(num4) || num4 === 0) return null;
        return (num3 / num4) * 100;
    }, [val3, val4]);

    const result3 = useMemo(() => {
        const num5 = parseFloat(val5);
        const num6 = parseFloat(val6);
        if (isNaN(num5) || isNaN(num6) || num5 === 0) return null;
        return ((num6 - num5) / num5) * 100;
    }, [val5, val6]);
    
    const inputClasses = "w-full h-10 text-center border border-gray-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm";

    return (
        <div className="space-y-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
                This tool provides three convenient calculators to handle common percentage problems.
            </p>
            {/* Calculator 1: What is X% of Y */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <h3 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-3">Find Percentage of a Number</h3>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span>What is</span>
                    <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className={inputClasses} placeholder="X" aria-label="Percentage value"/>
                    <span>% of</span>
                    <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className={inputClasses} placeholder="Y" aria-label="Total value" />
                    <span>?</span>
                </div>
                {result1 !== null && <div className="mt-3 text-center text-xl font-bold text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/30 rounded-md" aria-live="polite">Result: {result1.toLocaleString()}</div>}
            </div>
            
            {/* Calculator 2: X is what % of Y */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <h3 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-3">Calculate Your Percentage (e.g., Marks)</h3>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <input type="number" value={val3} onChange={e => setVal3(e.target.value)} className={inputClasses} placeholder="Obtained Marks" aria-label="Obtained Marks"/>
                    <span>out of</span>
                    <input type="number" value={val4} onChange={e => setVal4(e.target.value)} className={inputClasses} placeholder="Total Marks" aria-label="Total Marks" />
                </div>
                {result2 !== null && <div className="mt-3 text-center text-xl font-bold text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/30 rounded-md" aria-live="polite">Percentage: {result2.toLocaleString()}%</div>}
            </div>

            {/* Calculator 3: Percentage Change */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <h3 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-3">Percentage Increase / Decrease</h3>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span>From</span>
                    <input type="number" value={val5} onChange={e => setVal5(e.target.value)} className={inputClasses} placeholder="Initial Value" aria-label="Initial Value" />
                    <span>to</span>
                    <input type="number" value={val6} onChange={e => setVal6(e.target.value)} className={inputClasses} placeholder="Final Value" aria-label="Final Value" />
                </div>
                {result3 !== null && 
                    <div className={`mt-3 text-center text-xl font-bold p-2 rounded-md ${result3 >= 0 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'}`} aria-live="polite">
                        {result3 >= 0 ? 'Increase: ' : 'Decrease: '} {Math.abs(result3).toLocaleString()}%
                    </div>
                }
            </div>
        </div>
    );
};

const CalculatorSelectionCard: React.FC<{
    title: string;
    description: string;
    Icon: React.FC<any>;
    onClick: () => void;
}> = ({ title, description, Icon, onClick }) => (
    <div
        onClick={onClick}
        className="group bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm h-full cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-green-400 dark:hover:border-green-500 hover:-translate-y-1"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
        <div className="flex items-center mb-4">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-900 transition-colors">
                <Icon className="h-7 w-7" />
            </div>
            <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{title}</h2>
            </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
        <div className="mt-4 text-sm font-semibold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
            Open Calculator &rarr;
        </div>
    </div>
);


// --- Main Page Component ---
export const CalculatorsPage: React.FC = () => {
    const [activeCalculator, setActiveCalculator] = useState<'age' | 'percentage' | null>(null);

    const calculators = {
        age: {
            Component: AgeCalculator,
            title: 'Age Calculator',
            description: 'Find your exact age in years, months, and days.',
            Icon: CalendarDaysIcon,
        },
        percentage: {
            Component: PercentageCalculator,
            title: 'Percentage Calculator',
            description: 'Quickly solve any percentage calculation.',
            Icon: PercentIcon,
        }
    };

    if (activeCalculator) {
        const { Component, title, description, Icon } = calculators[activeCalculator];

        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <button
                    onClick={() => setActiveCalculator(null)}
                    className="mb-4 flex items-center px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    aria-label="Back to calculator selection"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    All Calculators
                </button>
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-md">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                           <Icon className="h-7 w-7" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
                        </div>
                    </div>
                    <Component />
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="text-center mb-12">
                <CalculatorIcon className="mx-auto h-12 w-12 text-green-600" />
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl mt-4">Calculators</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                    Select a tool to get started with your calculations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <CalculatorSelectionCard
                    title={calculators.age.title}
                    description={calculators.age.description}
                    Icon={calculators.age.Icon}
                    onClick={() => setActiveCalculator('age')}
                />
                <CalculatorSelectionCard
                    title={calculators.percentage.title}
                    description={calculators.percentage.description}
                    Icon={calculators.percentage.Icon}
                    onClick={() => setActiveCalculator('percentage')}
                />
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
  .dark input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;
document.head.appendChild(style);
