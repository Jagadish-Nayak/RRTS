// SupervisorCard.tsx - Redesigned supervisor profile card
import { 
    FaStar, FaStarHalfAlt, FaRegStar, FaPhone, 
    FaEnvelope, FaMapMarkerAlt, FaTasks, FaUserCircle 
  } from 'react-icons/fa';
  
  interface SupervisorProps {
    name: string;
    email: string;
    contactNumber: string;
    pincode: string;
    completedTasks: number;
    rating: number;
  }
  
  export function SupervisorCard({ 
    name, email, contactNumber, pincode, completedTasks, rating 
  }: SupervisorProps) {
    // Render rating stars
    const renderRatingStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      
      for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
          stars.push(<FaStar key={i} className="text-yellow-400" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        } else {
          stars.push(<FaRegStar key={i} className="text-yellow-400" />);
        }
      }
      
      return <div className="flex justify-center">{stars}</div>;
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Assigned Supervisor</h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <FaUserCircle className="w-full h-full text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800">{name}</h3>
          <div className="mt-2">
            {renderRatingStars(rating)}
            <span className="text-sm text-gray-600 mt-1 block text-center">{rating} / 5.0</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center py-2 border-b border-gray-200">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FaEnvelope className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-800">{email}</p>
            </div>
          </div>
          
          <div className="flex items-center py-2 border-b border-gray-200">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <FaPhone className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-800">{contactNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center py-2 border-b border-gray-200">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FaMapMarkerAlt className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pincode</p>
              <p className="text-sm font-medium text-gray-800">{pincode}</p>
            </div>
          </div>
          
          <div className="flex items-center py-2">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <FaTasks className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tasks Completed</p>
              <p className="text-sm font-medium text-gray-800">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }