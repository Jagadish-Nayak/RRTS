'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaEye, FaTrash, FaPlus, FaUserTie } from 'react-icons/fa';
import CreateSupervisorModal from '@/components/supervisor/CreateSupervisorModal';
import SupervisorDeletionModal from '@/components/supervisor/SupervisorDeletionModal';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loading from '@/components/Loading';
// Define types for supervisor data

interface Supervisor {
  id: string;
  name: string;
  contact: string;
  pincode: string;
  tasksCompleted: number;
  pendingTasks: number;
  rating: number;
  age: number;
}


export default function SupervisorsList() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Supervisor;
    direction: 'asc' | 'desc';
  }>({ key: 'id', direction: 'asc' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const fetchSupervisors = async (token: string | null) => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/admin/supervisors/getall', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.data;
      //console.log(data);
      setSupervisors(data.supervisors);
      setIsLoading(false);
    } catch (error) {
      toast.error('Error fetching supervisors');
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  // Initialize dummy data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localToken = window.localStorage.getItem('token');
      setToken(localToken);
      fetchSupervisors(localToken);
    }
  }, []);

  // Handle sorting
  const handleSort = (key: keyof Supervisor) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort supervisors
  const filteredSupervisors = supervisors
    .filter(supervisor => {
      return (
        supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisor.contact.toString().includes(searchTerm) ||
        supervisor.pincode.toString().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const key = sortConfig.key;
      if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSupervisors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSupervisors.length / itemsPerPage);

  // Generate pagination numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Add this function to handle successful supervisor creation
  // const handleSupervisorCreated = () => {
  //   // Refresh the supervisors list
  //   //setSupervisors(generateDummyData()); // Replace with actual API call
  // };

  return (
    isLoading ? <Loading /> :
    <div className="w-full text-gray-600">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center">
            <FaUserTie className="text-blue-500 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Supervisors List</h1>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#00ABE4] text-white rounded-md hover:bg-[#029dd0] transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Supervisor
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search supervisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Supervisors Table */}
        <div className="overflow-x-auto w-[84vw] md:w-[58vw] lg:min-w-full rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'id', label: 'Supervisor ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'age', label: 'Age' },
                  { key: 'contact', label: 'Contact' },
                  { key: 'pincode', label: 'Pincode' },
                  { key: 'tasksCompleted', label: 'Completed\n Tasks' },
                  { key: 'pendingTasks', label: 'Pending\n Tasks' },
                  { key: 'rating', label: 'Rating' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(key as keyof Supervisor)}
                  >
                    <div className="flex items-center">
                      {label}
                      {sortConfig.key === key ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((supervisor, index) => (
                <tr key={supervisor.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supervisor.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supervisor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supervisor.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supervisor.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supervisor.pincode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supervisor.tasksCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supervisor.pendingTasks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className={`inline-block w-8 text-center ${
                        supervisor.rating >= 4 ? 'text-green-600' :
                        supervisor.rating >= 3 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {supervisor.rating === null ? 0 : supervisor.rating}
                      </span>
                      <span className="text-yellow-400 ml-1">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-6">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <FaEye size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete" onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedSupervisorId(supervisor.id);
                      }}>
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSupervisors.length)} of {filteredSupervisors.length} entries
          </div>
          <div className="flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add the CreateSupervisorModal */}
      <CreateSupervisorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        token={token || ''}
        onSuccess={() => token && fetchSupervisors(token)}
      />
      <SupervisorDeletionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        supervisorId={selectedSupervisorId || ''}
        token={token || ''}
        onSuccess={() => token && fetchSupervisors(token)}
      />
    </div>
  );
}
