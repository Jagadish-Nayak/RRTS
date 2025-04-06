'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import { ComplaintDetailsPage } from "@/components/complaint/ComplaintDetailsPage";

// Define interface for our complaint data
interface ComplaintDetails {
  id: string;
  userName: string;
  phone: string;
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
  estimatedExpense: number;
  rating: number;
  message: string;
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
  const fetchComplaintDetails = async (token: string | null) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/complaint/getById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId }),
      });
      const data = await response.json();
      const statusTimeline = [];
      if (data.complaint.statusUpdates) {
      for (let i = 0; i < data.complaint.statusUpdates.length; i++) {
        data.complaint.statusUpdates[i].date = new Date(data.complaint.statusUpdates[i].date).toLocaleString();
        statusTimeline.push({
          status: data.complaint.statusUpdates[i].status,
          date: data.complaint.statusUpdates[i].date.split(',')[0],
          completed: data.complaint.statusUpdates[i].status
        });
      }}
      const lastStatus = statusTimeline[statusTimeline.length - 1].status;
      if (lastStatus !== "Completed") {
        statusTimeline.push({
          status: "Completed",
          date: data.complaint.estimatedCompletionDate,
          completed: false
        });
      }
      data.complaint.userName = data.complaint.userName;
      data.complaint.phone = data.complaint.phone;
      data.complaint.submissionDate = new Date(data.complaint.submissionDate).toLocaleString();
      data.complaint.statusTimeline = statusTimeline;
      setComplaint(data.complaint);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    }
  };

  // Fetch complaint details (simulated)
  useEffect(() => {
    // Simulate API call to fetch complaint details
    if (typeof window !== "undefined") {
      const localToken = window.localStorage.getItem('token');
      fetchComplaintDetails(localToken);
    }
  }, [complaintId]);

  
  // if (!complaint) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="bg-red-100 text-red-700 p-4 rounded-md">
  //         Complaint not found.
  //       </div>
  //     </div>
  //   );
  // }

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
    loading ? <Loading/> :
    complaint ? (
      <ComplaintDetailsPage
        role="supervisor"
        complaint={complaint}
      />
    ) : (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Complaint not found.
        </div>
      </div>
    )
  );
}


