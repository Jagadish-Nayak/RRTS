'use client';
import { useState, useEffect } from 'react';
import { FaStar, FaStarHalf, FaRegStar, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Feedback {
  id: number;
  userId: number;
  userName: string;
  userAvatar: React.ReactNode;
  complaintId: number;
  rating: number;
  feedback: string;
  date: string;

}

// Dummy data generator
const generateDummyFeedbacks = (): Feedback[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    userId: i + 100,
    userName: `User ${i + 1}`,
    userAvatar: <FaUser className="text-gray-600 h-16 w-16" />  , // You'll need to add actual avatar images
    complaintId: 1000 + i,
    rating: Math.random() * 2 + 3, // Generates ratings between 3 and 5
    feedback: `This is a feedback for complaint #${1000 + i}. The service was ${
      Math.random() > 0.5 ? 'excellent' : 'good'
    } and the issue was resolved promptly.`,
    date: new Date(2024, 0, 1 + i).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }));
};

export default function SupervisorFeedbacks() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [sortType, setSortType] = useState<'recent' | 'highRating' | 'lowRating'>('recent');
  const [focusedFeedback, setFocusedFeedback] = useState<number | null>(null);

  useEffect(() => {
    const data = generateDummyFeedbacks();
    setFeedbacks(data);
  }, []);

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    return feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;
  };

  const sortFeedbacks = (type: typeof sortType) => {
    setSortType(type);
    const sorted = [...feedbacks];
    switch (type) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'highRating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowRating':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
    }
    setFeedbacks(sorted);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      {/* Left Column - Feedback List */}
      <div className="lg:w-2/3 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {feedbacks.map((feedback, index) => (
          <div
            key={feedback.id}
            className={`p-2 rounded-lg shadow-md transition-all duration-300 ${
              focusedFeedback === feedback.id
                ? 'ring-2 ring-blue-500 transform'
                : ''
            } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            onMouseEnter={() => setFocusedFeedback(feedback.id)}
            onMouseLeave={() => setFocusedFeedback(null)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="relative w-12 h-12 bg-gray-200 flex justify-center items-center rounded-full overflow-hidden">
                  {feedback.userAvatar}
                </div>
                <p className="text-sm text-gray-500 mt-2">{feedback.date}</p>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{feedback.userName}</h3>
                  <div className="flex items-center gap-1">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
                
                <button
                  onClick={() => router.push(`/supervisor/complaint/${feedback.complaintId}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  View complaint details
                </button>
                
                <p className="mt-2 text-gray-600">{feedback.feedback}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column - Stats and Filters */}
      <div className="lg:w-1/3 bg-white mb-10 rounded-lg shadow-md p-6 h-fit sticky top-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Feedback Overview</h2>
            <div className="mt-4">
              <p className="text-4xl font-bold text-blue-600">
                {calculateAverageRating().toFixed(1)}
              </p>
              <div className="flex justify-center mt-2">
                {renderStars(calculateAverageRating())}
              </div>
              <p className="mt-2 text-gray-600">
                Based on {feedbacks.length} reviews
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Sort Reviews</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => sortFeedbacks('recent')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  sortType === 'recent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => sortFeedbacks('highRating')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  sortType === 'highRating'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Highest Rating
              </button>
              <button
                onClick={() => sortFeedbacks('lowRating')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  sortType === 'lowRating'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lowest Rating
              </button>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedbacks.filter(
                (f) => Math.floor(f.rating) === rating
              ).length;
              const percentage = (count / feedbacks.length) * 100;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center w-20">
                    <span className="text-sm text-gray-600">{rating}</span>
                    <FaStar className="text-yellow-400 ml-1" />
                  </div>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
