'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

// Dummy data for completed complaints without feedback
const dummyCompletedComplaints = [
  { id: '1', title: 'Water Supply Issue', status: 'Completed', date: '2024-03-15' },
  { id: '2', title: 'Street Light Repair', status: 'Completed', date: '2024-03-10' },
  { id: '3', title: 'Road Maintenance', status: 'Completed', date: '2024-03-05' },
];

export default function FeedbackPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedComplaint, setSelectedComplaint] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [hasCompletedComplaints, setHasCompletedComplaints] = useState<boolean>(true);

  useEffect(() => {
    // Check if there are completed complaints
    setHasCompletedComplaints(dummyCompletedComplaints.length > 0);
    
    // Set initial complaint from URL if available
    const complaintId = pathname.split('/').pop();
    if (complaintId && dummyCompletedComplaints.some(c => c.id === complaintId)) {
      setSelectedComplaint(complaintId);
    } else if (dummyCompletedComplaints.length > 0) {
      setSelectedComplaint(dummyCompletedComplaints[0].id);
      router.push(`/user/feedback/${dummyCompletedComplaints[0].id}`);
    }
  }, [pathname]);

  const handleComplaintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newComplaintId = e.target.value;
    setSelectedComplaint(newComplaintId);
    router.push(`/user/feedback/${newComplaintId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      complaintId: selectedComplaint,
      rating,
      feedback
    });
    // Here you would typically handle the form submission
  };

  if (!hasCompletedComplaints) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Feedback</h2>
          <p className="text-gray-600">No completed complaints available for feedback.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen  text-gray-700 bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Provide Feedback</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complaint Selection */}
          <div>
            <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-2">
              Select Complaint
            </label>
            <select
              id="complaint"
              value={selectedComplaint}
              onChange={handleComplaintChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {dummyCompletedComplaints.map((complaint) => (
                <option key={complaint.id} value={complaint.id}>
                  {complaint.title} - {complaint.date}
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate your experience
            </label>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="cursor-pointer transition-colors"
                    size={24}
                    color={(hover || rating) >= ratingValue ? "#ffc107" : "#d1d5dc"}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                );
              })}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please share your experience..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
} 