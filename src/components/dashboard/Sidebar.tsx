"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { menuItems } from "@/data/menu";
import LogoutModal from "@/components/dashboard/LogoutModal";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname(); // Get current path
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    let userData;
    if (typeof window !== "undefined") {
      userData = window.localStorage.getItem("user");
    }
    if (userData) {
      setRole(JSON.parse(userData).role);
      setUsername(JSON.parse(userData).username);
      setEmail(JSON.parse(userData).email);
    }else{
      setRole("user");
      setUsername("John Doe");
      setEmail("john.doe@example.com");
    }
  }, []);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // const handleMenuItemClick = (href: string) => {
  //   // If the menu item is logout, open the modal instead of navigation
  //   if (href === "/logout") {
  //     setIsLogoutModalOpen(true);
  //     return;
  //   }
  // };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    
      {/* Sidebar */}
      <aside 
        className={`
          w-64 bg-white border-r h-screen border-gray-200 fixed inset-y-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:fixed md:left-0 md:top-0
 md:z-0
        `}
      >
        {/* Sidebar Header */}
        <div className="px-4 h-[10%] border-gray-200 flex items-center justify-between">
          <Link href={`/${role}`} onClick={()=>{if(isOpen){ setIsOpen(false)}}} className="flex items-center gap-1.5">
            <Image 
              src="/logo.png" 
              alt="FixMyRoad Logo" 
              width={40} 
              height={40}
              className="mr-2"
            />
            <h1 className="text-2xl font-bold text-[#00ABE4]">FixMyRoad</h1>
          </Link>
          
          {/* Mobile close button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="h-[90%] flex flex-col justify-around">
          <nav className="flex-1 overflow-y-auto p-4">
            {/* Menu Categories */}
            <div className="text-sm">
              {menuItems.map((category) => (
                <div className="flex flex-col gap-2" key={category.title}>
                  <span className="text-gray-400 font-light my-4">
                    {category.title}
                  </span>
                  
                  {category.items.map((item) => {
                    if (item.visible.includes(role || "")) {
                      return (
                        <div key={item.label}>
                          {item.href === "/logout" ? (
                            // Special handling for logout item
                            <button
                              
                              onClick={() => {
                                if(isOpen){ setIsOpen(false)}
                                setIsLogoutModalOpen(true)}}
                              className="flex items-center w-full text-left justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#e6f4fb] hover:text-red-700 transition-colors"
                            >
                              <div className="flex items-center text-red-500 justify-center">
                                <span className="h-6 w-6 mr-2">{item.icon}</span>
                                <span>{item.label}</span>
                              </div>
                            </button>
                          ) : (
                            // Normal link for other items
                            <Link
                              onClick={()=>{if(isOpen){ setIsOpen(false)}}}
                              href={item.href.startsWith("/") ? `/${role}${item.href}` : item.href}
                              className={`flex items-center justify-center lg:justify-start gap-4  py-3 md:px-2 rounded-md hover:bg-[#e6f4fb]  hover:text-[#00ABE4] transition-colors ${
                                pathname === `/${role}${item.href === "/" ? "" : item.href}` ? "bg-[#e6f4fb] text-[#00ABE4] font-semibold" : "text-gray-500"
                              }`}
                            >
                              <div className="flex items-center justify-center">
                                <span className="h-6 w-6 mr-2">{item.icon}</span>
                                <span>{item.label}</span>
                              </div>
                            </Link>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </nav>
          
          {/* User Profile Preview */}
          <div className="p-4 border-t border-gray-200 hidden md:block">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <div className="ml-3 hidden lg:block">
                <p className="text-sm font-medium text-gray-700">{username}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
    </>
  );
} 