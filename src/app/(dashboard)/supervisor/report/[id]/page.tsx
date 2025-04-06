'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Loading';

interface Complaint {
  _id: string;
  title: string;
  location: string;
  submissionDate: string;
  estimatedEndTime: string;
}

interface CostBreakdown {
  materials: number;
  labor: number;
  equipment: number;
  miscellaneous: number;
}


interface ReportForm {
  totalDaysInvested: number;
  totalWorkers: number;
  costBreakdown: CostBreakdown;
  notes: string;
}

export default function ReportGenerationPage() {
  const router = useRouter();
  const { id: complaintId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reportlessComplaints, setReportlessComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');
  const [hasReportlessComplaints, setHasReportlessComplaints] = useState<boolean>(true);
  
  const [formData, setFormData] = useState<ReportForm>({
    totalDaysInvested: 0,
    totalWorkers: 0,
    costBreakdown: {
      materials: 0,
      labor: 0,
      equipment: 0,
      miscellaneous: 0
    },
    notes: ''
  });

  useEffect(() => {
    const fetchReportlessComplaints = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/supervisor/report', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const data: Complaint[] = response.data.data;
          setReportlessComplaints(data);
          setHasReportlessComplaints(data.length > 0);
        
          const currentComplaint = data.find((c) => c._id === complaintId);
        
          if (complaintId && currentComplaint) {
            setSelectedComplaintId(complaintId as string);
            setComplaint(currentComplaint);
            console.log(currentComplaint);
          } else if (data.length > 0) {
            setSelectedComplaintId(data[0]._id);
            router.push(`/supervisor/report/${data[0]._id}`);
            setComplaint(data[0]);
            console.log(data[0]);
          }
        }
         else {
          toast.error('Failed to fetch reportless complaints');
        }
      } catch (error) {
        console.error('Error fetching reportless complaints:', error);
        toast.error('Error fetching reportless complaints');
      }finally{
        setIsLoading(false);
      }
    };

    fetchReportlessComplaints();
  }, [complaintId, router]);

  const handleComplaintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newComplaintId = e.target.value;
    setSelectedComplaintId(newComplaintId);
    router.push(`/supervisor/report/${newComplaintId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('cost.')) {
      const costType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        costBreakdown: {
          ...prev.costBreakdown,
          [costType]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'notes' ? value : (parseFloat(value) || 0)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/supervisor/report', {
        complaintId: selectedComplaintId,
        ...formData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Report submitted successfully');
        router.push('/supervisor');
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Error submitting report');
    }
  };

  if (isLoading) return <Loading />;

  if (!hasReportlessComplaints) {
    return (
      <div className="max-h-screen text-gray-600 bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Complaints Available</h2>
            <p className="text-gray-600 mb-6">There are no completed complaints without reports at this time.</p>
            <button 
              onClick={() => router.push('/supervisor/list/complaints')}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300"
            >
              Return to Complaints
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-600 bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Construction Report</h1>
        <p className="text-gray-500 mb-8">Create a detailed report of the completed construction work</p>
        
        {/* Complaint Selection Dropdown */}
        <div className="mb-8">
          <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-2">
            Select Completed Complaint
          </label>
          <select
            id="complaint"
            value={selectedComplaintId}
            onChange={handleComplaintChange}
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {reportlessComplaints.map((complaint) => (
              <option key={complaint._id} value={complaint._id}>
                {complaint.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Complaint Details Card */}
        {complaint && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Complaint Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="text-lg font-medium text-gray-800">{complaint?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg font-medium text-gray-800">{complaint?.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submission Date</p>
                <p className="text-gray-800">{new Date(complaint?.submissionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Date</p>
                <p className="text-gray-800">{new Date(complaint?.estimatedEndTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Time and Workers - Card Style */}
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Resource Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Days Invested
                </label>
                <input
                  type="text"
                  name="totalDaysInvested"
                  value={formData.totalDaysInvested}
                  onChange={handleInputChange}
                  min="0"
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Workers
                </label>
                <input
                  type="text"
                  name="totalWorkers"
                  value={formData.totalWorkers}
                  onChange={handleInputChange}
                  min="0"
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cost Breakdown - Card Style */}
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Cost Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                  <input
                    type="text"
                    name="cost.materials"
                    value={formData.costBreakdown.materials}
                    onChange={handleInputChange}
                    min="0"
                    className="block w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labor Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                  <input
                    type="text"
                    name="cost.labor"
                    value={formData.costBreakdown.labor}
                    onChange={handleInputChange}
                    min="0"
                    className="block w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                  <input
                    type="text"
                    name="cost.equipment"
                    value={formData.costBreakdown.equipment}
                    onChange={handleInputChange}
                    min="0"
                    className="block w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miscellaneous Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                  <input
                    type="text"
                    name="cost.miscellaneous"
                    value={formData.costBreakdown.miscellaneous}
                    onChange={handleInputChange}
                    min="0"
                    className="block w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Total Cost Display */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
              <p className="text-lg font-semibold text-blue-800">
                Total Cost: <span className="text-xl">₹{Object.values(formData.costBreakdown).reduce((a, b) => a + b, 0).toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Notes - Card Style */}
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Notes</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Add any additional notes about the construction work, challenges faced, or special considerations..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
            >
              Submit Construction Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}