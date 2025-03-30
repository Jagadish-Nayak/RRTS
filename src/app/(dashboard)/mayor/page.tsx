'use client';

import { useState, useEffect } from 'react';
import { FaClipboardList, FaUserTie, FaMapMarkerAlt, FaCheckCircle, FaTachometerAlt, FaChartBar } from 'react-icons/fa';
import StatCard from '@/components/dashboard/StatCard';
import DonutChart from '@/components/dashboard/DonutChart';
import BarChart from '@/components/dashboard/BarChart';
import LineChart from '@/components/dashboard/LineChart';

export default function MayorDashboard() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dummy data for donut chart
  const statusData = [
    { name: 'Completed', value: 40, color: '#82ca9d' },
    { name: 'Pending', value: 30, color: '#8884d8' },
    { name: 'Ongoing', value: 20, color: '#ffc658' },
    { name: 'Rejected', value: 10, color: '#ff7c7c' }
  ];

  // Dummy data for bar chart
  const pincodeData = [
    { pincode: '110001', 'Total Complaints': 150, 'Completed': 100, 'Rejected': 20 },
    { pincode: '110002', 'Total Complaints': 120, 'Completed': 80, 'Rejected': 15 },
    { pincode: '110003', 'Total Complaints': 180, 'Completed': 130, 'Rejected': 25 },
    { pincode: '110004', 'Total Complaints': 90, 'Completed': 60, 'Rejected': 10 },
    { pincode: '110005', 'Total Complaints': 200, 'Completed': 150, 'Rejected': 30 },
  ];

  // Dummy data for line chart
  const monthlyData = [
    { month: 'Jan', Completed: 65, Pending: 28, Rejected: 12 },
    { month: 'Feb', Completed: 59, Pending: 48, Rejected: 18 },
    { month: 'Mar', Completed: 80, Pending: 40, Rejected: 20 },
    { month: 'Apr', Completed: 81, Pending: 19, Rejected: 15 },
    { month: 'May', Completed: 56, Pending: 36, Rejected: 14 },
    { month: 'Jun', Completed: 55, Pending: 27, Rejected: 9 },
  ];

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Top row - 4 stat cards */}
      <div>
        <div className="flex items-center mb-4">
          <FaTachometerAlt className="mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isClient && (
            <>
              <StatCard 
                title="Total Requests" 
                value={1234} 
                icon={<FaClipboardList size={24} />} 
                bgColor="bg-blue-500"
              />
              <StatCard 
                title="Total Supervisors" 
                value={45} 
                icon={<FaUserTie size={24} />} 
                bgColor="bg-green-500"
              />
              <StatCard 
                title="Total Pincodes" 
                value={25} 
                icon={<FaMapMarkerAlt size={24} />} 
                bgColor="bg-purple-500"
              />
              <StatCard 
                title="Total Completed" 
                value={876} 
                icon={<FaCheckCircle size={24} />} 
                bgColor="bg-red-500"
              />
            </>
          )}
        </div>
      </div>

      {/* Middle row - Donut chart and Bar chart */}
      <div>
        <div className="flex items-center mb-4">
          <FaChartBar className="mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DonutChart 
              data={statusData} 
              title="Complaint Status Distribution"
            />
          </div>
          <div className="lg:col-span-2">
            <BarChart 
              data={pincodeData} 
              title="Complaints by Pincode"
            />
          </div>
        </div>
      </div>

      {/* Bottom row - Line chart */}
      <div>
        {/* <div className="flex items-center mb-4">
          <FaChartBar className="mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Monthly Trends</h2>
        </div> */}
        <div className="w-full">
          <LineChart 
            data={monthlyData} 
            title="Monthly Complaint Status"
          />
        </div>
      </div>
    </div>
  );
}