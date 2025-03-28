

// // ComplaintDetailsCard.tsx - Component for complaint details
// import { ReactNode } from 'react';

// interface StatusBadgeProps {
//   type: 'severity' | 'status';
//   value: string;
// }

// function StatusBadge({ type, value }: StatusBadgeProps) {
//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case 'Low': return 'bg-green-100 text-green-800 border border-green-200';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
//       case 'High': return 'bg-red-100 text-red-800 border border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border border-gray-200';
//     }
//   };
  
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Submitted': return 'bg-blue-100 text-blue-800 border border-blue-200';
//       case 'Supervisor Assigned': return 'bg-purple-100 text-purple-800 border border-purple-200';
//       case 'Inspected': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
//       case 'Ongoing': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
//       case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
//       case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border border-gray-200';
//     }
//   };
  
//   return (
//     <span className={`px-2 py-1 rounded-md text-xs font-medium ${type === 'severity' ? getSeverityColor(value) : getStatusColor(value)}`}>
//       {value}
//     </span>
//   );
// }

// interface DetailItemProps {
//   label: string;
//   children: ReactNode;
// }

// function DetailItem({ label, children }: DetailItemProps) {
//   return (
//     <div>
//       <h3 className="text-sm font-medium text-gray-500">{label}</h3>
//       <div className="text-gray-800">{children}</div>
//     </div>
//   );
// }

// interface ComplaintDetailsCardProps {
//   title: string;
//   description: string;
//   location: string;
//   pincode: string;
//   severity: string;
//   status: string;
//   submissionDate: string;
//   estimatedExpense: string;
//   stars: number;
//   message: string;
// }

// export function ComplaintDetailsCard({ 
//   title, description, location, pincode, severity, status, submissionDate, estimatedExpense, stars, message 
// }: ComplaintDetailsCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-5 h-full">
//       <div className="flex flex-col h-full">
//         <div className="mb-4 border-b pb-3">
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{title}</h1>
//           <div className="flex flex-wrap gap-2 mb-1">
//             <StatusBadge type="severity" value={severity} />
//             <StatusBadge type="status" value={status} />
//           </div>
//           <p className="text-sm text-gray-500">Submitted on <span className="font-medium">{submissionDate}</span></p>
//         </div>
        
//         <div className="space-y-4 flex-grow">
//           <DetailItem label="Description">
//             <p className="text-sm">{description}</p>
//           </DetailItem>
          
//           <DetailItem label="Location">
//             <p className="text-sm">{location}</p>
//           </DetailItem>
          
//           <div className="flex flex-wrap gap-6 mt-auto">
//             <DetailItem label="Pincode">
//               <p className="text-sm">{pincode}</p>
//             </DetailItem>
            
//             <DetailItem label="Severity">
//               <StatusBadge type="severity" value={severity} />
//             </DetailItem>
            
//             <DetailItem label="Status">
//               <StatusBadge type="status" value={status} />
//             </DetailItem>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// ComplaintDetailsCard.tsx - Component for complaint details
import { ReactNode } from 'react';

interface StatusBadgeProps {
  type: 'severity' | 'status';
  value: string;
}

function StatusBadge({ type, value }: StatusBadgeProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Supervisor Assigned': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'Inspected': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${type === 'severity' ? getSeverityColor(value) : getStatusColor(value)}`}>
      {value}
    </span>
  );
}

interface DetailItemProps {
  label: string;
  children: ReactNode;
}

function DetailItem({ label, children }: DetailItemProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}

interface ComplaintDetailsCardProps {
  title: string;
  description: string;
  location: string;
  pincode: string;
  severity: string;
  status: string;
  submissionDate: string;
  estimatedExpense: number;
  rating: number;
  message: string;
}

export function ComplaintDetailsCard({ 
  title, description, location, pincode, severity, status, submissionDate, estimatedExpense, rating , message 
}: ComplaintDetailsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 h-full">
      <div className="flex flex-col h-full">
        <div className="mb-4 border-b pb-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <div className="flex flex-wrap gap-2 mb-1">
            <StatusBadge type="severity" value={severity} />
            <StatusBadge type="status" value={status} />
          </div>
          <p className="text-sm text-gray-500">Submitted on <span className="font-medium">{submissionDate}</span></p>
        </div>
        
        <div className="space-y-4 flex-grow">
          <DetailItem label="Description">
            <p className="text-sm">{description}</p>
          </DetailItem>
          
          <DetailItem label="Location">
            <p className="text-sm">{location}</p>
          </DetailItem>
          
          <div className="flex flex-wrap gap-6 mt-auto">
            <DetailItem label="Pincode">
              <p className="text-sm">{pincode}</p>
            </DetailItem>
            {status !== 'Submitted' && (
            <DetailItem label="Estimated Expense">
              <p className="text-sm">₹{estimatedExpense}</p>
            </DetailItem>
            )}
            <DetailItem label="Severity">
              <StatusBadge type="severity" value={severity} />
            </DetailItem>
            
            <DetailItem label="Status">
              <StatusBadge type="status" value={status} />
            </DetailItem>
          </div>

          {status === 'Completed' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                <div className="flex items-center text-sm text-gray-600">
                  {rating } <span className="text-yellow-400 text-[24px] ml-1">★</span>
                </div>
              </div>
              <DetailItem label="Feedback">
                <p className="text-sm">{message}</p>
              </DetailItem>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
