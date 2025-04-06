'use client';
import { useEffect, useState } from 'react';
import DonutChart from '@/components/dashboard/DonutChart';
import { TaskSeverityChart } from '@/components/supervisor/TaskSeverityChart';
import { CalendarView } from '@/components/supervisor/CalendarView';
import { EventsList } from '@/components/supervisor/EventsList';
import { NewTasksTable } from '@/components/supervisor/NewTasksTable';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';

// Dummy data


interface Event {
  date: string;
  time: string;
  title: string;
  type: 'Supervisor Assigned' | "Inspected" | 'Ongoing' | 'Completed';
  name: string;
}

// const getTitle = (status : string) => {
//   switch (status) {
//     case 'Not Inspected': return "Inspection Due Date";
//     case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
//     case 'Completed': return 'bg-green-100 text-green-800';
//     case 'Rejected': return 'bg-red-100 text-red-800';
//   }
// };

// const events: Event[] = [
//   { date: '2025-03-12', time: '9:00 AM', title: 'Site Inspection', type: 'task' },
//   { date: '2025-03-12', time: '2:00 PM', title: 'Team Meeting', type: 'meeting' },
//   { date: '2025-03-17', time: '11:00 AM', title: 'Status Update', type: 'other' }
// ];

interface Complaint {
  id: string;
  userName: string;
  phone: string;
  title: string;
  location: string;
  images: string[];
  severity: 'High' | 'Medium' | 'Low';
}


// const tasks = [
//   {
//     id: '1',
//     userName: 'John Doe',
//     phone: '9876543210',
//     title: 'pot hole on road',
//     location: 'Sector 12',
//     images: [
//       '/illustrations/a.png',
//             '/illustrations/b.png',
//             '/illustrations/c.png',
//             '/illustrations/d.png',
//             '/illustrations/e.png',
//     ],
//     status: 'Ongoing',
//     severity: 'High' as const
//   },
//   {
//     id: '2',
//     userName: 'John Doe',
//     phone: '9876543210',
//     title: 'Abandoned vehicle',
//     location: 'Sector 12',
//     images: [
//       '/illustrations/a.png',
//             '/illustrations/b.png',
//             '/illustrations/c.png',
//             '/illustrations/d.png',
//           '/illustrations/e.png',
//     ],
//     status: 'Supervisor Assigned',
//     severity: 'Medium' as const
//   },
//   // Add more dummy tasks...
// ];

export default function SupervisorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [token, setToken] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [high, setHigh] = useState(0);
  const [medium, setMedium] = useState(0);
  const [low, setLow] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  // const handleViewImages = (taskId: string) => {
  //   console.log('View images for task:', taskId);
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const token = localStorage.getItem('token');
  //       const response = await axios.get('/api/supervisor/home', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       const data = response.data;
  //       console.log(data);
  //       data.complaints?.map((item: any) => {
  //         if(item.status === 'Completed'){
  //           setCompleted(completed + 1);
  //         }
  //         else if(item.status === 'Ongoing'){
  //           setOngoing(ongoing + 1);
  //         }
  //         else if(item.status === 'Supervisor Assigned'){
  //           setComplaints([...complaints, {
  //             id: item._id,
  //             userName: item.userID.username,
  //             phone: item.userID.phone,
  //             title: item.title,
  //             location: item.location,
  //             images: item.images,
  //             severity: item.severity,
  //           }]);
  //           setPending(pending + 1);
  //         }
  //         else if(item.status === 'Inspected'){
  //           setPending(pending + 1);
  //         }
  //         else if(item.status === 'Rejected'){
  //           setRejected(rejected + 1);
  //         }
  //         if(item.severity === 'High'){
  //           setHigh(high + 1);
  //         }
  //         else if(item.severity === 'Medium'){
  //           setMedium(medium + 1);
  //         }else if(item.severity === 'Low'){
  //           setLow(low + 1);
  //         }
  //         if(item.status !== 'Completed' || item.status !== 'Rejected'){
  //           setEvents([...events, {
  //             date: new Date(item.statusMessages[0].createdAt+10).toISOString().split('T')[0],
  //             time: new Date(item.statusMessages[0].createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  //             title: (item.status === 'Not Inspected') ? "Inspection Due Date" : "Status Update",
  //             type: item.status,
  //             name: item.title
  //           }]);
  //         }
  //       })
  //     } catch (error) {
  //       toast.error('Error during fetching data');
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const fetchData = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/supervisor/home', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;

      // Temp variables
      setCompleted(data.data.stats.completed);
  setOngoing(data.data.stats.ongoing);
  setPending(data.data.stats.pending);
  setRejected(data.data.stats.rejected);
  setHigh(data.data.stats.high);
  setMedium(data.data.stats.medium);
  setLow(data.data.stats.low);
  setComplaints(data.data.complaints);
setEvents(data.data.events);


    } catch (error) {
      toast.error('Error during fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if(localToken){
      setToken(localToken);
      fetchData(localToken);
    }
  }, []);
  
  const donutData = [
    { name: 'Completed', value: completed, color: '#8884d8' },
    { name: 'Ongoing', value: ongoing, color: '#82ca9d' },
    { name: 'Pending', value: pending, color: '#ffc658' },
    { name: 'Rejected', value: rejected, color: '#ff8042' }
  ];
  
  const severityData = [
    { name: 'High', value: high, fill: '#ff6b6b' },
    { name: 'Medium', value: medium, fill: '#ffd93d' },
    { name: 'Low', value: low, fill: '#4cd964' }
  ];

  return (
    loading ? <Loading />  :
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DonutChart data={donutData} title="Task Status Distribution" />
          <TaskSeverityChart data={severityData} title="Task Severity Distribution" />
        </div>

        {/* Tasks Table */}
        <div id="tasks-table">
        <NewTasksTable 
          tasks={complaints}
          onSuccess={() => token && fetchData(token)}
        />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-96 space-y-6">
        <CalendarView events={events} onDateSelect={setSelectedDate} />
        <EventsList events={events} selectedDate={selectedDate} />
      </div>
    </div>
  );
}