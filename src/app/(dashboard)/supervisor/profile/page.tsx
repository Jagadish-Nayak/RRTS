'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaCheckCircle,
  FaEdit,
  FaTimes,
  FaStar
} from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';
import { BsCheckAll } from 'react-icons/bs';
import StatCard from '@/components/dashboard/StatCard';

interface SupervisorProfile {
  firstName: string;
  lastName: string;
  employeeId: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  pincode: string;
  address: string;
  avatar?: string;
  rating: number;
  completedTasks: number;
  totalFeedbacks: number;
}

export default function SupervisorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<SupervisorProfile | null>(null);
  const [formData, setFormData] = useState<SupervisorProfile | null>(null);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    address: ''
  });

  const fetchProfile = useCallback(async (token: string) => {
    try {
      toast.loading('Loading profile...');
      console.log(token);
    //   const response = await axios.get('/api/supervisor/profile', {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        employeeId: '1234567890',
        dob: '1990-01-01',
        gender: 'Male',
        phone: '1234567890',
        address: '123 Main St, Anytown, USA',
        email: 'john.doe@example.com',
        pincode: '123456',
        rating: 4.5,
        completedTasks: 100,
        totalFeedbacks: 50,
      }
      setProfile(data);
      setFormData(data);
      toast.dismiss();
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    }
  }, [fetchProfile]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
        size={20}
      />
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone' && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
    
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
    
    if (!formData?.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    
    if (!formData?.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    
    if (!formData?.dob) {
      newErrors.dob = 'Date of birth is required';
      valid = false;
    }
    
    if (!formData?.gender) {
      newErrors.gender = 'Please select a gender';
      valid = false;
    }
    
    if (!formData?.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
      valid = false;
    }
    
    if (!formData?.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/supervisor/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      let errorMessage = 'Failed to update profile';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };

  if (!profile || !formData) return <div>Loading...</div>;

  return (
    <div className="h-max md:max-h-screen bg-gray-50 text-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Avatar and Stats */}
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-36 h-36 rounded-full border-4 border-blue-500 p-1">
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                    {profile.avatar ? (
                      <Image 
                        src={profile.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and Rating */}
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {profile.firstName} {profile.lastName}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {renderStars(profile.rating)}
                </div>
                
                {/* Employee ID */}
                <div className="mt-2 text-gray-600">
                  Employee ID: {profile.employeeId}
                </div>

                {/* Stats Cards */}
                <div className="mt-6 flex flex-col gap-4 w-full">
                  <StatCard 
                    title="Completed Tasks" 
                    value={profile.completedTasks} 
                    icon={<BsCheckAll size={24} />} 
                    bgColor="bg-green-500"
                  />
                  <StatCard 
                    title="Total Feedbacks" 
                    value={profile.totalFeedbacks} 
                    icon={<MdFeedback size={24} />} 
                    bgColor="bg-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - User Details Form */}
            <div className="md:w-2/3">
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00ABE4] text-white rounded-md hover:bg-[#0090c0] transition-colors"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                        setErrors({
                          firstName: '',
                          lastName: '',
                          dob: '',
                          gender: '',
                          phone: '',
                          address: ''
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <FaCheckCircle /> Save Changes
                    </button>
                  </div>
                )}
              </div>

              <form className="space-y-4">
                {/* Name Fields */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    />
                    {errors.firstName && <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    />
                    {errors.lastName && <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Read-only Fields */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                {/* Date of Birth and Gender */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      disabled={!isEditing}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    />
                    {errors.dob && <p className="mt-1 text-red-500 text-sm">{errors.dob}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-red-500 text-sm">{errors.gender}</p>}
                  </div>
                </div>

                {/* Phone and Pincode */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    />
                    {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    rows={3}
                  />
                  {errors.address && <p className="mt-1 text-red-500 text-sm">{errors.address}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
