import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
  currentStatus: string;
  complaintSeverity: string;
  onStatusUpdate: () => void;
}

type Status = 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
type Severity = 'High' | 'Medium' | 'Low';

export function UpdateStatusModal({ 
  isOpen, 
  onClose, 
  complaintId, 
  currentStatus,
  complaintSeverity,
  onStatusUpdate 
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Status>('Inspected');
  const [severity, setSeverity] = useState<Severity>(complaintSeverity as Severity);
  const [estimatedEndDate, setEstimatedEndDate] = useState('');
  const [estimatedExpense, setEstimatedExpense] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;

  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getAvailableStatuses = (): Status[] => {
    switch (currentStatus) {
      case 'Supervisor Assigned':
        return ['Inspected', 'Rejected'];
      case 'Inspected':
        return ['Ongoing', 'Rejected'];
      case 'Ongoing':
        return ['Completed', 'Rejected'];
      default:
        return ['Inspected', 'Ongoing', 'Completed', 'Rejected'];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please provide an update message');
      return;
    }

    if (message.split(' ').length > 30) {
      toast.error('Message should not exceed 30 words');
      return;
    }

    setIsSubmitting(true);
    try {
      //Replace with your actual API endpoint
      await axios.post(`/api/complaints/${complaintId}/status`, {
        status: selectedStatus,
        message
      });
      
      toast.success('Status updated successfully');
      onStatusUpdate();
      onClose();
    } catch (error: unknown) {
        let errorMessage = 'Failed to update status';
        
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl text-gray-700 w-full max-w-md mx-4"
        onClick={preventPropagation}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Update Status</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
    <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
      {currentStatus || 'Not Inspected'}
    </div>
  </div>

  <div className="mb-4 md:flex md:gap-4">
    <div className="md:flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as Status)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {getAvailableStatuses().map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
    
    {currentStatus === 'Supervisor Assigned' && (
      <div className="md:flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['High', 'Medium', 'Low'].map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
    )}
  </div>

  <div className="mb-4 md:flex md:gap-4">
    <div className="md:flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated End Date</label>
      <input
        type="date"
        value={estimatedEndDate}
        onChange={(e) => setEstimatedEndDate(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        min={new Date().toISOString().split('T')[0]}
      />
    </div>
    <div className="md:flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Expense</label>
      <input
        type="number"
        value={estimatedExpense}
        onChange={(e) => setEstimatedExpense(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter estimated cost"
      />
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Update Message (max 30 words)</label>
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={3}
      placeholder="Enter update message..."
    />
  </div>

  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
    >
      {isSubmitting ? 'Updating...' : 'Update Status'}
    </button>
  </div>
</form>

      </div>
    </div>
  );
}