
import React from 'react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from './IconComponents';

export const ContactPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 max-w-4xl mx-auto p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm animate-fade-in-up">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Contact Us</h1>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                    We'd love to hear from you. Reach out to us with any questions or feedback.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {/* Email */}
                <div className="flex flex-col items-center p-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                            <EnvelopeIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Email</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">General Inquiries</p>
                        <a href="mailto:saisatyanet1@gmail.com" className="mt-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors duration-200">
                            saisatyanet1@gmail.com
                        </a>
                    </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col items-center p-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                            <PhoneIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Phone</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Call Us</p>
                        <a href="tel:+918977846407" className="mt-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors duration-200">
                            +91-8977846407
                        </a>
                    </div>
                </div>
                
                {/* WhatsApp */}
                <div className="flex flex-col items-center p-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                            <WhatsAppIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">WhatsApp</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Chat with Us</p>
                        <a href="https://wa.me/918977846407" target="_blank" rel="noopener noreferrer" className="mt-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors duration-200">
                            +91-8977846407
                        </a>
                    </div>
                </div>

                {/* Location */}
                <div className="flex flex-col items-center p-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                            <MapPinIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Location</h3>
                        <address className="mt-1 text-gray-600 dark:text-gray-400 not-italic">
                            Beside Bridge Down, Garividi<br/>
                            Vizianagaram, Andhra Pradesh, 535101
                        </address>
                    </div>
                </div>
            </div>

             <div className="mt-12 text-center border-t border-gray-200 dark:border-slate-700 pt-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Find Us on the Map</h2>
                 <div className="mt-4 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15155.61362799335!2d83.5135146!3d18.2858053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3b9a7c0aaaaaab%3A0x4a45f5a8a9a45f9e!2sGarividi%2C%2C%20Andhra%20Pradesh%20535101!5e0!3m2!1sen!2sin!4v1691500000000" 
                        width="100%" 
                        height="400" 
                        style={{ border: 0 }} 
                        allowFullScreen={true}
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location of Sai Satya Net in Garividi, Vizianagaram"
                        className="dark:grayscale dark:invert"
                    ></iframe>
                </div>
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
