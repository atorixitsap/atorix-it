"use client";

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function FloatingContactButtons() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const phoneNumber = '+918956001555'; // Phone number for both call and WhatsApp

  // Show the floating buttons after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        // Also collapse the menu when scrolling back to top
        setExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Close the expanded menu
  const closeMenu = () => {
    setExpanded(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end">
      {/* Close button appears when expanded */}
      {expanded && (
        <button
          onClick={closeMenu}
          className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 p-2 rounded-full mb-2 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          aria-label="Close contact menu"
        >
          <X size={20} />
        </button>
      )}

      {/* WhatsApp button */}
      <div className={`transition-all duration-300 transform ${expanded ? 'translate-y-0 opacity-100 mb-3' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <Link
          href={`https://wa.me/${phoneNumber.replace(/\+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Contact via WhatsApp"
        >
          <MessageCircle size={24} />
        </Link>
      </div>

      {/* Call button */}
      <div className={`transition-all duration-300 transform ${expanded ? 'translate-y-0 opacity-100 mb-3' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <Link
          href={`tel:${phoneNumber}`}
          className="bg-blue-500 text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Call us"
        >
          <Phone size={24} />
        </Link>
      </div>

      {/* Main toggle button */}
      <button
        onClick={toggleExpanded}
        className={`p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          expanded
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
        aria-label="Toggle contact options"
      >
        {expanded ? (
          <X size={24} />
        ) : (
          <Phone size={24} />
        )}
      </button>
    </div>
  );
}
