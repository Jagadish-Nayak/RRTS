import { FaEdit, FaImages } from 'react-icons/fa';
import { useState } from 'react';
import { ImageGalleryModal } from './ImageGalleryModal';
import { UpdateStatusModal } from './UpdateStatusModal';

interface Task {
  id: string;
  userName: string;
  phone: string;
  title: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  images: string[];
}


interface NewTasksTableProps {
  tasks: Task[];
  onSuccess: () => void;
}

export function NewTasksTable({ tasks, onSuccess }: NewTasksTableProps) {
  //console.log(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const getSeverityColor = (severity: Task['severity']) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <>
      <div className="bg-white text-gray-600 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">New Tasks</h3>
        {tasks.length === 0 ? (
  <div className="text-center text-gray-500 py-8">No New Complaint Assigned</div>
) :(
        <div className="overflow-x-auto w-[80vw] md:w-[50vw] lg:w-max">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['User Name', 'Phone', 'Title', 'Location', 'Severity', 'Actions'].map(header => (
                  <th
                    key={header}
                    className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task, index) => (
                <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.userName}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.phone}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.location}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(task.severity)}`}>
                      {task.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowImageModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Images"
                      >
                        <FaImages size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowStatusModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Update Status"
                      >
                        <FaEdit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      {/* Modals */}
      {selectedTask && (
        <>
          <ImageGalleryModal
            isOpen={showImageModal}
            onClose={() => setShowImageModal(false)}
            images={selectedTask.images}
            complaintTitle={selectedTask.title}
          />
          
          <UpdateStatusModal
            isOpen={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            complaintId={selectedTask.id}
            complaintSeverity={selectedTask.severity}
            currentStatus="Not Inspected"
            onSuccess={onSuccess}
          />
        </>
      )}
    </>
  );
} 