import React from 'react';
import { CategoryCard } from './CategoryCard';
import { 
    AcademicCapIcon, 
    BriefcaseIcon, 
    IdentificationIcon, 
    CheckCircleIcon,
    BuildingLibraryIcon
} from './IconComponents';

interface CategoryDashboardProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const getCategoryIcon = (category: string) => {
    const lowerCaseCategory = category.toLowerCase();
    if (lowerCaseCategory.includes('ssc')) return AcademicCapIcon;
    if (lowerCaseCategory.includes('rrb')) return BriefcaseIcon; 
    if (lowerCaseCategory.includes('admit card')) return IdentificationIcon;
    if (lowerCaseCategory.includes('result')) return CheckCircleIcon;
    if (lowerCaseCategory.includes('govt')) return BuildingLibraryIcon;
    return BriefcaseIcon; // Default icon
};

export const CategoryDashboard: React.FC<CategoryDashboardProps> = ({ categories, onSelectCategory }) => {
    if (categories.length === 0) {
        return (
            <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg max-w-4xl mx-auto shadow-sm">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No Open Positions</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">We are not hiring at the moment. Please check back later.</p>
            </div>
        );
    }

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
          Browse by category
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
          Select a category to find your desired job, result, or admit card.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map(category => (
          <CategoryCard
            key={category}
            category={category}
            Icon={getCategoryIcon(category)}
            onSelect={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};

const style = document.createElement('style');
if (!document.getElementById('category-dashboard-styles')) {
    style.id = 'category-dashboard-styles';
    style.textContent = `
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
}