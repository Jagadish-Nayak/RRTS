'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaEye } from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import TrackStatusModal from '@/components/complaint/TrackStatusModal';

// Define types for complaint data
interface Complaint {
  id: number;
  userName: string;
  title: string;
  submissionDate: string;
  pincode: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Not Assigned' | 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
  supervisorId: string;
}

// Generate dummy data
const generateDummyData = (): Complaint[] => {
  const statuses: Complaint['status'][] = ['Not Assigned', 'Inspected', 'Ongoing', 'Completed', 'Rejected'];
  const severities: Complaint['severity'][] = ['Low', 'Medium', 'High'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isNotAssigned = status === 'Not Assigned';
    
    return {
      id: i + 1,
      userName: `User ${i + 1}`,
      title: `Road damage complaint ${i + 1}`.length > 25 
             ? `Road damage complaint ${i + 1}`.substring(0, 22) + '...' 
             : `Road damage complaint ${i + 1}`,
      submissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      pincode: `11${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      location: `Sector ${Math.floor(Math.random() * 100)}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, New Delhi`,
      severity: severities[Math.floor(Math.random() * severities.length)],
      status,
      supervisorId: isNotAssigned ? '' : `SUP${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`
    };
  });
};

export default function AdminComplaintsList() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Not Assigned');
  const [sortField, setSortField] = useState<'submissionDate'>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showAllRequests, setShowAllRequests] = useState(false);

  useEffect(() => {
    setComplaints(generateDummyData());
  }, []);

  const handleSort = (field: 'submissionDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'Not Assigned': return 'bg-gray-100 text-gray-800';
      case 'Inspected': return 'bg-blue-100 text-blue-800';
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

  const getShortLocation = (location: string) => {
    return location.split(',')[0];
  };

//   const handleAssignSupervisor = (complaintId: number) => {
//     // Implement supervisor assignment logic
//     console.log('Assigning supervisor to complaint:', complaintId);
//   };

  const filteredComplaints = complaints
    .filter(complaint => {
      if (!showAllRequests && !statusFilter) return true;
      return statusFilter ? complaint.status === statusFilter : true;
    })
    .filter(complaint => {
      const matchesSearch = 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.pincode.includes(searchTerm) ||
        complaint.supervisorId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter ? complaint.severity === severityFilter : true;
      
      return matchesSearch && matchesSeverity;
    })
    .sort((a, b) => {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      
      return sortDirection === 'asc' 
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full text-gray-600">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Complaints Management</h1>
          <button
            onClick={() => {
              setShowAllRequests(!showAllRequests);
              setStatusFilter(showAllRequests ? 'Not Assigned' : '');
            }}
            className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#00abe4] text-white rounded-md hover:bg-[#029dd0] transition-colors"
          >
            {showAllRequests ? 'Show New Requests' : 'Show All Requests'}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Not Assigned">Not Assigned</option>
              <option value="Inspected">Inspected</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applied Filters */}
        {(searchTerm || severityFilter || statusFilter) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* ... Applied filters code similar to user complaints page ... */}
          </div>
        )}

        {/* Complaints Table */}
        <div className="overflow-x-auto w-[84vw] sm:w-[86vw] md:w-[54vw] lg:min-w-full rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('submissionDate')}>
                  <div className="flex items-center">
                    Submission Date
                    {sortField === 'submissionDate' ? (
                      sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : (
                      <FaSort className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pincode
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((complaint, index) => (
                <tr key={complaint.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.submissionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.pincode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getShortLocation(complaint.location)}
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
                    {complaint.supervisorId || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details or Assign Supervisor"
                        onClick={() => router.push(`/admin/complaint/${complaint.id}`)}
                      >
                        <FaEye size={18} />
                      </button>

                      <button
                        className="text-green-600 hover:text-blue-900"
                        title="Track Status"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsTrackModalOpen(true);
                        }}
                      >
                        <GiProgression size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredComplaints.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            {/* ... Pagination code similar to user complaints page ... */}
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {indexOfLastItem > filteredComplaints.length ? filteredComplaints.length : indexOfLastItem}
              </span>{' '}
              of <span className="font-medium">{filteredComplaints.length}</span> results
            </div>
            
            <nav className="relative z-0 inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === number
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Track Status Modal */}
      {isTrackModalOpen && selectedComplaint && (
        <TrackStatusModal 
          isOpen={isTrackModalOpen}
          onClose={() => setIsTrackModalOpen(false)}
          complaintId={selectedComplaint.id.toString()}
          statusSteps={[
            { status: 'Submitted', date: selectedComplaint.submissionDate, completed: true },
            { status: 'Supervisor Assigned', date: '', completed: !!selectedComplaint.supervisorId },
            { status: 'Inspected', date: '', completed: selectedComplaint.status === 'Inspected' },
            { status: 'Ongoing', date: '', completed: selectedComplaint.status === 'Ongoing' },
            { status: selectedComplaint.status === 'Rejected' ? 'Rejected' : 'Completed', 
              date: '', 
              completed: selectedComplaint.status === 'Completed' || selectedComplaint.status === 'Rejected' }
          ]}
          currentStatus={selectedComplaint.status}
        />
      )}
    </div>
  );
}
