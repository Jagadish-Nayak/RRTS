// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useParams } from 'next/navigation';
// import { FaStar, FaStarHalfAlt, FaRegStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTasks, FaUserCircle } from 'react-icons/fa';

// // Define interface for our complaint data
// interface ComplaintDetails {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   pincode: string;
//   severity: 'Low' | 'Medium' | 'High';
//   status: 'Submitted' | 'Supervisor Assigned' | 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
//   submissionDate: string;
//   assignedSupervisor?: {
//     name: string;
//     email: string;
//     contactNumber: string;
//     pincode: string;
//     completedTasks: number;
//     rating: number;
//   };
//   images: string[];
//   estimatedCompletionDate?: string;
//   statusUpdates: {
//     id: number;
//     date: string;
//     message: string;
//     status: string;
//   }[];
//   statusTimeline: {
//     status: string;
//     date: string;
//     completed: boolean;
//   }[];
// }

// export default function ComplaintDetails() {
//   const params = useParams();
//   const complaintId = params.id as string;
  
//   // State for the complaint details
//   const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);

//   // Fetch complaint details (simulated)
//   useEffect(() => {
//     // Simulate API call to fetch complaint details
//     const fetchComplaintDetails = () => {
//       setLoading(true);
      
//       // Simulate network delay
//       setTimeout(() => {
//         // Mock data for the complaint
//         const mockComplaint: ComplaintDetails = {
//           id: complaintId,
//           title: 'Road damage near Main Street intersection',
//           description: 'There is a large pothole in the middle of the road causing traffic and potential danger to vehicles. It has been there for more than a month and getting worse with rain.',
//           location: 'Main Street and 5th Avenue intersection, near the shopping complex',
//           pincode: '110001',
//           severity: 'High',
//           status: 'Ongoing',
//           submissionDate: '2023-07-15',
//           assignedSupervisor: {
//             name: 'John Smith',
//             email: 'john.smith@municipality.gov',
//             contactNumber: '(555) 123-4567',
//             pincode: '110005',
//             completedTasks: 47,
//             rating: 4.5
//           },
//           images: [
//             '/illustrations/a.png',
//             '/illustrations/b.png',
//             '/illustrations/c.png',
//             '/illustrations/d.png',
//             '/illustrations/e.png',
//           ],
//           estimatedCompletionDate: '2023-08-25',
//           statusUpdates: [
//             { id: 1, date: '2023-07-15 09:30 AM', message: 'Complaint submitted successfully', status: 'Submitted' },
//             { id: 2, date: '2023-07-16 11:45 AM', message: 'Complaint assigned to supervisor John Smith', status: 'Supervisor Assigned' },
//             { id: 3, date: '2023-07-18 03:15 PM', message: 'Supervisor has inspected the site and confirmed the issue. Repair team will be assigned soon.', status: 'Inspected' },
//             { id: 4, date: '2023-07-22 10:00 AM', message: 'Repair work has started. Expected to be completed by August 25.', status: 'Ongoing' }
//           ],
//           statusTimeline: [
//             { status: 'Submitted', date: '2023-07-15', completed: true },
//             { status: 'Supervisor Assigned', date: '2023-07-16', completed: true },
//             { status: 'Inspected', date: '2023-07-18', completed: true },
//             { status: 'Ongoing', date: '2023-07-22', completed: true },
//             { status: 'Completed', date: '2023-08-25', completed: false }
//           ]
//         };
        
//         setComplaint(mockComplaint);
//         setLoading(false);
//       }, 500);
//     };
    
//     fetchComplaintDetails();
//   }, [complaintId]);

//   // Handle image navigation
//   const nextImage = () => {
//     if (!complaint) return;
//     setActiveImageIndex((activeImageIndex + 1) % complaint.images.length);
//   };
  
//   const prevImage = () => {
//     if (!complaint) return;
//     setActiveImageIndex((activeImageIndex - 1 + complaint.images.length) % complaint.images.length);
//   };
  
//   // Select a specific image
//   const selectImage = (index: number) => {
//     setActiveImageIndex(index);
//   };
  
//   // Get severity color
//   const getSeverityColor = (severity: ComplaintDetails['severity']) => {
//     switch (severity) {
//       case 'Low': return 'bg-green-100 text-green-800 border border-green-200';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
//       case 'High': return 'bg-red-100 text-red-800 border border-red-200';
//     }
//   };
  
