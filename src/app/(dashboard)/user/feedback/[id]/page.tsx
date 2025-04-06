

'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Loading';

interface Complaint {
  _id: string;
  title: string;
  estimatedEndTime: string;
  status: "Completed";
}

export default function FeedbackPage() {
  const router = useRouter();
  const { id: complaintId } = useParams();

  const [completedComplaints, setCompletedComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [hasCompletedComplaints, setHasCompletedComplaints] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/feedback', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        setCompletedComplaints(response.data.data);
        setHasCompletedComplaints(response.data.data.length > 0);
        //(response.data.data);
        if (complaintId && response.data.data.some((c: Complaint) => c._id === complaintId)) {
          setSelectedComplaint(complaintId as string);
        } else if (response.data.data.length > 0) {
          setSelectedComplaint(response.data.data[0]._id);
          router.push(`/user/feedback/${response.data.data[0]._id}`);
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
        toast.error('Error fetching complaints');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, [complaintId, router]);

  const handleComplaintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newComplaintId = e.target.value;
    setSelectedComplaint(newComplaintId);
    router.push(`/user/feedback/${newComplaintId}`);
  };

  const handleViewDetails = () => {
    router.push(`/user/complaint/${selectedComplaint}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedComplaint || !rating || !feedback){
      toast.error('All fields are required');
      return;
    }
    try {
      toast.loading('Submitting feedback...');
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/feedback', {
        complaintId: selectedComplaint,
        rating,
        message: feedback,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      //console.log(response.data);
      if(response.data.success){
        toast.dismiss();
        toast.success('Feedback submitted successfully');
        router.push(`/user/complaint/${selectedComplaint}`);
      }else{
        toast.dismiss();
        toast.error('Error submitting feedback');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.dismiss();
      toast.error('Error submitting feedback');
    }
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
    isLoading ?  <Loading/> :
    <div className="max-h-screen text-gray-700 bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Provide Feedback</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {completedComplaints.map((complaint: Complaint) => (
                <option key={complaint._id} value={complaint._id}>
                  {complaint.title} - {new Date(complaint.estimatedEndTime).toLocaleString().split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience</label>
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

          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
            <textarea
              id="feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please share your experience..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleViewDetails}
              className="w-full md:w-auto px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View Details
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}