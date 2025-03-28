'use client';
import { useState } from 'react';
import { ImageGallery } from './ImageGallery';
import { ComplaintDetailsCard } from './ComplaintDetailsCard';
import { StatusTimeline } from './StatusTimeline';
import { SupervisorCard } from './SupervisorCard';
import { StatusUpdatesList } from './StatusUpdatesList';
import { SupervisorAssignmentTable } from '../supervisor/SupervisorAssignmentTable';
import toast from 'react-hot-toast';

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

interface ComplaintDetailsProps {
  complaint: ComplaintDetails; // Use your existing ComplaintDetails interface
  role: 'user' | 'admin';
  onSupervisorAssign?: (complaintId: string, supervisorId: string) => Promise<void>;
}

export function ComplaintDetails({ complaint, role, onSupervisorAssign }: ComplaintDetailsProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignedSupervisor, setAssignedSupervisor] = useState(complaint.assignedSupervisor);

  const handleAssignSupervisor = async (supervisorId: string) => {
    try {
      if (onSupervisorAssign) {
        await onSupervisorAssign(complaint.id, supervisorId);
        // Update the local state with the new supervisor details
        // In a real implementation, you would fetch the updated complaint details
        setAssignedSupervisor({
          name: 'New Supervisor',
          email: 'supervisor@example.com',
          contactNumber: '1234567890',
          pincode: complaint.pincode,
          completedTasks: 0,
          rating: 5
        });
        complaint.status = 'Supervisor Assigned';
        setIsAssigning(false);
        toast.success('Supervisor assigned successfully');
      }
    } catch (error: unknown) {
      console.error('Error assigning supervisor:', error);
      toast.error('Failed to assign supervisor');
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Row 1: Image Gallery and Complaint Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageGallery images={complaint.images} />
        <ComplaintDetailsCard 
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
      
      {/* Supervisor Assignment Section (Admin Only) */}
      {role === 'admin' && complaint.status === 'Submitted' && (
        <div>
          {!isAssigning ? (
            <button
              onClick={() => setIsAssigning(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Assign Supervisor
            </button>
          ) : (
            <SupervisorAssignmentTable
              pincode={complaint.pincode}
              onAssign={handleAssignSupervisor}
            />
          )}
        </div>
      )}
      
      {/* Row 2: Status Timeline */}
      <StatusTimeline 
        steps={complaint.statusTimeline}
        estimatedCompletionDate={complaint.estimatedCompletionDate}
        currentStatus={complaint.status}
      />
      
      {/* Row 3: Supervisor Profile and Status Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supervisor Profile or Assignment Button */}
        {assignedSupervisor ? (
          <SupervisorCard 
            name={assignedSupervisor.name}
            email={assignedSupervisor.email}
            contactNumber={assignedSupervisor.contactNumber}
            pincode={assignedSupervisor.pincode}
            completedTasks={assignedSupervisor.completedTasks}
            rating={assignedSupervisor.rating}
          />
        ) : (
          role === 'admin' && complaint.status === 'Submitted' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-center">
                No supervisor assigned yet
              </p>
            </div>
          )
        )}
        
        {/* Status Updates */}
        <StatusUpdatesList updates={complaint.statusUpdates} />
      </div>
    </div>
  );
} 