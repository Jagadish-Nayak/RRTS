import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface Supervisor {
  id: number;
  name: string;
  contactNumber: string;
}

interface SupervisorListProps {
  supervisors: Supervisor[];
  title?: string;
}

const SupervisorList = ({ supervisors, title = 'Supervisors List' }: SupervisorListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter supervisors based on search term
  const filteredSupervisors = supervisors.filter(supervisor => 
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.contactNumber.includes(searchTerm)
  );
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-medium mb-4 text-gray-700">{title}</h3>
      
      {/* Search Box */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search supervisors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                S.No
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Contact Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSupervisors.length > 0 ? (
              filteredSupervisors.map((supervisor, index) => (
                <tr 
                  key={supervisor.id} 
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                  } hover:bg-blue-100 transition-colors duration-150 ease-in-out cursor-pointer`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{supervisor.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supervisor.contactNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No supervisors found matching &quot;{searchTerm}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Total count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredSupervisors.length} of {supervisors.length} supervisors
      </div>
    </div>
  );
};

export default SupervisorList;