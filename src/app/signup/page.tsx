'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaCalendarAlt, 
  FaVenusMars, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    pincode: '',
    address: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    pincode: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for pincode (only allow numbers and max 6 digits)
    if (name === 'pincode') {
      if (!/^\d*$/.test(value) || value.length > 6) {
        return;
      }
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
    
    // Check password match when either password or confirmPassword changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmPassword' && value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmPassword' && value === formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    
    // Validate date of birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      valid = false;
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old';
        valid = false;
      }
    }
    
    // Validate gender
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
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
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      valid = false;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Log form data to console
      console.log('Form submitted with data:', formData);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          pincode: '',
          address: ''
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#00ABE4] items-center justify-center">
        <div className="p-12 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6">Join NEXTGEN</h1>
          <p className="text-white text-lg mb-8">
            Create your account to access our road repair tracking and management platform.
          </p>
          <div className="relative h-64 w-full">
            <Image 
              src="/illustrations/road-repair-2.svg" 
              alt="Road Repair Illustration" 
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Link href="/">
              <Image 
                src="/logo.svg" 
                alt="Road Repair Tracker Logo" 
                width={180} 
                height={50} 
                className="cursor-pointer"
              />
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>

            <p className="text-gray-600 mb-2">
              Already have an account?{' '}
              <Link href="/login" className="text-[#00ABE4] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          
          
          <form onSubmit={handleSubmit}>
            {/* Name Fields (First Name, Last Name) */}
            <div className="mb-1.5">
              <label className="block text-gray-700 font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-700" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]  text-gray-700`}
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* DOB and Gender */}
            <div className="mb-1.5">
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <label htmlFor="dob" className="block text-gray-700  font-medium mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-700" />
                    </div>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dob}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3  border ${errors.dob ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                    />
                    {errors.dob && (
                      <p className="mt-1 text-red-500 text-sm">{errors.dob}</p>
                    )}
                  </div>
                </div>
                <div className="relative w-1/2">
                  <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVenusMars className="text-gray-700" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700 appearance-none`}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-red-500 text-sm">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email */}
            <div className="mb-1.5">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-700" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
            
            {/* Password and Confirm Password */}
            <div className="mb-1.5">
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-700" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-700" />
                      ) : (
                        <FaEye className="text-gray-700" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>
                <div className="relative w-1/2">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-700" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-0 pr-3 flex items-center"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-700" />
                      ) : (
                        <FaEye className="text-gray-700" />
                      )}
                    </button>
                    
                  </div>
                  {errors.confirmPassword && (
                      <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                </div>
              </div>
            </div>
            
            {/* Phone and Pincode */}
            <div className="mb-1.5">
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-700" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                      placeholder="Phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="relative w-1/2">
                  <label htmlFor="pincode" className="block text-gray-700 font-medium mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-700" />
                    </div>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.pincode ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-red-500 text-sm">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="mb-1.5">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-700" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4] text-gray-700`}
                  placeholder="Enter your full address"
                ></textarea>
                {errors.address && (
                  <p className="mt-1 text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-[#00ABE4] text-white py-3 rounded-md hover:bg-[#0090c0] transition-colors duration-300 font-medium mt-4"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 