import { useState } from 'react';

interface Supervisor {
  id: string;
  name: string;
  phone: string;
  completedTasks: number;
  pendingTasks: number;
  rating: number;
  age: number;
}

interface SupervisorAssignmentTableProps {
  pincode: string;
  onAssign: (supervisorId: string) => void;
}

export function SupervisorAssignmentTable({ pincode, onAssign }: SupervisorAssignmentTableProps) {
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('');
  
  // Dummy data - replace with API call
  const supervisors: Supervisor[] = [
    {
      id: 'SUP001',
      name: 'John Smith',
      phone: '+91 9876543210',
      completedTasks: 45,
      pendingTasks: 2,
      rating: 4.5,
      age: 32
    },
    {
      id: 'SUP002',
      name: 'Jane Doe',
      phone: '+91 9876543211',
      completedTasks: 38,
      pendingTasks: 3,
      rating: 4.8,
      age: 29
    },
    // Add more dummy data...
  ].sort((a, b) => a.pendingTasks - b.pendingTasks);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Available Supervisors in {pincode}</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supervisor ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed Tasks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending Tasks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supervisors.map((supervisor) => (
              <tr key={supervisor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="radio"
                    name="supervisor"
                    value={supervisor.id}
                    checked={selectedSupervisor === supervisor.id}
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {supervisor.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {supervisor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {supervisor.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {supervisor.completedTasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {supervisor.pendingTasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${
                      supervisor.rating >= 4 ? 'text-green-600' :
                      supervisor.rating >= 3 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {supervisor.rating}
                    </span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {supervisor.age}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSupervisor && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onAssign(selectedSupervisor)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Assign Selected Supervisor
          </button>
        </div>
      )}
    </div>
  );
}