//   // Get status color
//   const getStatusColor = (status: ComplaintDetails['status']) => {
//     switch (status) {
//       case 'Submitted': return 'bg-blue-100 text-blue-800 border border-blue-200';
//       case 'Supervisor Assigned': return 'bg-purple-100 text-purple-800 border border-purple-200';
//       case 'Inspected': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
//       case 'Ongoing': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
//       case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
//       case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200';
//     }
//   };
  
//   // Render rating stars
//   const renderRatingStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
    
//     for (let i = 1; i <= 5; i++) {
//       if (i <= fullStars) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else if (i === fullStars + 1 && hasHalfStar) {
//         stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400" />);
//       }
//     }
    
//     return <div className="flex">{stars}</div>;
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
  
//   if (!complaint) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="bg-red-100 text-red-700 p-4 rounded-md">
//           Complaint not found.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-4 space-y-6">
//       {/* Header Section */}
//       <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//         <div className="flex flex-col md:flex-row justify-between">
//           <div className="mb-4 md:mb-0">
//             <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{complaint.title}</h1>
//             <div className="flex flex-wrap gap-2">
//               <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(complaint.severity)}`}>
//                 Severity: {complaint.severity}
//               </span>
//               <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(complaint.status)}`}>
//                 Status: {complaint.status}
//               </span>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-500">Submitted on</p>
//             <p className="text-base font-medium text-gray-800">{complaint.submissionDate}</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Row 1: Images and Complaint Details */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Images Section */}
//         <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
//           {/* Main Image */}
//           <div className="relative h-56 md:h-72 mb-4 rounded-lg overflow-hidden">
//             {complaint.images.length > 0 ? (
//               <>
//                 <img 
//                   src={complaint.images[activeImageIndex]} 
//                   alt={`Complaint image ${activeImageIndex + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//                 {complaint.images.length > 1 && (
//                   <>
//                     <button 
//                       onClick={prevImage}
//                       className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                       </svg>
//                     </button>
//                     <button 
//                       onClick={nextImage}
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </button>
//                   </>
//                 )}
//               </>
//             ) : (
//               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                 <p className="text-gray-500">No images available</p>
//               </div>
//             )}
//           </div>
          
//           {/* Thumbnails */}
//           {complaint.images.length > 1 && (
//             <div className="grid grid-cols-5 gap-2">
//               {complaint.images.map((image, index) => (
//                 <div 
//                   key={index}
//                   onClick={() => selectImage(index)}
//                   className={`h-16 rounded-md overflow-hidden cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
//                 >
//                   <img 
//                     src={image} 
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Complaint Details */}
//         <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaint Details</h2>
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Description</h3>
//               <p className="text-gray-800">{complaint.description}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Location</h3>
//               <p className="text-gray-800">{complaint.location}</p>
//             </div>
//             <div className="flex flex-wrap gap-6">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
//                 <p className="text-gray-800">{complaint.pincode}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Severity</h3>
//                 <p className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(complaint.severity)}`}>
//                   {complaint.severity}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Status</h3>
//                 <p className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(complaint.status)}`}>
//                   {complaint.status}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Row 2: Status Timeline */}
//       <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaint Status</h2>
        
//         {complaint.estimatedCompletionDate && (
//           <p className="text-gray-600 mb-4">
//             Estimated Completion Date: <span className="font-medium">{complaint.estimatedCompletionDate}</span>
//           </p>
//         )}
        
//         {/* Status Timeline */}
//         <div className="relative mt-8 mb-4">
//           {/* Timeline Track */}
//           <div className="absolute top-4 left-0 w-full h-1 bg-gray-200"></div>
          
//           {/* Timeline Nodes */}
//           <div className="relative flex justify-between">
//             {complaint.statusTimeline.map((item, index) => {
//               // Determine if this is the "Rejected" state which is an alternative to "Completed"
//               const isRejected = item.status === 'Rejected';
//               const isCompleted = item.completed;
              
