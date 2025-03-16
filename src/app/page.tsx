'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import { FaCalendarAlt, FaProjectDiagram, FaCheckCircle, FaSmileBeam, FaArrowUp } from 'react-icons/fa';

// Counter component for animated numbers
interface AnimatedCounterProps {
  end: number;
  title: string;
  duration?: number;
  icon: React.ReactNode;
}

const AnimatedCounter = ({ end, title, duration = 2000, icon }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isVisible]);

  return (
    <div 
      ref={counterRef} 
      className="text-center p-6 bg-white rounded-xl shadow-md border border-[#E9F1FA] hover:border-[#00ABE4] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center hover:bg-[#E9F1FA] hover:transform hover:scale-105"
    >
      <div className="text-[#00ABE4] text-4xl mb-4 transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="text-5xl font-bold mb-2 transition-all duration-300" style={{ color: '#00ABE4' }}>
        {count}+
      </div>
      <div className="text-gray-600 font-medium">{title}</div>
    </div>
  );
};

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Refs for each section
  const sectionRefs = {
    home: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    services: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null)
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100; // Offset for better detection
      
      // Check each section's position
      const sections = Object.keys(sectionRefs);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const ref = sectionRefs[section as keyof typeof sectionRefs].current;
        
        if (ref && ref.offsetTop <= scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1FA] via-white to-[#E9F1FA]">
      <Navbar activeSection={activeSection} />

      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#00ABE4] text-white flex items-center justify-center shadow-lg z-[100] transition-all duration-300 hover:bg-[#0090c0] hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-xl animate-pulse" />
      </button>

      {/* Hero Section with Enhanced Gradient Background */}
      <section 
        id="home" 
        ref={sectionRefs.home}
        className="relative min-h-screen pt-20 overflow-hidden" 
        style={{ 
          background: 'linear-gradient(135deg, #E9F1FA 0%, #FFFFFF 40%, #E9F1FA 70%, #FFFFFF 100%)'
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Side - Text Content */}
            <div className="w-full md:w-1/2 mb-12 md:mb-0 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl text-gray-400 lg:text-6xl font-bold mb-4">
                We Are Leading
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#00ABE4' }}>
                Road Repair Solutions
              </h2>
              <h3 className="text-4xl md:text-5xl text-gray-400 lg:text-6xl font-bold mb-6">
                Providing Company
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                We specialize in efficient road repair and maintenance services, 
                using cutting-edge technology to track and manage infrastructure projects
                with precision and reliability.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
                  style={{ 
                    backgroundColor: '#00ABE4',
                    color: '#FFFFFF'
                  }}
                >
                  Get Started
                </button>
                <button 
                  className="px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
                  style={{ 
                    border: '2px solid #00ABE4',
                    color: '#00ABE4'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#00ABE4';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#00ABE4';
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
            
            {/* Right Side - Illustration Slider */}
            <div className="w-full md:w-1/2">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Redesigned */}
      <section 
        id="about" 
        ref={sectionRefs.about}
        className="py-20"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Right Side - Stats (Now on the left) */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedCounter 
                  end={12} 
                  title="Years Experience" 
                  icon={<FaCalendarAlt size={40} />} 
                />
                <AnimatedCounter 
                  end={85} 
                  title="Project Challenges" 
                  icon={<FaProjectDiagram size={40} />} 
                />
                <AnimatedCounter 
                  end={250} 
                  title="Completed Projects" 
                  icon={<FaCheckCircle size={40} />} 
                />
                <AnimatedCounter 
                  end={120} 
                  title="Happy Clients" 
                  icon={<FaSmileBeam size={40} />} 
                />
              </div>
            </div>
            
            {/* Left Side - Description (Now on the right) */}
            <div className="w-full lg:w-1/2">
              <h4 className="text-lg font-medium text-[#00ABE4] mb-2">How It Started</h4>
              <h2 className="text-3xl md:text-4xl text-gray-400 font-bold mb-6">Our Dream is Road Infrastructure Transformation</h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Our company was founded by Robert Johnson, a passionate civil engineer, 
                and Maria Rodriguez, a visionary urban planner. Their shared dream was to 
                create a digital system of road repair tracking accessible to all.
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                United by their belief in the transformational power of infrastructure management, 
                they embarked on a journey to build this platform. With relentless dedication, 
                they gathered a team of experts and launched this innovative solution, creating a 
                global network of efficient road maintenance systems.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Today, we continue to expand our services, bringing cutting-edge technology 
                to road repair and maintenance projects worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        ref={sectionRefs.services}
        className="py-16"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              <span className="text-gray-800">Our </span>
              <span className="text-[#00ABE4]">SERVICES</span>
            </h2>
            <div className="w-24 h-1 bg-[#00ABE4] mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-[#00ABE4]">
              <div className="w-16 h-16 bg-[#00ABE4] rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-[#00ABE4] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-400 font-bold mb-3 group-hover:text-white transition-colors duration-300">Road Assessment</h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
                Comprehensive evaluation of road conditions using advanced technology to identify damage, wear patterns, and structural issues requiring attention.
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ABE4]"></div>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-[#00ABE4]">
              <div className="w-16 h-16 bg-[#00ABE4] rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-[#00ABE4] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-400 font-bold mb-3 group-hover:text-white transition-colors duration-300">Digital Tracking</h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
                Real-time monitoring system that tracks repair progress, resource allocation, and project timelines for efficient management of road maintenance.
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ABE4]"></div>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-[#00ABE4]">
              <div className="w-16 h-16 bg-[#00ABE4] rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-[#00ABE4] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-400 font-bold mb-3 group-hover:text-white transition-colors duration-300 ">Documentation</h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
                Detailed photographic and written documentation of road conditions before, during, and after repairs for quality assurance and future reference.
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ABE4]"></div>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-[#00ABE4]">
              <div className="w-16 h-16 bg-[#00ABE4] rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-[#00ABE4] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-400 font-bold mb-3 group-hover:text-white transition-colors duration-300">User Experience</h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
                Intuitive interfaces for municipal staff and contractors to report issues, update progress, and access critical information about road repair projects.
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ABE4]"></div>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-[#00ABE4]">
              <div className="w-16 h-16 bg-[#00ABE4] rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-[#00ABE4] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-400 font-bold mb-3 group-hover:text-white transition-colors duration-300">Clean Code</h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
                Well-structured, maintainable software architecture ensuring reliable performance of the road repair tracking system with minimal downtime.
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ABE4]"></div>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-[#00ABE4]">
              <div className="w-16 h-16 bg-[#00ABE4] rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-white group-hover:text-[#00ABE4] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-400  font-bold mb-3 group-hover:text-white transition-colors duration-300">Fast Support</h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors duration-300">
                24/7 technical assistance and customer support for municipalities and contractors using our road repair tracking platform to resolve issues promptly.
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ABE4]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={sectionRefs.contact}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Column - Contact Info */}
            <div className="w-full md:w-1/2">
              <h2 className="text-5xl font-bold mb-6 text-gray-800">Contact Us</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Feel free to use the form or drop us an email. Old-fashioned 
                phone calls work too.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#00ABE4] flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">(123) 456-7890</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#00ABE4] flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">info@roadrepairtracker.com</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#00ABE4] flex items-center justify-center text-white mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-700 text-lg block">123 Road Street</span>
                    <span className="text-gray-700 text-lg">City, State 12345</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact Form */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <form>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      className="w-1/2 px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                      placeholder="First"
                    />
                    <input
                      type="text"
                      className="w-1/2 px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                      placeholder="Last"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 text-gray-700 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                    placeholder="xxx-xxx-xxxx"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 text-gray-700 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                    placeholder="Type your message..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="px-8 py-3 rounded-md bg-[#00ABE4] text-white font-medium hover:shadow-lg
                  hover:bg-[#00ABE0] transition-all duration-300 cursor-pointer"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1167b1] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Road Repair Tracker</h3>
              <p className="text-gray-400">Efficient road repair management and tracking system for municipalities.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <p className="text-gray-400 mb-2">123 Road Street</p>
              <p className="text-gray-400 mb-2">City, State 12345</p>
              <p className="text-gray-400 mb-2">info@roadrepairtracker.com</p>
              <p className="text-gray-400">(123) 456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Road Repair Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
