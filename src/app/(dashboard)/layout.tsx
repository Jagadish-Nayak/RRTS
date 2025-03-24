"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`${inter.variable} min-h-screen bg-gray-50 flex`}>
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content Wrapper */}
      <div 
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300
          ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64
        `}
      >
        {/* Navbar Component */}
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Page Content */}
        <div className="flex-1  md:p-6 p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
