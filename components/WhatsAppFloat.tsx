
import React from 'react';
import { WhatsAppIcon } from './IconComponents';

// Use the phone number from your contact page
const WHATSAPP_NUMBER = "918977846407";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700 transition-all duration-300 ease-in-out transform hover:scale-110"
    >
      <WhatsAppIcon className="w-8 h-8" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
};
