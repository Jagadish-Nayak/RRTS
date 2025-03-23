import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;
  const handleLogout = async () => {
    try {
      try {
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Error during logout API call:', error);
      }
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      onClose();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Prevent click events inside the modal from closing it
  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    
    <div 
      className="fixed inset-0 backdrop-blur-xs  z-50 flex items-center justify-center"
      onClick={onClose}
    >
      
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={preventPropagation}
      >
        
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Logout Confirmation</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg mb-6">Are you sure you want to logout?</p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-[#00ABE4] hover:bg-[#0090c0] text-white rounded-md font-medium transition-colors"
            >
              I&apos;m Sure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 