//               return (
//                 <div key={index} className="flex flex-col items-center">
//                   {/* Status Node */}
//                   <div 
//                     className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
//                       isCompleted 
//                         ? 'bg-green-500 text-white' 
//                         : isRejected 
//                           ? 'bg-red-500 text-white' 
//                           : 'bg-gray-200 text-gray-500'
//                     }`}
//                   >
//                     {isCompleted ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     ) : (
//                       <span className="text-xs">{index + 1}</span>
//                     )}
//                   </div>
                  
//                   {/* Status Label */}
//                   <div className="mt-2 text-center">
//                     <p className="text-xs font-medium">{item.status}</p>
//                     <p className="text-xs text-gray-500">{item.completed ? item.date : (index === complaint.statusTimeline.length - 1 ? 'Estimated' : '')}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
      
//       {/* Row 3: Supervisor Details and Status Updates */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Supervisor Details */}
//         <div className="bg-white rounded-lg shadow-md p-4">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Supervisor Details</h2>
          
//           {complaint.assignedSupervisor ? (
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-shrink-0">
//                 <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                   <FaUserCircle className="w-full h-full text-gray-400" />
//                 </div>
//               </div>
//               <div className="flex-grow space-y-3">
//                 <div>
//                   <h3 className="text-xl font-medium text-gray-800">{complaint.assignedSupervisor.name}</h3>
//                   <div className="flex items-center mt-1">
//                     {renderRatingStars(complaint.assignedSupervisor.rating)}
//                     <span className="ml-2 text-sm text-gray-600">{complaint.assignedSupervisor.rating.toFixed(1)}</span>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <div className="flex items-center text-gray-600">
//                     <FaEnvelope className="mr-2 text-gray-400" />
//                     <span className="text-sm">{complaint.assignedSupervisor.email}</span>
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <FaPhone className="mr-2 text-gray-400" />
//                     <span className="text-sm">{complaint.assignedSupervisor.contactNumber}</span>
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <FaMapMarkerAlt className="mr-2 text-gray-400" />
//                     <span className="text-sm">Pincode: {complaint.assignedSupervisor.pincode}</span>
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <FaTasks className="mr-2 text-gray-400" />
//                     <span className="text-sm">{complaint.assignedSupervisor.completedTasks} tasks completed</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-gray-100 text-gray-600 p-4 rounded-md">
//               No supervisor has been assigned yet.
//             </div>
//           )}
//         </div>
        
//         {/* Status Updates */}
//         <div className="bg-white rounded-lg shadow-md p-4">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Updates</h2>
          
//           <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
//             {complaint.statusUpdates.length > 0 ? (
//               [...complaint.statusUpdates].reverse().map((update, index) => (
//                 <div 
//                   key={update.id}
//                   className={`p-3 rounded-lg border-l-4 ${
//                     index % 2 === 0 
//                       ? 'bg-blue-50 border-blue-200' 
//                       : 'bg-purple-50 border-purple-200'
//                   }`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div 
//                       className={`px-2 py-0.5 rounded-md text-xs font-medium mb-1 ${getStatusColor(update.status as ComplaintDetails['status'])}`}
//                     >
//                       {update.status}
//                     </div>
//                     <span className="text-xs text-gray-500">{update.date}</span>
//                   </div>
//                   <p className="text-sm text-gray-700">{update.message}</p>
//                 </div>
//               ))
//             ) : (
//               <div className="bg-gray-100 text-gray-600 p-4 rounded-md">
//                 No status updates available.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 
// page.tsx - Main complaint details page
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ImageGallery } from '@/components/complaint/ImageGallery';
import { ComplaintDetailsCard } from '@/components/complaint/ComplaintDetailsCard';
import { StatusTimeline } from '@/components/complaint/StatusTimeline';
import { SupervisorCard } from '@/components/complaint/SupervisorCard';
import { StatusUpdatesList } from '@/components/complaint/StatusUpdatesList';

// Define interface for our complaint data
interface ComplaintDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  pincode: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Submitted' | 'Supervisor Assigned' | 'Inspected' | 'Ongoing' | 'Completed' | 'Rejected';
  submissionDate: string;
  assignedSupervisor?: {
    name: string;
    email: string;
    contactNumber: string;
    pincode: string;
    completedTasks: number;
    rating: number;
  };
  images: string[];
  estimatedCompletionDate?: string;
  statusUpdates: {
    id: number;
    date: string;
    message: string;
    status: string;
  }[];
  statusTimeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
}

