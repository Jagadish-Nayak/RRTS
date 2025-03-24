// StatusTimeline.tsx - Component for status tracking with icons
import { 
    FaClipboardCheck, FaUserCog, FaSearchLocation, 
    FaTools, FaCheckCircle, FaTimesCircle 
  } from 'react-icons/fa';
  
  interface StatusStep {
    status: string;
    date: string;
    completed: boolean;
  }
  
  interface StatusTimelineProps {
    steps: StatusStep[];
    estimatedCompletionDate?: string;
    currentStatus: string;
  }
  
  export function StatusTimeline({ steps, estimatedCompletionDate, currentStatus }: StatusTimelineProps) {
    // Get status icon based on status name
    const getStatusIcon = (status: string, completed: boolean) => {
      const iconSize = "h-4 md:h-6 w-4 md:w-6";
      const activeColor = completed ? "text-white" : "text-gray-400";
      
      switch (status) {
        case 'Submitted':
          return <FaClipboardCheck className={`${iconSize} ${activeColor}`} />;
        case 'Supervisor Assigned':
          return <FaUserCog className={`${iconSize} ${activeColor}`} />;
        case 'Inspected':
          return <FaSearchLocation className={`${iconSize} ${activeColor}`} />;
        case 'Ongoing':
          return <FaTools className={`${iconSize} ${activeColor}`} />;
        case 'Completed':
          return <FaCheckCircle className={`${iconSize} ${activeColor}`} />;
        case 'Rejected':
          return <FaTimesCircle className={`${iconSize} ${activeColor}`} />;
        default:
          return <FaClipboardCheck className={`${iconSize} ${activeColor}`} />;
      }
    };
    
    // Find the index of the current status
    const currentIndex = steps.findIndex(step => step.status === currentStatus);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaint Status</h2>
        
        {estimatedCompletionDate && (
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md mb-6">
            <p className="font-medium">Estimated Completion Date: {estimatedCompletionDate}</p>
          </div>
        )}
        
        {/* Status Timeline */}
        <div className="relative mt-8 mb-4">
          {/* Timeline Track */}
          <div className="absolute top-[20px] md:top-8 left-0 w-full h-1 bg-gray-200">
            {/* Progress bar */}
            <div 
              className="h-full bg-green-500" 
              style={{ 
                width: `${currentIndex >= 0 
                  ? (currentIndex / (steps.length - 1)) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
          
          {/* Timeline Nodes */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = index <= currentIndex;
              const isRejected = step.status === 'Rejected' && isActive;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Status Node */}
                  <div 
                    className={`md:w-16 md:h-16 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      isActive 
                        ? isRejected
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white' 
                        : 'bg-white border-2 border-gray-300'
                    }`}
                  >
                    {getStatusIcon(step.status, isActive)}
                  </div>
                  
                  {/* Status Label */}
                  <div className="mt-3 text-center">
                    <p className={`md:text-sm  text-[12px] font-medium ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                      {step.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {step.completed ? step.date : (
                        index === steps.length - 1 && estimatedCompletionDate ? 'Estimated' : ''
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
