'use client';
import { useState } from 'react';
import DonutChart from '@/components/dashboard/DonutChart';
import { TaskSeverityChart } from '@/components/supervisor/TaskSeverityChart';
import { CalendarView } from '@/components/supervisor/CalendarView';
import { EventsList } from '@/components/supervisor/EventsList';
import { NewTasksTable } from '@/components/supervisor/NewTasksTable';

// Dummy data
const donutData = [
  { name: 'Completed', value: 40, color: '#8884d8' },
  { name: 'Ongoing', value: 30, color: '#82ca9d' },
  { name: 'Pending', value: 20, color: '#ffc658' },
  { name: 'Rejected', value: 10, color: '#ff8042' }
];

const severityData = [
  { name: 'High', value: 8, fill: '#ff6b6b' },
  { name: 'Medium', value: 15, fill: '#ffd93d' },
  { name: 'Low', value: 25, fill: '#4cd964' }
];

interface Event {
  date: string;
  time: string;
  title: string;
  type: 'meeting' | 'task' | 'other';
}

const events: Event[] = [
  { date: '2025-03-12', time: '9:00 AM', title: 'Site Inspection', type: 'task' },
  { date: '2025-03-12', time: '2:00 PM', title: 'Team Meeting', type: 'meeting' },
  { date: '2025-03-17', time: '11:00 AM', title: 'Status Update', type: 'other' }
];

const tasks = [
  {
    id: '1',
    userName: 'John Doe',
    phone: '9876543210',
    title: 'pot hole on road',
    location: 'Sector 12',
    images: [
      '/illustrations/a.png',
            '/illustrations/b.png',
            '/illustrations/c.png',
            '/illustrations/d.png',
            '/illustrations/e.png',
    ],
    status: 'Ongoing',
    severity: 'High' as const
  },
  {
    id: '2',
    userName: 'John Doe',
    phone: '9876543210',
    title: 'Abandoned vehicle',
    location: 'Sector 12',
    images: [
      '/illustrations/a.png',
            '/illustrations/b.png',
            '/illustrations/c.png',
            '/illustrations/d.png',
          '/illustrations/e.png',
    ],
    status: 'Supervisor Assigned',
    severity: 'Medium' as const
  },
  // Add more dummy tasks...
];

export default function SupervisorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // const handleViewImages = (taskId: string) => {
  //   console.log('View images for task:', taskId);
  // };

  const handleStatusUpdate = () => {
    // Refresh tasks data
    // You'll implement this when connecting to real API
    console.log('Refreshing tasks data...');
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DonutChart data={donutData} title="Task Status Distribution" />
          <TaskSeverityChart data={severityData} title="Task Severity Distribution" />
        </div>

        {/* Tasks Table */}
        <NewTasksTable
          tasks={tasks}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-96 space-y-6">
        <CalendarView events={events} onDateSelect={setSelectedDate} />
        <EventsList events={events} selectedDate={selectedDate} />
      </div>
    </div>
  );
}