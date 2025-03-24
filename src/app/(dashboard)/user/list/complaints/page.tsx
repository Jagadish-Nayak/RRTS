'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaEye, FaPlus } from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import TrackStatusModal from '@/components/complaint/TrackStatusModal';
import { MdFeedback } from 'react-icons/md';

// Define types for our complaint data
interface Complaint {
  id: number;
  title: string;
  location: string;
  submissionDate: string;
  status: 'Not Inspected' | 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
  supervisor: string;
  severity: 'Low' | 'Medium' | 'High';
  estimatedEndDate: string;
}



// Generate dummy data for the complaints
const generateDummyData = (): Complaint[] => {
  const statuses: Complaint['status'][] = ['Not Inspected', 'Inspected', 'Ongoing', 'Completed', 'Rejected'];
  const severities: Complaint['severity'][] = ['Low', 'Medium', 'High'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isNotInspected = status === 'Not Inspected';
    
    return {
      id: i + 1,
      title: `Road damage complaint ${i + 1}`.length > 25 
             ? `Road damage complaint ${i + 1}`.substring(0, 22) + '...' 
             : `Road damage complaint ${i + 1}`,
      location: `Sector ${Math.floor(Math.random() * 100)}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, New Delhi`,
      submissionDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      status,
      supervisor: isNotInspected ? '' : `John Doe ${i + 1}`,
      severity: isNotInspected ? 'Low' : severities[Math.floor(Math.random() * severities.length)],
      estimatedEndDate: isNotInspected ? '' : new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    };
  });
};

