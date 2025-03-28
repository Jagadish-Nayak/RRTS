'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ComplaintDetailsPage } from '@/components/complaint/ComplaintDetailsPage';

interface ComplaintDetails {
    id: string;
    title: string;
    description: string;
    location: string;
    pincode: string;
    severity: 'Low' | 'Medium' | 'High';
    status: 'Submitted' | 'Supervisor Assigned' | 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
    submissionDate: string;
    assignedSupervisor?: {
      name: string;
      email: string;
      contactNumber: string;
      pincode: string;
      completedTasks: number;
      rating: number;
    };
    estimatedExpense: number;
    rating: number;
    message: string;
    images: string[];
    estimatedCompletionDate?: string;
    statusUpdates: {
      id: number;
      date: string;
      message: string;
      status: string;
    }[];
    statusTimeline: {
      status: string;
      date: string;
      completed: boolean;
    }[];
  }

export default function AdminComplaintDetails() {
  const params = useParams();
  const complaintId = params.id as string;
  
  // State for the complaint details
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState(true);

  
  // Fetch complaint details (simulated)
  useEffect(() => {
    // Simulate API call to fetch complaint details    
    const fetchComplaintDetails = () => {
        setLoading(true);
        
        // Simulate network delay
        setTimeout(() => {
          // Mock data for the complaint
          const mockComplaint: ComplaintDetails = {
            id: complaintId,
            title: 'Road damage near Main Street intersection',
            description: 'There is a large pothole in the middle of the road causing traffic and potential danger to vehicles. It has been there for more than a month and getting worse with rain.',
            location: 'Main Street and 5th Avenue intersection, near the shopping complex',
            pincode: '110001',
            severity: 'High',
            status: 'Submitted',
            submissionDate: '2023-07-15',
            assignedSupervisor: {
              name: 'John Smith',
              email: 'john.smith@municipality.gov',
              contactNumber: '(555) 123-4567',
              pincode: '110005',
              completedTasks: 47,
              rating: 4.5
            },
            images: [
              '/illustrations/a.png',
              '/illustrations/b.png',
              '/illustrations/c.png',
              '/illustrations/d.png',
              '/illustrations/e.png',
            ],
            estimatedCompletionDate: '2023-08-25',
            estimatedExpense: 10000,
            rating: 4.5,
            message: 'The pothole has been repaired and the road is now safe for traffic.',
            statusUpdates: [
              { id: 1, date: '2023-07-15 09:30 AM', message: 'Complaint submitted successfully', status: 'Submitted' },
              { id: 2, date: '2023-07-16 11:45 AM', message: 'Complaint assigned to supervisor John Smith', status: 'Supervisor Assigned' },
              { id: 3, date: '2023-07-18 03:15 PM', message: 'Supervisor has inspected the site and confirmed the issue. Repair team will be assigned soon.', status: 'Inspected' },
              { id: 4, date: '2023-07-22 10:00 AM', message: 'Repair work has started. Expected to be completed by August 25.', status: 'Ongoing' },
              { id: 5, date: '2023-07-15 09:30 AM', message: 'Complaint submitted successfully', status: 'Submitted' },
              { id: 6, date: '2023-07-16 11:45 AM', message: 'Complaint assigned to supervisor John Smith', status: 'Supervisor Assigned' },
              { id: 7, date: '2023-07-18 03:15 PM', message: 'Supervisor has inspected the site and confirmed the issue. Repair team will be assigned soon.', status: 'Inspected' },
              { id: 8, date: '2023-07-22 10:00 AM', message: 'Repair work has started. Expected to be completed by August 25.', status: 'Ongoing' }
            ],
            statusTimeline: [
              { status: 'Submitted', date: '2023-07-15', completed: true },
              { status: 'Supervisor Assigned', date: '2023-07-16', completed: true },
              { status: 'Inspected', date: '2023-07-18', completed: true },
              { status: 'Ongoing', date: '2023-07-22', completed: true },
              { status: 'Completed', date: '2023-08-25', completed: true }
            ]
          };
          
          setComplaint(mockComplaint);
          setLoading(false);
        }, 500);
      };
    fetchComplaintDetails();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Complaint not found.
        </div>
      </div>
    );
  }

  return (
    <ComplaintDetailsPage
      role="admin"
      complaint={complaint}
    //   onRefresh={fetchComplaintDetails}
    />
  );
}
