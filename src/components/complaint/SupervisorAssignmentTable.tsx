import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loading from '../Loading';
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
  complaintId: string;
  title: string;
  onAssignmentComplete: () => void;
}

export function SupervisorAssignmentTable({ pincode, title ,complaintId, onAssignmentComplete }: SupervisorAssignmentTableProps) {
  //console.log(pincode, complaintId);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Dummy data - replace with API call
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const token = localStorage.getItem('token');
        setIsLoading(true);
        const response = await axios.get(`/api/admin/supervisors/findpin?pincode=${pincode}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.data;
        setSupervisors(data.supervisors);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        toast.error('Error fetching supervisors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupervisors();
  }, []);

  // const supervisors: Supervisor[] = [
  //   { id: 'SUP001', name: 'John Doe', phone: '9876543210', completedTasks: 45, pendingTasks: 2, rating: 4.5, age: 35 },
  //   { id: 'SUP002', name: 'Jane Smith', phone: '9876543211', completedTasks: 38, pendingTasks: 3, rating: 4.2, age: 32 },
  //   { id: 'SUP003', name: 'Mike Johnson', phone: '9876543212', completedTasks: 52, pendingTasks: 1, rating: 4.8, age: 40 },
  //   { id: 'SUP004', name: 'John Doe', phone: '9876543210', completedTasks: 45, pendingTasks: 2, rating: 4.5, age: 35 },
  //   { id: 'SUP005', name: 'Jane Smith', phone: '9876543211', completedTasks: 38, pendingTasks: 3, rating: 4.2, age: 32 },
  //   { id: 'SUP006', name: 'Mike Johnson', phone: '9876543212', completedTasks: 52, pendingTasks: 0, rating: 4.8, age: 40 },
  //   { id: 'SUP007', name: 'John Doe', phone: '9876543210', completedTasks: 45, pendingTasks: 2, rating: 4.5, age: 35 },
  //   { id: 'SUP008', name: 'Jane Smith', phone: '9876543211', completedTasks: 38, pendingTasks: 5, rating: 4.2, age: 32 },
  //   { id: 'SUP009', name: 'Mike Johnson', phone: '9876543212', completedTasks: 52, pendingTasks: 8, rating: 4.8, age: 40 },
  // ].sort((a, b) => a.pendingTasks - b.pendingTasks);

  const handleAssignSupervisor = async () => {
    if (!selectedSupervisor) {
      toast.error('Please select a supervisor');
      return;
    }
    try {
      setIsAssigning(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/admin/supervisors/assign`, {
        complaintId,
        supervisorId: selectedSupervisor,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.data;
    if (data.success) {
      toast.success('Supervisor assigned successfully');
      onAssignmentComplete();
    }
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      toast.error('Failed to assign supervisor');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    isLoading ? <Loading /> :
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Supervisors in {pincode} for complaint {title}</h2>
      <div className="overflow-x-auto w-[73vw] sm:w-[80vw] md:w-[50vw] lg:min-w-full ">
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
            {supervisors.map((supervisor, index) => (
              <tr key={supervisor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                      supervisor.rating >= 4.5 ? 'text-green-600' :
                      supervisor.rating >= 4.0 ? 'text-yellow-600' :
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
            onClick={handleAssignSupervisor}
            disabled={isAssigning}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isAssigning ? 'Assigning...' : 'Assign Supervisor'}
          </button>
        </div>
      )}
    </div>
  );
} 