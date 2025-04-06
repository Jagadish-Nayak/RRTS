'use client';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ReportPDF from '@/components/ReportPDF';
import axios from 'axios';
import Loading from '@/components/Loading';

interface ReportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
}

interface ComplaintData {
  title: string;
  location: string;
  createdAt: string;
  supervisor:{
    id: string;
    email: string;
    phone: string;
    username: string;
  },
  inspectionDate: string;
  completionDate: string;
}

interface ReportData {
    id: string;
    createdAt: string;
    updatedAt: string;
    totalDaysInvested: number;
    totalWorkers: number;
    costBreakdown: {
        labor: number;
        materials: number;
        equipment: number;
        miscellaneous: number;
    };
    totalCost: number;
    notes: string;
}

export default function ReportPDFModal({ isOpen, onClose, complaintId }: ReportPDFModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>();
  const [complaintData, setComplaintData] = useState<ComplaintData | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && complaintId) {
      fetchReportData();
    }
  }, [isOpen, complaintId]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/report/${complaintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log(response.data.report);
        setReportData({
            id: response.data.report.id,
            createdAt: response.data.report.createdAt,
            updatedAt: response.data.report.updatedAt,
            totalDaysInvested: response.data.report.totalDaysInvested,
            totalWorkers: response.data.report.totalWorkers,
            costBreakdown: {
                labor: response.data.report.costBreakdown.labor,
                materials: response.data.report.costBreakdown.materials,
                equipment: response.data.report.costBreakdown.equipment,
                miscellaneous: response.data.report.costBreakdown.miscellaneous
            },
            totalCost: response.data.report.totalCost,  
            notes: response.data.report.notes
        });
        setComplaintData({
            title: response.data.complaint.title,
            location: response.data.complaint.location,
            createdAt: response.data.complaint.createdAt,
            supervisor: {
                id: response.data.complaint.supervisorID.id,
                email: response.data.complaint.supervisorID.email,
                phone: response.data.complaint.supervisorID.phone,
                username: response.data.complaint.supervisorID.username
            },
            inspectionDate: response.data.inspectedStatus,
            completionDate: response.data.completedStatus
        });
        //console.log(response.data.complaint.inspectedStatus,response.data.complaint.completedStatus);
      } else {
        setError('Failed to fetch report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Error fetching report data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-5xl h-[90vh]">
                <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loading />
                  </div>
                ) : error ? (
                  <div className="flex flex-col justify-center items-center h-full p-8">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                ) : reportData && complaintData ? (
                  <ReportPDF 
                    report={reportData} 
                    complaint={complaintData}  
                  />
                ) : (
                  <div className="flex justify-center items-center h-full p-8">
                    <p className="text-yellow-600 text-lg">No report data available</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}