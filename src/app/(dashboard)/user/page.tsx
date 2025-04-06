'use client';

import { useState, useEffect } from 'react';
import { FaTachometerAlt, FaClipboardList, FaCheckCircle, FaCommentDots, FaUserShield} from 'react-icons/fa';
import StatCard from '@/components/dashboard/StatCard';
import DonutChart from '@/components/dashboard/DonutChart';
import SupervisorList from '@/components/dashboard/SupervisorList';
import Announcements from '@/components/dashboard/Announcements';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Loading';



export default function UserDashboard() {
  // State for animated statistics
  const [isClient, setIsClient] = useState(false);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedComplaints, setCompletedComplaints] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [ongoingComplaints, setOngoingComplaints] = useState(0);
  const [rejectedComplaints, setRejectedComplaints] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);
  // Use useEffect to avoid hydration mismatch
  const bgColors = ['bg-blue-50 border-blue-200','bg-red-50 border-red-200', 'bg-green-50 border-green-200','bg-yellow-50 border-yellow-200', 'bg-purple-50 border-purple-200',];
  useEffect(() => {
    const fetchData = async () => {
      try{
        setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/user/home',{
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          const data = response.data;
          //console.log(data);
          if (data.success) {
            const stats = data.data;
            setCompletedComplaints(stats.completedComplaints);
            setPendingComplaints(stats.pendingComplaints);
            setOngoingComplaints(stats.ongoingComplaints);
            setRejectedComplaints(stats.rejectedComplaints);
            setTotalComplaints(stats.totalComplaints);
            setTotalFeedbacks(stats.totalFeedbacks);
            setAllSupervisors(stats.allSupervisors);
            for(let i=0;i<stats.allMessages.length;i++){
              stats.allMessages[i].bgColor = bgColors[i%bgColors.length];
            }
            setAllMessages(stats.allMessages);
          }
      }catch(error){
          console.error('Error fetching data:', error);
          toast.error('Error fetching data');
      }finally{
        setLoading(false);
      }
    };
    fetchData();
    setIsClient(true);
  }, []);
  
  // Dummy data for donut chart
  const complaintStatusData = [
    { name: 'Completed', value: completedComplaints, color: '#8884d8' },
    { name: 'Pending', value: pendingComplaints, color: '#00C49F' },
    { name: 'Ongoing', value: ongoingComplaints, color: '#FFBB28' },
    { name: 'Rejected', value: rejectedComplaints, color: '#1167b1' }
  ];
  
  
  // Dummy data for supervisors
  // const supervisorsData = [
  //   { id: 1, name: 'John Smith', contactNumber: '123-456-7890' },
  //   { id: 2, name: 'Emily Johnson', contactNumber: '234-567-8901' },
  //   { id: 3, name: 'Michael Brown', contactNumber: '345-678-9012' },
  //   { id: 4, name: 'Sarah Davis', contactNumber: '456-789-0123' },
  // ];
  
  // Dummy data for announcements
  // const announcements = [
  //   {
  //     id: 1,
  //     title: 'System Maintenance',
  //     content: 'The system will be under maintenance on July 15th from 2 AM to 5 AM.',
  //     date: 'July 10, 2023',
  //     bgColor: 'bg-blue-50 border-blue-200'
  //   },
  //   {
  //     id: 2,
  //     title: 'New Feature Release',
  //     content: 'We\'re excited to announce the release of our new reporting feature!',
  //     date: 'July 8, 2023',
  //     bgColor: 'bg-green-50 border-green-200'
  //   },
  //   {
  //     id: 3,
  //     title: 'Holiday Notice',
  //     content: 'Our offices will be closed for the upcoming holiday on July 20th.',
  //     date: 'July 5, 2023',
  //     bgColor: 'bg-yellow-50 border-yellow-200'
  //   },
  //   {
  //     id: 4,
  //     title: 'Training Session',
  //     content: 'Don\'t miss our upcoming training session on advanced reporting techniques.',
  //     date: 'July 3, 2023',
  //     bgColor: 'bg-purple-50 border-purple-200'
  //   },
  //   {
  //     id: 5,
  //     title: 'System Maintenance',
  //     content: 'The system will be under maintenance on July 15th from 2 AM to 5 AM.',
  //     date: 'July 10, 2023',
  //     bgColor: 'bg-blue-50 border-blue-200'
  //   },
  //   {
  //     id: 6,
  //     title: 'New Feature Release',
  //     content: 'We\'re excited to announce the release of our new reporting feature!',
  //     date: 'July 8, 2023',
  //     bgColor: 'bg-green-50 border-green-200'
  //   },
  //   {
  //     id: 7,
  //     title: 'Holiday Notice',
  //     content: 'Our offices will be closed for the upcoming holiday on July 20th.',
  //     date: 'July 5, 2023',
  //     bgColor: 'bg-yellow-50 border-yellow-200'
  //   },
  //   {
  //     id: 8,
  //     title: 'Training Session',
  //     content: 'Don\'t miss our upcoming training session on advanced reporting techniques.',
  //     date: 'July 3, 2023',
  //     bgColor: 'bg-purple-50 border-purple-200'
  //   }
  // ];
  
  return (
    loading ? <Loading /> :
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
                title="Total Complaints" 
                value={totalComplaints} 
                icon={<FaClipboardList size={24} />} 
                bgColor="bg-blue-500"
              />
              <StatCard 
                title="Completed Requests" 
                value={completedComplaints} 
                icon={<FaCheckCircle size={24} />} 
                bgColor="bg-green-500"
              />
              <StatCard 
                title="Total Feedbacks" 
                value={totalFeedbacks} 
                icon={<FaCommentDots size={24} />} 
                bgColor="bg-purple-500"
              />
              <StatCard 
                title="Total Supervisors" 
                value={allSupervisors.length} 
                icon={<FaUserShield size={24} />} 
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
              data={complaintStatusData} 
              title="Complaint Status"
            />
            <SupervisorList 
              supervisors={allSupervisors} 
              title="Supervisor Directory"
            />
            <Announcements 
              announcements={allMessages} 
              title="Recent Announcements"
            />
        </div>
      </div>
    </div>
  );
}