export default function ComplaintsList() {
  // State for the complaints data
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // State for sorting
  const [sortField, setSortField] = useState<'submissionDate' | 'estimatedEndDate'>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // State for TrackStatusModal
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  // Initialize dummy data
  useEffect(() => {
    setComplaints(generateDummyData());
  }, []);
  
  // Handle sorting logic
  const handleSort = (field: 'submissionDate' | 'estimatedEndDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Get status color based on status value
  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'Not Inspected': return 'bg-gray-100 text-gray-800';
      case 'Inspected': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
    }
  };
  
  // Get severity color based on severity value
  const getSeverityColor = (severity: Complaint['severity']) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
    }
  };
  
  // Get location first part (before the first comma)
  const getShortLocation = (location: string) => {
    return location.split(',')[0];
  };

  // Filter and sort the complaints
  const filteredComplaints = complaints
    .filter(complaint => {
      const matchesSearch = 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter ? complaint.severity === severityFilter : true;
      const matchesStatus = statusFilter ? complaint.status === statusFilter : true;
      
      return matchesSearch && matchesSeverity && matchesStatus;
    })
    .sort((a, b) => {
      // Handle empty values for "Not Inspected" status
      if (sortField === 'estimatedEndDate') {
        if (!a.estimatedEndDate) return 1;
        if (!b.estimatedEndDate) return -1;
      }
      
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      
      if (sortDirection === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  
  // Generate pagination numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="w-full text-gray-600">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Complaints</h1>
          <Link href="/user/complaint" className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#00abe4] text-white rounded-md hover:bg-[#029dd0] transition-colors">
            <FaPlus className="mr-2" />
            Raise New Complaint
          </Link>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">What are you looking for?</label>
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
            <label htmlFor="severityFilter" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              id="severityFilter"
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
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="statusFilter"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Not Inspected">Not Inspected</option>
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
    <span className="text-sm font-medium text-gray-700">Applied Filters:</span>

    {/* Search Filter */}
    {searchTerm && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Search: {searchTerm}
        <button 
          onClick={() => setSearchTerm("")} 
          className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
        >
          ✕
        </button>
      </span>
    )}

    {/* Severity Filter */}
    {severityFilter && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Severity: {severityFilter}
        <button 
          onClick={() => setSeverityFilter("")} 
          className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
        >
          ✕
        </button>
      </span>
    )}

    {/* Status Filter */}
    {statusFilter && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Status: {statusFilter}
        <button 
          onClick={() => setStatusFilter("")} 
          className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
        >
          ✕
        </button>
      </span>
    )}
  </div>
)}

        
        {/* Complaints Table */}
        <div className="overflow-x-auto w-[84vw] md:w-[54vw] lg:min-w-full rounded-lg border border-gray-200">
          <table className="lg:min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Supervisor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('estimatedEndDate')}>
                  <div className="flex items-center">
                    Estimated End Date
                    {sortField === 'estimatedEndDate' ? (
                      sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    ) : (
                      <FaSort className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((complaint, index) => (
                  <tr key={complaint.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getShortLocation(complaint.location)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.submissionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.supervisor || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {complaint.severity !== 'Low' || complaint.status !== 'Not Inspected' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(complaint.severity)}`}>
                          {complaint.severity}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.estimatedEndDate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* View Details Button */}
                        <button 
                          className="cursor-pointer text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                          onClick={() => router.push(`/user/complaint/${complaint.id}`)}
                        >
                          <FaEye size={18} />
                        </button>

                        {/* Track Progress Button */}
                        <button
                          className="cursor-pointer text-green-600 hover:text-green-900 transition-colors ml-4"
                          title="Track Progress"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setIsTrackModalOpen(true);
                          }}
                        >
                          <GiProgression size={18} />
                        </button>

                        {/* Give Feedback Button */}
                        <button
                          className={`ml-4 transition-colors ${
                            complaint.status === "Completed"
                              ? "cursor-pointer text-amber-700 hover:text-amber-900"
                              : "cursor-not-allowed text-gray-400"
                          }`}
                          title="Give Feedback"
                          disabled={complaint.status !== "Completed"}
                          onClick={() => {if(complaint.status === 'Completed') router.push(`/user/feedback/${complaint.id}.toString()`)}}
                        >
                          <MdFeedback size={18} />
                        </button>
                      </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No complaints found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredComplaints.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
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

      {/* TrackStatusModal */}
      {isTrackModalOpen && selectedComplaint && (
        // <TrackStatusModal
        //   isOpen={isTrackModalOpen}
        //   onClose={() => setIsTrackModalOpen(false)}
        //   complaintId={selectedComplaint.id}
        //   statusSteps={[
        //     { status: 'Submitted', date: selectedComplaint.createdAt, completed: true },
        //     { status: 'Supervisor Assigned', date: selectedComplaint.assignedAt || '', completed: !!selectedComplaint.assignedAt },
        //     { status: 'Inspected', date: selectedComplaint.inspectedAt || '', completed: !!selectedComplaint.inspectedAt },
        //     { status: 'Ongoing', date: selectedComplaint.startedAt || '', completed: !!selectedComplaint.startedAt },
        //     { status: selectedComplaint.status === 'Rejected' ? 'Rejected' : 'Completed', date: selectedComplaint.completedAt || '', completed: !!selectedComplaint.completedAt }
        //   ]}
        //   currentStatus={selectedComplaint.status === 'Not Inspected' ? 'Submitted' : selectedComplaint.status}
        //   estimatedCompletionDate={selectedComplaint.estimatedCompletionDate}
        // />
        <TrackStatusModal 
        isOpen={isTrackModalOpen} 
        onClose={() => setIsTrackModalOpen(false)}
        complaintId={selectedComplaint.id.toString()}
        statusSteps={[
          { status: 'Submitted', date: '2023-07-15', completed: true },
          { status: 'Supervisor Assigned', date: '2023-07-16', completed: true },
          { status: 'Inspected', date: '2023-07-18', completed: true },
          { status: 'Ongoing', date: '2023-07-22', completed: true },
          { status: 'Completed', date: '2023-08-25', completed: true }
        ]}
        estimatedCompletionDate={selectedComplaint.estimatedEndDate}
        currentStatus={selectedComplaint.status}
      />
      )}
    </div>
  );
}
