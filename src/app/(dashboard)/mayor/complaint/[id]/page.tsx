'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ComplaintDetailsPage } from '@/components/complaint/ComplaintDetailsPage';
import Loading from '@/components/Loading';

interface ComplaintDetails {
  id: string;
  title: string;
  userName: string;
  phone: string;
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

export default function AdminComplaintDetails() {
  const params = useParams();
  const complaintId = params.id as string;
  const [token, setToken] = useState<string | null>(null);
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
      if (lastStatus !== "Completed" && lastStatus !== "Rejected") {
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
      setToken(localToken);
      fetchComplaintDetails(localToken);
    }
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }
  
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
    loading ? <Loading /> :
    complaint ? (
    <ComplaintDetailsPage
      role="mayor"
      complaint={complaint}
      onSuccess={() => token && fetchComplaintDetails(token)}
    //   onRefresh={fetchComplaintDetails}
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
