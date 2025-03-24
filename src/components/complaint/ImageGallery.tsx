import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const nextImage = () => {
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  };
  
  const selectImage = (index: number) => {
    setActiveImageIndex(index);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      {/* Main Image */}
      <div className="relative h-64 md:h-80 mb-4 rounded-lg overflow-hidden">
        {images.length > 0 ? (
          <>
            <img 
              src={images[activeImageIndex]} 
              alt={`Complaint image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <FaChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <FaChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div 
              key={index}
              onClick={() => selectImage(index)}
              className={`h-16 rounded-md overflow-hidden cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}