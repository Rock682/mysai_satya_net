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
  onSelectCategory: (category: string) => void;
}

const getCategoryIcon = (category: string) => {
    const lowerCaseCategory = category.toLowerCase();
    if (lowerCaseCategory.includes('ssc')) return AcademicCapIcon;
    if (lowerCaseCategory.includes('rrb')) return BriefcaseIcon; 
    if (lowerCaseCategory.includes('ibps')) return BuildingLibraryIcon;
    if (lowerCaseCategory.includes('admission')) return AcademicCapIcon;
    if (lowerCaseCategory.includes('counselling')) return AcademicCapIcon;
    if (lowerCaseCategory.includes('hallticket')) return IdentificationIcon;
    if (lowerCaseCategory.includes('result')) return CheckCircleIcon;
    if (lowerCaseCategory.includes('govt')) return BuildingLibraryIcon;
    return BriefcaseIcon; // Default icon
};

const mainCategories = [
    'SSC',
    'RRB',
    'IBPS',
    'ADMISSION',
    'RESULTS',
    'HALLTICKETS',
    'STATE GOVT JOBS',
    'COUNSELLING'
];

export const CategoryDashboard: React.FC<CategoryDashboardProps> = ({ onSelectCategory }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100" id="browse-by-category-title">
          Browse by Category
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Select a category to find your desired job, result, or admit card.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {mainCategories.map(category => (
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