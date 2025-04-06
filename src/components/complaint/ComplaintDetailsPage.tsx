'use client';
import { useState } from 'react';
import { ImageGallery } from './ImageGallery';
import { ComplaintDetailsCard } from './ComplaintDetailsCard';
import { StatusTimeline } from './StatusTimeline';
import { SupervisorCard } from './SupervisorCard';
import { StatusUpdatesList } from './StatusUpdatesList';
import { SupervisorAssignmentTable } from './SupervisorAssignmentTable';

interface ComplaintDetails {
    id: string;
    title: string;
    description: string;
    location: string;
    userName?: string;
    phone?: string;
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
    estimatedExpense: number;
    rating: number;
    message: string;
  }

interface ComplaintDetailsPageProps {
  role: 'user' | 'admin' | 'supervisor' | 'mayor';
  complaint: ComplaintDetails; // Use your existing ComplaintDetails interface
  onSuccess?: () => void;
}

export function ComplaintDetailsPage({ role, complaint, onSuccess }: ComplaintDetailsPageProps) {
  const [showAssignSupervisor, setShowAssignSupervisor] = useState(false);

  const handleAssignmentComplete = () => {
    setShowAssignSupervisor(false);
    onSuccess?.();
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Row 1: Image Gallery and Complaint Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageGallery images={complaint.images} />
        <ComplaintDetailsCard 
          role={role}
          userName={complaint?.userName}
          phone={complaint?.phone}
          title={complaint.title}
          description={complaint.description}
          location={complaint.location}
          pincode={complaint.pincode}
          severity={complaint.severity}
          status={complaint.status}
          submissionDate={complaint.submissionDate}
          estimatedExpense={complaint.estimatedExpense}
          rating={complaint.rating}
          message={complaint.message}
        />
      </div>
      
      {/* Assign Supervisor Button for Admin */}
      {role === 'admin' && complaint.status === 'Submitted' && !showAssignSupervisor && (
        <div className="flex justify-end" id="assign-supervisor">
          <button
            onClick={() => setShowAssignSupervisor(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Assign Supervisor
          </button>
        </div>
      )}

      {/* Supervisor Assignment Table */}
      {role === 'admin' && showAssignSupervisor && (
        <SupervisorAssignmentTable
          title={complaint.title}
          pincode={complaint.pincode}
          complaintId={complaint.id}
          onAssignmentComplete={handleAssignmentComplete}
        />
      )}
      
      {/* Row 2: Status Timeline */}
      <StatusTimeline 
        steps={complaint.statusTimeline}
        estimatedCompletionDate={complaint.estimatedCompletionDate}
        currentStatus={complaint.status}
      />
      
      {/* Row 3: Supervisor Profile and Status Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supervisor Profile or Placeholder */}
        {complaint.status === 'Submitted' && !showAssignSupervisor ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Supervisor Assignment</h2>
              <p className="text-gray-600">No supervisor assigned yet.</p>
            </div>
          ) : (
          complaint.assignedSupervisor && (
            <SupervisorCard 
              name={complaint.assignedSupervisor.name}
              email={complaint.assignedSupervisor.email}
              contactNumber={complaint.assignedSupervisor.contactNumber}
              pincode={complaint.assignedSupervisor.pincode}
              completedTasks={complaint.assignedSupervisor.completedTasks}
              rating={complaint.assignedSupervisor.rating}
            />
          )
        )}
        
        {/* Status Updates */}
        <StatusUpdatesList updates={complaint.statusUpdates} />
      </div>
    </div>
  );
} 