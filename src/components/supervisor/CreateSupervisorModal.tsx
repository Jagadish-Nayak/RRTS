import { useState } from 'react';
import { FaTimes, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CreateSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;    
  onSuccess: () => void;
  token: string;
}

export default function CreateSupervisorModal({ isOpen, onSuccess, onClose, token }: CreateSupervisorModalProps) {
  const [formData, setFormData] = useState({
    supervisorId: '',
    fullName: '',
    phone: '',
    pincode: '',
    email: '',
    dob: '',
  });

  const [errors, setErrors] = useState({
    supervisorId: '',
    fullName: '',
    phone: '',
    pincode: '',
    email: '',
    dob: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;

  // Prevent click events inside the modal from closing it
  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for supervisorId (only allow alphanumeric)
    if (name === 'supervisorId' && !/^[a-zA-Z0-9]*$/.test(value)) {
      return;
    }
    
    // Special handling for pincode (only allow numbers and max 6 digits)
    if (name === 'pincode' && (!/^\d*$/.test(value) || value.length > 6)) {
      return;
    }
    
    // Special handling for phone (only allow numbers)
    if (name === 'phone' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate supervisorId
    if (!formData.supervisorId.trim()) {
      newErrors.supervisorId = 'Supervisor ID is required';
      valid = false;
    } else if (formData.supervisorId.length < 4) {
      newErrors.supervisorId = 'Supervisor ID must be at least 4 characters';
      valid = false;
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      valid = false;
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
      valid = false;
    }

    // Validate pincode
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
      valid = false;
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
      valid = false;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Validate DOB
    if (!formData.dob) {
        newErrors.dob = 'Date of birth is required';
        valid = false;
      } else {
        const dobDate = new Date(formData.dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        
        if (age < 18) {
          newErrors.dob = 'The Supervisor must be at least 18 years old';
          valid = false;
        }
      }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const response = await axios.post('/api/supervisor/new', formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          toast.success('Supervisor created successfully!');
          onSuccess();
          onClose();
        }
      } catch (error: unknown) {
        let errorMessage = 'Failed to create supervisor.';
        
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
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
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Add New Supervisor</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Supervisor ID & Full Name */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">
                Supervisor ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="supervisorId"
                value={formData.supervisorId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.supervisorId ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none`}
                placeholder="Supervisor ID"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none`}
                placeholder="Full Name"
              />
            </div>
          </div>

          {/* Email & Date of Birth */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none`}
                placeholder="Email address"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none`}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-700" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]`}
                    placeholder="Phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 font-medium mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-700" />
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]`}
                    placeholder="6-digit pincode"
                  />
                </div>
                {errors.pincode && (
                  <p className="mt-1 text-red-500 text-sm">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>
          {/* Other Fields & Submit Button remain unchanged */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#00ABE4] text-white rounded-md hover:bg-[#0090c0] transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Creating...' : 'Add Supervisor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
