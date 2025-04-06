import { FaTimes } from 'react-icons/fa';
import { StatusTimeline } from './StatusTimeline';

interface TrackStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId?: string;
  statusSteps: {
    status: string;
    date: string;
    completed: boolean;
  }[];
  currentStatus: string;
  role: string;
  estimatedCompletionDate?: string;
}

export default function TrackStatusModal({ 
  isOpen, 
  onClose, 
  complaintId,
  statusSteps,
  role,
  currentStatus,
  estimatedCompletionDate
}: TrackStatusModalProps) {
  
  if (!isOpen) return null;
  console.log(statusSteps);
  // Prevent click events inside the modal from closing it
  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleViewDetails = () => {
    // Navigate to complaint details page
    if (complaintId) {
      window.location.href = `/${role}/complaint/${complaintId}`;
    }
  };
  
  return (
    <div 
      className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto relative"
        onClick={preventPropagation}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800">Complaint Progress Tracking</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="border-l-4 border-[#00ABE4] pl-4">
            <h4 className="text-md font-medium text-gray-700">Complaint ID: {complaintId || 'N/A'}</h4>
          </div>
          
          <StatusTimeline 
            steps={statusSteps}
            currentStatus={currentStatus}
            estimatedCompletionDate={estimatedCompletionDate}
          />
          
          <div className="flex justify-end space-x-3 border-t border-gray-300 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition"
            >
              Close
            </button>
            <button
              onClick={handleViewDetails}
              className="px-5 py-2 bg-[#00ABE4] hover:bg-[#0090c0] text-white rounded-md font-medium transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 