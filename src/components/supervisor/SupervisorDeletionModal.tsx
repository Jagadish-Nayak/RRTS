
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface SupervisorDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  supervisorId: string;
  onSuccess: () => void;
  token: string;
}

export default function SupervisorDeletionModal({
  isOpen,
  onClose,
  supervisorId,
  token,
  onSuccess,
}: SupervisorDeletionModalProps) {
  

  if (!isOpen) return null;

  const handleDeleteSupervisor = async () => {
    try {
      toast.loading('Deleting Supervisor...');
      const response = await axios.delete(`/api/supervisor/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { supervisorId },
      });
      toast.dismiss();
      if (response.data.success) {
        toast.success('Supervisor deleted successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to delete supervisor');
      }
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      toast.error('An error occurred while deleting the supervisor');
    }
  };

  // Prevent click events inside the modal from closing it
  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={preventPropagation}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">Delete Supervisor</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg mb-6">
            Are you sure you want to delete this supervisor {supervisorId}?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSupervisor}
              className="px-5 cursor-pointer py-2 bg-[#00ABE4] hover:bg-[#0090c0] text-white rounded-md font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
