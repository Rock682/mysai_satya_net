import React from 'react';
import { EnvelopeIcon, PhoneIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from './IconComponents';

interface FooterProps {
    onSuggestionClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSuggestionClick }) => {
    return (
        <footer id="app-footer" className="bg-gray-800 dark:bg-slate-900 text-gray-300">
            <div className="container mx-auto px-4 py-8 sm:py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold text-white tracking-wider">Sai Satya Net</h3>
                        <p className="mt-2 text-sm text-gray-400">
                            Your one-stop solution for internet services & customized gift articles. Find your next career opportunity with us.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-wider">Contact Us</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            <li className="flex items-center">
                                <EnvelopeIcon className="w-5 h-5 mr-3 text-green-400"/>
                                <a href="mailto:saisatyanet1@gmail.com" className="hover:text-white transition-colors">saisatyanet1@gmail.com</a>
                            </li>
                            <li className="flex items-center">
                                <PhoneIcon className="w-5 h-5 mr-3 text-green-400"/>
                                <a href="tel:+918977846407" className="hover:text-white transition-colors">+91-8977846407</a>
                            </li>
                            <li className="flex items-center">
                                <WhatsAppIcon className="w-5 h-5 mr-3 text-green-400"/>
                                <a href="https://wa.me/918977846407" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Chat on WhatsApp</a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-wider">Follow Us</h3>
                        <div className="flex mt-2 space-x-4">
                            <a href="https://www.instagram.com/saisatyanet/?igsh=Nm80MzZlZDlqZ2Jv#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                                <InstagramIcon className="h-6 w-6" />
                            </a>
                             <a href="https://www.whatsapp.com/channel/0029Vb5yZWO1Hsq1iW0DeQ3s" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="text-gray-400 hover:text-white transition-colors">
                                <WhatsAppIcon className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-wider">Feedback</h3>
                        <p className="mt-2 text-sm text-gray-400">
                            Have a suggestion? We'd love to hear it. Help us improve our services.
                        </p>
                        <button
                            onClick={onSuggestionClick}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                        >
                            Leave a Suggestion
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-gray-700 dark:border-slate-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Sai Satya Net. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
