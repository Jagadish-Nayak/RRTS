'use client';

import { useState, useEffect } from 'react';
import { FaUsers, FaMoneyBillWave, FaChartPie, FaUserTie, FaTachometerAlt, FaClipboardList} from 'react-icons/fa';
import StatCard from '@/components/dashboard/StatCard';
import DonutChart from '@/components/dashboard/DonutChart';
import SupervisorList from '@/components/dashboard/SupervisorList';
import Announcements from '@/components/dashboard/Announcements';

export default function UserDashboard() {
  // State for animated statistics
  const [isClient, setIsClient] = useState(false);
  
  // Use useEffect to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Dummy data for donut chart
  const deviceData = [
    { name: 'Completed', value: 40, color: '#8884d8' },
    { name: 'Pending', value: 30, color: '#00C49F' },
    { name: 'Ongoing', value: 20, color: '#FFBB28' },
    { name: 'Rejected', value: 10, color: '#1167b1' }
  ];
  
  
  // Dummy data for supervisors
  const supervisorsData = [
    { id: 1, name: 'John Smith', contactNumber: '123-456-7890' },
    { id: 2, name: 'Emily Johnson', contactNumber: '234-567-8901' },
    { id: 3, name: 'Michael Brown', contactNumber: '345-678-9012' },
    { id: 4, name: 'Sarah Davis', contactNumber: '456-789-0123' },
  ];
  
  // Dummy data for announcements
  const announcements = [
    {
      id: 1,
      title: 'System Maintenance',
      content: 'The system will be under maintenance on July 15th from 2 AM to 5 AM.',
      date: 'July 10, 2023',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      id: 2,
      title: 'New Feature Release',
      content: 'We\'re excited to announce the release of our new reporting feature!',
      date: 'July 8, 2023',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      id: 3,
      title: 'Holiday Notice',
      content: 'Our offices will be closed for the upcoming holiday on July 20th.',
      date: 'July 5, 2023',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 4,
      title: 'Training Session',
      content: 'Don\'t miss our upcoming training session on advanced reporting techniques.',
      date: 'July 3, 2023',
      bgColor: 'bg-purple-50 border-purple-200'
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Top row - 4 stat cards */}
      <div>
        <div className="flex items-center mb-4">
          <FaTachometerAlt className="mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Key Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isClient && (
            <>
              <StatCard 
                title="Total Income" 
                value={953000} 
                icon={<FaMoneyBillWave size={24} />} 
                bgColor="bg-blue-500"
              />
              <StatCard 
                title="Total Expense" 
                value={236000} 
                icon={<FaChartPie size={24} />} 
                bgColor="bg-green-500"
              />
              <StatCard 
                title="Total Assets" 
                value={987563} 
                icon={<FaUsers size={24} />} 
                bgColor="bg-purple-500"
              />
              <StatCard 
                title="Total Staff" 
                value={987563} 
                icon={<FaUserTie size={24} />} 
                bgColor="bg-red-500"
              />
            </>
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center mb-4">
          <FaClipboardList className="mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Reports & Information</h2>
        </div>
        
        {/* Bottom row - charts, supervisor list, and announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column */}
          
            <DonutChart 
              data={deviceData} 
              title="Device Distribution"
            />
            <SupervisorList 
              supervisors={supervisorsData} 
              title="Supervisor Directory"
            />
            <Announcements 
              announcements={announcements} 
              title="Recent Announcements"
            />
        </div>
      </div>
    </div>
  );
}