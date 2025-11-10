import React from 'react';
import { 
    IdentificationIcon, 
    AcademicCapIcon, 
    CurrencyDollarIcon, 
    BuildingLibraryIcon, 
    TruckIcon, 
    CheckCircleIcon 
} from './IconComponents';

const serviceCategories = [
    {
        title: "Common Service Center (CSC)",
        icon: IdentificationIcon,
        services: [
            "All types of Job works",
            "UTI Pan Card Services (New & Corrections)",
            "Aadhar & Pan Link",
            "Aadhar Update & Downloading",
            "Voter ID Card Apply, Correction & Downloading",
            "Passport New & Renewal Slot Booking",
            "LLR & Driving Licence Slot Booking",
            "Train / Bus / Flight Tickets Booking",
            "Toll Gates FasTag",
            "Travels & Road Tax",
            "Traffic E-Challan Payment",
            "DTP Telugu Typing",
            "TTD Darshan Tickets & Accommodation",
            "Shiridi Darshanam Tickets & Accommodation",
            "Sabarimala Darshanam Tickets Booking",
            "All Types of PVC Card Printing",
            "All types of Photo Printing & Lamination",
            "Employee Health Cards & Eshram Cards",
            "All Pension Holders Life Certificate",
            "Udyam Registration & Marriage Certificate",
        ]
    },
    {
        title: "Student Services",
        icon: AcademicCapIcon,
        services: [
            "All types of Job works",
            "Student Bus Pass Applications",
            "Color & Black and White Xerox",
            "Spiral Binding",
            "AU, JNTU & Ambedkar Universities Tatkal PC & OD Applications",
            "All types of Fee Payments",
            "Employment Exchange Registration",
        ]
    },
    {
        title: "Digi-Pay Service (AEPS)",
        icon: CurrencyDollarIcon,
        services: [
            "Cash Withdraw from All Banks",
            "Money Transfer Services",
            "Account Balance Enquiry",
        ]
    },
    {
        title: "EPF Services",
        icon: BuildingLibraryIcon,
        services: [
            "UAN Number Allotment & Activation",
            "PF Balance Enquiry",
            "PF Withdraw (Form 31/19/10c & 10D)",
            "EPF E-Nomination",
            "Previous to Present Account Transfer",
            "Bank Book & PAN KYC Update",
            "Joint Declaration Form Submission",
        ]
    },
    {
        title: "APSRTC Logistics",
        icon: TruckIcon,
        services: [
            "Parcel & Courier Services",
        ]
    }
];

const ServiceCard: React.FC<{ category: typeof serviceCategories[0] }> = ({ category }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
        <div className="flex items-center mb-4">
            <category.icon className="h-8 w-8 text-green-600 mr-4 flex-shrink-0" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{category.title}</h2>
        </div>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300 flex-grow">
            {category.services.map((service, index) => (
                <li key={index} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{service}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ServicesPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">Our Services</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                    A comprehensive suite of services to meet all your needs under one roof.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceCategories.map(category => (
                    <ServiceCard key={category.title} category={category} />
                ))}
            </div>
        </div>
    );
};

// Add keyframes for animation
const style = document.createElement('style');
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

export default ServicesPage;
