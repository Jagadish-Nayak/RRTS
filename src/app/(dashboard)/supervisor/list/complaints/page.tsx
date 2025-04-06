'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaEye } from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { MdUpdate } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import TrackStatusModal from '@/components/complaint/TrackStatusModal';
import { UpdateStatusModal } from '@/components/supervisor/UpdateStatusModal';
import axios from 'axios';
import Loading from '@/components/Loading';
import { toast } from 'react-hot-toast';
interface Complaint {
  id: number;
  title: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Supervisor Assigned' | 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
  estimatedEndDate: string;
  estimatedExpense: number;
  submissionDate: string;
  statusTimeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
}

// Generate dummy data
// const generateDummyData = (): Complaint[] => {
//   const statuses: Complaint['status'][] = ['Not Inspected', 'Ongoing', 'Completed', 'Rejected'];
//   const severities: Complaint['severity'][] = ['Low', 'Medium', 'High'];
  
//   return Array.from({ length: 30 }, (_, i) => ({
//     id: i + 1,
//     userName: `User ${i + 1}`,
//     title: `Road damage complaint ${i + 1}`,
//     location: `Sector ${Math.floor(Math.random() * 100)}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, New Delhi`,
//     severity: severities[Math.floor(Math.random() * severities.length)],
//     status: statuses[Math.floor(Math.random() * statuses.length)],
//     estimatedEndDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     estimatedExpense: Math.floor(Math.random() * 50000) + 5000,
//     submissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
//   }));
// };

export default function SupervisorComplaintsList() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [sortField, setSortField] = useState<'submissionDate' | 'estimatedEndDate' | 'estimatedExpense'>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  
  const fetchComplaints = async (token: string | null) => {
    try{
      setIsLoading(true);
      const response = await axios.get('/api/supervisor/complaints',{
        headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;
    //console.log(data.complaints);
    setComplaints(data.complaints);
    setIsLoading(false);
    }catch(error){
      toast.error('Error fetching complaints');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(typeof window !== "undefined"){
      const localToken = window.localStorage.getItem('token');
      setToken(localToken);
      fetchComplaints(localToken);
    }
  }, []);

  const handleSort = (field: 'submissionDate' | 'estimatedEndDate' | 'estimatedExpense') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
    if (status === 'Not Inspected') {
      router.push('/supervisor#tasks-table');
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'Supervisor Assigned': return 'bg-gray-100 text-gray-800';
      case 'Inspected': return 'bg-gray-100 text-blue-800';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
    }
  };

  const getSeverityColor = (severity: Complaint['severity']) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
    }
  };

  const filteredComplaints = complaints
    .filter(complaint => {
      if (activeStatus === 'All') return true;
      return complaint.status === activeStatus;
    })
    .filter(complaint => {
      const searchFields = [
        complaint.title.toLowerCase(),
        complaint.location.toLowerCase(),
      ];
      return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    })
    .filter(complaint => {
      return severityFilter ? complaint.severity === severityFilter : true;
    })
    .sort((a, b) => {
      if (sortField === 'estimatedEndDate') {
        return sortDirection === 'asc' 
          ? new Date(a.estimatedEndDate).getTime() - new Date(b.estimatedEndDate).getTime()
          : new Date(b.estimatedEndDate).getTime() - new Date(a.estimatedEndDate).getTime();
      } else {
        return sortDirection === 'asc' 
          ? a.estimatedExpense - b.estimatedExpense
          : b.estimatedExpense - a.estimatedExpense;
      }
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  return (
    isLoading ? <Loading /> :
    <div className="w-full text-gray-600">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Complaints</h1>
          
          {/* Status Toggle Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', 'Not Inspected', 'Ongoing', 'Completed', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeStatus === status
                    ? 'bg-[#00abe4] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto w-[84vw] sm:w-[86vw] md:w-[54vw] lg:min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('submissionDate')}>
                  <div className="flex items-center">
                    Submission Date
                    {sortField === 'submissionDate' ? (
                      sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : (
                      <FaSort className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('estimatedEndDate')}>
                  <div className="flex items-center">
                    Est. End Date
                    {sortField === 'estimatedEndDate' ? (
                      sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : (
                      <FaSort className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('estimatedExpense')}>
                  <div className="flex items-center">
                    Est. Expense
                    {sortField === 'estimatedExpense' ? (
                      sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : (
                      <FaSort className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((complaint, index) => (
                <tr key={complaint.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(complaint.severity)}`}>
                      {complaint.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.submissionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.estimatedEndDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{complaint.estimatedExpense.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => router.push(`/supervisor/complaint/${complaint.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye size={18} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsTrackModalOpen(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Track Status"
                      >
                        <GiProgression size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsUpdateModalOpen(true);
                        }}
                        disabled={['Completed', 'Rejected'].includes(complaint.status)}
                        className={`text-yellow-600 hover:text-yellow-900 ${
                          ['Completed', 'Rejected'].includes(complaint.status)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        title="Update Status"
                      >
                        <MdUpdate size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredComplaints.length)} of {filteredComplaints.length} results
          </div>
          
          <nav className="relative z-0 inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Modals */}
      {selectedComplaint && (
        <>
          <TrackStatusModal 
            role="supervisor"
            isOpen={isTrackModalOpen}
            onClose={() => setIsTrackModalOpen(false)}
            complaintId={selectedComplaint.title}
            statusSteps={selectedComplaint.statusTimeline}
            currentStatus={selectedComplaint.status}
          />

          <UpdateStatusModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            complaintId={selectedComplaint.id.toString()}
            currentStatus={selectedComplaint.status}
            complaintSeverity={selectedComplaint.severity}
            estend={selectedComplaint.estimatedEndDate}
            estexp={selectedComplaint.estimatedExpense.toString()}
            onSuccess ={() => token && fetchComplaints(token)}
          />
        </>
      )}
    </div>
  );
}
