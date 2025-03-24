'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';

export default function ComplaintForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pincode: '',
    severity: 'Low',
  });
  
  // File state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Validation state
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    location: '',
    pincode: '',
    images: '',
  });
  
  // Handle text input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special validation for pincode (numbers only, max 6 digits)
    if (name === 'pincode') {
      if (!/^\d*$/.test(value) || value.length > 6) {
        return;
      }
    }
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image uploads
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Check if total images would exceed 5
    if (images.length + files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 5 images allowed'
      }));
      return;
    }
    
    // Clear image error if any
    setErrors(prev => ({
      ...prev,
      images: ''
    }));
    
    // Add new files to existing ones
    const newImages = [...images];
    const newPreviews = [...imagePreview];
    
    Array.from(files).forEach(file => {
      newImages.push(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          newPreviews.push(reader.result as string);
          setImagePreview([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    setImages(newImages);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreview];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreview(newPreviews);
    
    // Clear image error if any
    setErrors(prev => ({
      ...prev,
      images: ''
    }));
  };
  
  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    } else if (formData.title.length > 25) {
      newErrors.title = 'Title must be less than 25 characters';
      valid = false;
    }
    
    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
      valid = false;
    }
    
    // Validate location
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      valid = false;
    }
    
    // Validate pincode
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      valid = false;
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
      valid = false;
    }
    
    // Validate images
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Gather all form data with images
      const completeData = {
        ...formData,
        images
      };
      
      // Log form data to console
      console.log('Complaint submitted:', completeData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        pincode: '',
        severity: 'Low',
      });
      setImages([]);
      setImagePreview([]);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto sm:p-2 text-gray-600">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Submit a Complaint</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter a brief title (max 25 characters)"
              maxLength={25}
            />
            {errors.title && (
              <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
            )}
            <p className="mt-1 text-gray-500 text-sm">{formData.title.length}/25 characters</p>
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe your complaint in detail (max 500 characters)"
              maxLength={500}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
            )}
            <p className="mt-1 text-gray-500 text-sm">{formData.description.length}/500 characters</p>
          </div>
          
          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              rows={2}
              className={`w-full px-4 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter the precise location of the issue"
            ></textarea>
            {errors.location && (
              <p className="mt-1 text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          
          {/* Pincode */}
          <div className="mb-4">
            <label htmlFor="pincode" className="block text-gray-700 font-medium mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="mt-1 text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>
          
          {/* Severity */}
          <div className="mb-4">
            <label htmlFor="severity" className="block text-gray-700 font-medium mb-2">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Images <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 ml-2">(Min 1, Max 5)</span>
            </label>
            <div className={`border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-md p-4 text-center`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                multiple
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Choose Files
              </button>
              <p className="mt-2 text-sm text-gray-500">Click to browse or drag and drop images</p>
            </div>
            {errors.images && (
              <p className="mt-1 text-red-500 text-sm">{errors.images}</p>
            )}
            
            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Images ({images.length}/5):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full cursor-pointer py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
