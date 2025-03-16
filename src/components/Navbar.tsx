'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  activeSection?: string;
}

const Navbar = ({ activeSection }: NavbarProps) => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Update activeLink when activeSection prop changes
  useEffect(() => {
    if (activeSection) {
      setActiveLink(activeSection);
    }
  }, [activeSection]);

  useEffect(() => {
    // Set logo animation after page load
    setLogoLoaded(true);

    // Handle scroll event for sticky navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle active link
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false);
  };

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
      }`}
      style={{ 
        '--tw-shadow-color': 'rgba(0, 171, 228, 0.1)',
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className={`transition-all duration-700 transform ${
              logoLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <Link href="/">
              <Image 
                src="/logo.svg" 
                alt="Road Repair Logo" 
                width={150} 
                height={40} 
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'about', 'services', 'contact'].map((item) => (
              <div key={item} className="relative group">
                <a
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item);
                    scrollToSection(item);
                  }}
                  className={`text-gray-800 font-medium text-lg hover:text-[#00ABE4] transition-colors duration-300 ${
                    activeLink === item ? 'text-[#00ABE4]' : ''
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
                {/* Expanding underline effect */}
                <span className={`absolute left-1/2 -bottom-1 w-0 h-0.5 bg-[#00ABE4] transform -translate-x-1/2 transition-all duration-300 group-hover:w-full ${
                  activeLink === item ? 'w-full' : ''
                }`}></span>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <Link href="/login">
              <button className="bg-[#00ABE4] text-white px-6 py-2 rounded-md hover:bg-opacity-90 hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 transition-all duration-300 text-lg font-medium">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white mt-4 py-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              {['home', 'about', 'services', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item);
                    scrollToSection(item);
                  }}
                  className={`text-gray-800 font-medium text-lg hover:text-[#00ABE4] transition-colors duration-300 ${
                    activeLink === item ? 'text-[#00ABE4]' : ''
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <Link href="/login">
                <button className="bg-[#00ABE4] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-300 cursor-pointer text-lg font-medium mt-2">
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
