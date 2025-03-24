// StatusUpdatesList.tsx - Component for status updates
interface StatusUpdate {
    id: number;
    date: string;
    message: string;
    status: string;
  }
  
  interface StatusUpdatesListProps {
    updates: StatusUpdate[];
  }
  
  export function StatusUpdatesList({ updates }: StatusUpdatesListProps) {
    // Get status color
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Submitted': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Supervisor Assigned': return 'bg-purple-100 text-purple-800 border-purple-300';
        case 'Inspected': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
        case 'Ongoing': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Completed': return 'bg-green-100 text-green-800 border-green-300';
        case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Updates</h2>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {updates.length > 0 ? (
            [...updates].reverse().map((update, index) => (
              <div 
                key={update.id}
                className={`p-3 rounded-lg ${
                  index % 2 === 0 
                    ? 'bg-blue-50 border-l-4 border-blue-200' 
                    : 'bg-purple-50 border-l-4 border-purple-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`px-2 py-0.5 rounded-md text-xs font-medium mb-1 ${getStatusColor(update.status)}`}>
                    {update.status}
                  </div>
                  <span className="text-xs text-gray-500">{update.date}</span>
                </div>
                <p className="text-sm text-gray-700">{update.message}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-100 text-gray-600 p-4 rounded-md text-center">
              No status updates available
            </div>
          )}
        </div>
      </div>
    );
  }


