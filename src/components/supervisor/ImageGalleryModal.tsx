import { FaTimes } from 'react-icons/fa';
import { ImageGallery } from '@/components/complaint/ImageGallery';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  complaintTitle: string;
}

export function ImageGalleryModal({ isOpen, onClose, images, complaintTitle }: ImageGalleryModalProps) {
  if (!isOpen) return null;

  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
        onClick={preventPropagation}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Images - {complaintTitle}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <ImageGallery images={images} />
        </div>
      </div>
    </div>
  );
}