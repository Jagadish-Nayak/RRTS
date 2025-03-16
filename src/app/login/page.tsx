'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    role: 'user',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({
    identifier: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate identifier (ID or phone)
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'ID or Phone number is required';
      valid = false;
    } else if (/^\d+$/.test(formData.identifier)) {
      // If it's a phone number, check length
      if (formData.identifier.length < 10) {
        newErrors.identifier = 'Phone number must be at least 10 digits';
        valid = false;
      }
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      setFormData({
        identifier: '',
        role: 'user',
        password: '',
        rememberMe: false
      });
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        // Redirect or show success message
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen  text-gray-700 flex flex-col md:flex-row">
      {/* Left side - Illustration (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#00ABE4] items-center justify-center">
        <div className="p-12 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome to NEXTGEN</h1>
          <p className="text-white text-lg mb-8">
            Your trusted partner for road repair tracking and management solutions.
          </p>
          <div className="relative h-64 w-full">
            <Image 
              src="/illustrations/road-repair-1.svg" 
              alt="Road Repair Illustration" 
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Please sign in to continue to your account</p>
          
          <form onSubmit={handleSubmit}>
            {/* ID/Phone Field */}
            <div className="mb-6">
              <label htmlFor="identifier" className="block text-gray-700 font-medium mb-2">
                Employee ID / Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.identifier ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]`}
                  placeholder="Enter your ID or phone number"
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-red-500 text-sm">{errors.identifier}</p>
              )}
            </div>
            
            {/* Role Selection */}
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2  focus:ring-[#00ABE4]"
              >
                <option value="user">User</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#00ABE4] focus:ring-[#00ABE4] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="text-[#00ABE4] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-[#00ABE4] text-white py-3 rounded-md hover:bg-[#0090c0] transition-colors duration-300 font-medium"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#00ABE4] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
          
          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 