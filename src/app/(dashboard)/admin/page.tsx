'use client';

import { useState, useEffect } from 'react';
import { FaClipboardList, FaUserTie, FaMapMarkerAlt, FaCheckCircle, FaTachometerAlt, FaChartBar } from 'react-icons/fa';
import StatCard from '@/components/dashboard/StatCard';
import DonutChart from '@/components/dashboard/DonutChart';
import BarChart from '@/components/dashboard/BarChart';
import LineChart from '@/components/dashboard/LineChart';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Loading';
interface StatusCount {
  date: string;
  Completed: number;
  Pending: number;
  Rejected: number;
}

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pincodeCount, setPincodeCount] = useState(0);
  const [complaints, setComplaints] = useState(0);
  const [allSupervisors, setAllSupervisors] = useState(0);
  const [completedComplaints, setCompletedComplaints] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [ongoingComplaints, setOngoingComplaints] = useState(0);
  const [rejectedComplaints, setRejectedComplaints] = useState(0);
  const [pincodeStats, setPincodeStats] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/home', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.data;
        //console.log(data);
        const demoCounts = [];
        setPincodeCount(data.pincodeCount);
        for(let i=0;i<data.statuscounts.length;i++){
          demoCounts.push({
            date:data.statuscounts[i]._id,
            Completed:data.statuscounts[i].completed,
            Pending:data.statuscounts[i].pending,
            Rejected:data.statuscounts[i].rejected
          })
        }
        setStatusCounts(demoCounts);
        setAllSupervisors(data.allSupervisors);
        let completed=0;
        let pending=0;
        let ongoing=0;
        let rejected=0;
        for(let i=0;i<data.pincodeComplaints.length;i++){
          completed+=data.pincodeComplaints[i].completed;
          pending+=data.pincodeComplaints[i].pending;
          ongoing+=data.pincodeComplaints[i].ongoing;
          rejected+=data.pincodeComplaints[i].rejected;
        }
        setComplaints(data.allComplaints);
        setCompletedComplaints(completed);
        setPendingComplaints(pending);
        setOngoingComplaints(ongoing);
        setRejectedComplaints(rejected);
        setPincodeStats(data.pincodeComplaints);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    setIsClient(true);
  }, []);

  // Dummy data for donut chart
  const statusData = [
    { name: 'Completed', value: completedComplaints, color: '#82ca9d' },
    { name: 'Pending', value: pendingComplaints, color: '#8884d8' },
    { name: 'Ongoing', value: ongoingComplaints, color: '#ffc658' },
    { name: 'Rejected', value: rejectedComplaints, color: '#ff7c7c' }
  ];

  // Dummy data for bar chart
  // const pincodeData = [
  //   { pincode: '110001', 'Total Complaints': 120, 'Completed': 100, 'Rejected': 20 },
  //   { pincode: '110002', 'Total Complaints': 120, 'Completed': 80, 'Rejected': 15 },
  //   { pincode: '110003', 'Total Complaints': 180, 'Completed': 130, 'Rejected': 25 },
  //   { pincode: '110004', 'Total Complaints': 90, 'Completed': 60, 'Rejected': 10 },
  //   { pincode: '110005', 'Total Complaints': 200, 'Completed': 150, 'Rejected': 30 },
  // ];

  // Dummy data for line chart
  // const monthlyData = [
  //   { month: 'Jan', Completed: 65, Pending: 28, Rejected: 12 },
  //   { month: 'Feb', Completed: 59, Pending: 48, Rejected: 18 },
  //   { month: 'Mar', Completed: 80, Pending: 40, Rejected: 20 },
  //   { month: 'Apr', Completed: 81, Pending: 19, Rejected: 15 },
  //   { month: 'May', Completed: 56, Pending: 36, Rejected: 14 },
  //   { month: 'Jun', Completed: 55, Pending: 27, Rejected: 9 },
  // ];

  return (
    isLoading ? <Loading /> :
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
                value={complaints} 
                icon={<FaClipboardList size={24} />} 
                bgColor="bg-blue-500"
              />
              <StatCard 
                title="Total Supervisors" 
                value={allSupervisors} 
                icon={<FaUserTie size={24} />} 
                bgColor="bg-green-500"
              />
              <StatCard 
                title="Total Pincodes" 
                value={pincodeCount} 
                icon={<FaMapMarkerAlt size={24} />} 
                bgColor="bg-purple-500"
              />
              <StatCard 
                title="Total Completed" 
                value={completedComplaints} 
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
              total={complaints}
            />
          </div>
          <div className="lg:col-span-2">
            <BarChart 
              data={pincodeStats} 
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
            data={statusCounts} 
            title="Monthly Complaint Status"
          />
        </div>
      </div>
    </div>
  );
}