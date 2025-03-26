'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';


import { ComplaintDetailsPage } from "@/components/complaint/ComplaintDetailsPage";

// Define interface for our complaint data
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

export default function ComplaintDetails() {
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
    // <div className="w-full p-4 space-y-6">
    //   {/* Row 1: Image Gallery and Complaint Details - 2 Equal Columns */}
    //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //     {/* Image Gallery */}
    //     <ImageGallery images={complaint.images} />
        
    //     {/* Complaint Details */}
    //     <ComplaintDetailsCard 
    //       title={complaint.title}
    //       description={complaint.description}
    //       location={complaint.location}
    //       pincode={complaint.pincode}
    //       severity={complaint.severity}
    //       status={complaint.status}
    //       submissionDate={complaint.submissionDate}
    //     />
    //   </div>
      
    //   {/* Row 2: Status Timeline */}
    //   <StatusTimeline 
    //     steps={complaint.statusTimeline}
    //     estimatedCompletionDate={complaint.estimatedCompletionDate}
    //     currentStatus={complaint.status}
    //   />
      
    //   {/* Row 3: Supervisor Profile and Status Updates */}
    //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //     {/* Supervisor Profile */}
    //     {complaint.assignedSupervisor && (
    //       <SupervisorCard 
    //         name={complaint.assignedSupervisor.name}
    //         email={complaint.assignedSupervisor.email}
    //         contactNumber={complaint.assignedSupervisor.contactNumber}
    //         pincode={complaint.assignedSupervisor.pincode}
    //         completedTasks={complaint.assignedSupervisor.completedTasks}
    //         rating={complaint.assignedSupervisor.rating}
    //       />
    //     )}
        
    //     {/* Status Updates */}
    //     <StatusUpdatesList updates={complaint.statusUpdates} />
    //   </div>
    // </div>
    
    <ComplaintDetailsPage
      role="user"
      complaint={complaint}
    />
  );
}


