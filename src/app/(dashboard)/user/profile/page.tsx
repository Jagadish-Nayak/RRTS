'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaCheckCircle,
  FaEdit,
  FaTimes,
  FaWpforms
} from 'react-icons/fa';
import StatCard from '@/components/dashboard/StatCard';
import { MdFeedback, MdVerified } from 'react-icons/md';

interface UserProfile {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  pincode: string;
  address: string;
  isVerified: boolean;
  avatar?: string;
}

export default function ProfilePage() {
  let complaints,feedbacks; 
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    pincode: '',
    address: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token inside useEffect
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      // Retrieve token from localStorage
  
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });
  
      const userData = response.data;
  
      // Split username into firstName and lastName
      const nameParts = userData.username ? userData.username.split(' ') : [];
      userData.firstName = nameParts[0] || ''; // First word as firstName
      userData.lastName = nameParts.slice(1).join(' ') || ''; // Remaining as lastName
  
      // Convert dob to string
      const dob = new Date(userData.dob);
      userData.dob = dob.toISOString().split('T')[0];
      complaints = userData.complaints.length;
      feedbacks = userData.feedbacks.length;
      console.log(complaints,feedbacks);
      // Save the updated user data
      setUserProfile(userData);
      setFormData(userData);
    } catch (error: unknown) {
        console.error('Error fetching profile data:', error);
      
        let errorMessage = 'Something went wrong.';
      
        // Type guard to check if error is an Axios error
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      
        toast.error(errorMessage);
      }
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'pincode' && (!/^\d*$/.test(value) || value.length > 6)) {
      return;
    }
    
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
    
    if (!formData?.pincode) {
      newErrors.pincode = 'Pincode is required';
      valid = false;
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
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
      const response = await axios.put('/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
        console.error('Profile update error:', error);
      
        let errorMessage = 'Something went wrong. Please try again.';
      
        // Type guard to check if error is an Axios error
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      
        toast.error(errorMessage);
      }
  };

  const handleVerify = async () => {
    // try {
    //   await axios.post('/api/user/verify');
    //   fetchUserProfile();
    //   toast.success('Verification email sent');
    // } catch (error) {
    //   toast.error('Failed to send verification email');
    // }
    toast.success('Verification email sent');
  };

  if (!userProfile || !formData) return <div>Loading...</div>;

  return (
    <div className="h-max md:max-h-screen bg-gray-50 text-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Avatar and Name */}
            <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                    <div className="relative">
                    {/* Circular Ring Around Avatar */}
                    <div className="w-36 h-36 rounded-full border-4 border-blue-500 p-1 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                        {userProfile.avatar ? (
                            <Image 
                            src={userProfile.avatar}
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

                    {/* Verified Badge */}
                    {userProfile.isVerified && (
                        <div className="absolute bottom-2 right-2 bg-blue-600 border-2 border-white rounded-full p-1 shadow-md">
                        <MdVerified className="text-white" size={22} />
                        </div>
                    )}
                    </div>
                    
                    {/* User Name */}
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    {userProfile.firstName} {userProfile.lastName}
                    </h3>
                    
                    {/* Verify Button */}
                    {!userProfile.isVerified && (
                    <button
                        onClick={handleVerify}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-md"
                    >
                        Verify Account
                    </button>
                    )}

                    {/* Stats Cards - Complaints & Feedbacks */}
                    <div className="mt-6 flex flex-col gap-4 w-full">
                    {/* Total Complaints Card */}
                    <StatCard 
                        title="Total Complaints" 
                        value={complaints?complaints:0} 
                        icon={<FaWpforms  size={24} />} 
                        bgColor="bg-green-500"
                    />

                    {/* Total Feedbacks Card */}
                    <StatCard 
                        title="Total Feedbacks" 
                        value={feedbacks?feedbacks:0} 
                        icon={<MdFeedback  size={24} />} 
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
                        setFormData(userProfile);
                        setErrors({
                          firstName: '',
                          lastName: '',
                          dob: '',
                          gender: '',
                          phone: '',
                          pincode: '',
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

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dob}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
                    />
                    {errors.pincode && <p className="mt-1 text-red-500 text-sm">{errors.pincode}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md ${!isEditing && 'bg-gray-50'}`}
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
