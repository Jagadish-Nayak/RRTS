import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaBell, FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import LogoutModal from "@/components/dashboard/LogoutModal";

interface NavbarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsSidebarOpen }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  // Handle logout button click
  const handleLogoutClick = () => {
    setIsProfileOpen(false); // Close profile dropdown
    setIsLogoutModalOpen(true); // Open logout modal
  };

  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let userData;
    if (typeof window !== "undefined") {
      userData = window.localStorage.getItem("user");
    }
    if (userData) {
      setRole(JSON.parse(userData).role);
      setUsername(JSON.parse(userData).username);
    }else{
      setRole("user");
      setUsername("John Doe");
    }
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20">
        <button 
          className="md:hidden mr-2 focus:outline-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#00ABE4] focus:border-[#00ABE4] sm:text-sm"
            />
          </div>
        </div>
        
        {/* Right side navbar items */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <button className="text-gray-500 hover:text-gray-700 relative focus:outline-none">
            <FaBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-gray-600 h-4 w-4" />
              </div>
              <span className="ml-2 hidden md:block">{username}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1 hidden md:block" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">{username}</p>
                  <p className="text-[15px] text-gray-500">{role}</p>
                </div>
                {role === "user" || role === "supervisor" && (
                  <Link 
                  href={`/${role}/profile`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Your Profile
                </Link>
                )}
                <button 
                  onClick={handleLogoutClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <FaSignOutAlt className="mr-2 h-4 w-4 text-gray-500" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
    </>
  );
} 