export default function ComplaintDetails() {
  const params = useParams();
  const complaintId = params.id as string;
  
  // State for the complaint details
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch complaint details (simulated)
  useEffect(() => {
    // Simulate API call to fetch complaint details
    const fetchComplaintDetails = () => {
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        // Mock data for the complaint
        const mockComplaint: ComplaintDetails = {
          id: complaintId,
          title: 'Road damage near Main Street intersection',
          description: 'There is a large pothole in the middle of the road causing traffic and potential danger to vehicles. It has been there for more than a month and getting worse with rain.',
          location: 'Main Street and 5th Avenue intersection, near the shopping complex',
          pincode: '110001',
          severity: 'High',
          status: 'Ongoing',
          submissionDate: '2023-07-15',
          assignedSupervisor: {
            name: 'John Smith',
            email: 'john.smith@municipality.gov',
            contactNumber: '(555) 123-4567',
            pincode: '110005',
            completedTasks: 47,
            rating: 4.5
          },
          images: [
            '/illustrations/a.png',
            '/illustrations/b.png',
            '/illustrations/c.png',
            '/illustrations/d.png',
            '/illustrations/e.png',
          ],
          estimatedCompletionDate: '2023-08-25',
          statusUpdates: [
            { id: 1, date: '2023-07-15 09:30 AM', message: 'Complaint submitted successfully', status: 'Submitted' },
            { id: 2, date: '2023-07-16 11:45 AM', message: 'Complaint assigned to supervisor John Smith', status: 'Supervisor Assigned' },
            { id: 3, date: '2023-07-18 03:15 PM', message: 'Supervisor has inspected the site and confirmed the issue. Repair team will be assigned soon.', status: 'Inspected' },
            { id: 4, date: '2023-07-22 10:00 AM', message: 'Repair work has started. Expected to be completed by August 25.', status: 'Ongoing' },
            { id: 5, date: '2023-07-15 09:30 AM', message: 'Complaint submitted successfully', status: 'Submitted' },
            { id: 6, date: '2023-07-16 11:45 AM', message: 'Complaint assigned to supervisor John Smith', status: 'Supervisor Assigned' },
            { id: 7, date: '2023-07-18 03:15 PM', message: 'Supervisor has inspected the site and confirmed the issue. Repair team will be assigned soon.', status: 'Inspected' },
            { id: 8, date: '2023-07-22 10:00 AM', message: 'Repair work has started. Expected to be completed by August 25.', status: 'Ongoing' }
          ],
          statusTimeline: [
            { status: 'Submitted', date: '2023-07-15', completed: true },
            { status: 'Supervisor Assigned', date: '2023-07-16', completed: true },
            { status: 'Inspected', date: '2023-07-18', completed: true },
            { status: 'Ongoing', date: '2023-07-22', completed: true },
            { status: 'Completed', date: '2023-08-25', completed: true }
          ]
        };
        
        setComplaint(mockComplaint);
        setLoading(false);
      }, 500);
    };
    
    fetchComplaintDetails();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Complaint not found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6">
      {/* Row 1: Image Gallery and Complaint Details - 2 Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <ImageGallery images={complaint.images} />
        
        {/* Complaint Details */}
        <ComplaintDetailsCard 
          title={complaint.title}
          description={complaint.description}
          location={complaint.location}
          pincode={complaint.pincode}
          severity={complaint.severity}
          status={complaint.status}
          submissionDate={complaint.submissionDate}
        />
      </div>
      
      {/* Row 2: Status Timeline */}
      <StatusTimeline 
        steps={complaint.statusTimeline}
        estimatedCompletionDate={complaint.estimatedCompletionDate}
        currentStatus={complaint.status}
      />
      
      {/* Row 3: Supervisor Profile and Status Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supervisor Profile */}
        {complaint.assignedSupervisor && (
          <SupervisorCard 
            name={complaint.assignedSupervisor.name}
            email={complaint.assignedSupervisor.email}
            contactNumber={complaint.assignedSupervisor.contactNumber}
            pincode={complaint.assignedSupervisor.pincode}
            completedTasks={complaint.assignedSupervisor.completedTasks}
            rating={complaint.assignedSupervisor.rating}
          />
        )}
        
        {/* Status Updates */}
        <StatusUpdatesList updates={complaint.statusUpdates} />
      </div>
    </div>
  );
}