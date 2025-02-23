'use client';
import React, { useState } from 'react';
import { IoInformationCircleSharp, IoMailSharp, IoAlertCircle } from 'react-icons/io5';
import { MdLock } from 'react-icons/md';
import axiosInstance from '@/services/axiosInstance'; // Import the Axios instance
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext'; // Import the context
import { useRouter } from 'next/navigation';

const MemberLoginForm = () => {
  const router = useRouter();
  const { memberLogin } = useGroupMemberAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Password validation regex
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Handle input changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Please provide a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError('Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters.');
    } else {
      setPasswordError('');
    }
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await axiosInstance.post('/member/member-login', { email, password });
      if (response.data.token) {
        console.log('Member login response:', response.data);
        const { token, member } = response.data; // Destructure token and member data from the response
        memberLogin(token, member);  // Save both token and user data (member) in context
        router.push('/group-member-dashboard');
      }
    } catch (error) {
      setLoginError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  
  };

  // Disable login button if inputs are invalid or loading
  const isLoginDisabled = !validateEmail(email) || !validatePassword(password) || isLoading;

  return (
    <div className="font-[sans-serif] bg-gradient-to-r from-blue-700 via-blue-500 to-blue-600 text-gray-800">
      <div className="min-h-screen flex items-center justify-center lg:p- 6 p-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div className="text-right">
            <h2 className="text-4xl font-extrabold lg:leading-[50px] text-white">
              Login to Your Member Portal And Simplify Your Access
            </h2>
            <p className="text-sm mt-6 text-white">
              Seamlessly access all your member-exclusive features and resources with a secure login.
            </p>
          </div>
          <form className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full" onSubmit={handleLogin}>
            <h3 className="text-3xl font-extrabold mb-12">Log In</h3>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">Email</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800 pr-10 ${emailError ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                />
                <IoMailSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
              </div>
              {emailError && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <IoAlertCircle className="mr-1" />
                  {emailError}
                </div>
              )}
            </div>

            <div className="relative mt-4">
              <label htmlFor="password" className="block font-semibold text-sm text-black mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800 pr-10 ${passwordError ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <MdLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <IoAlertCircle className="mr-1" />
                  {passwordError}
                </div>
              )}
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoginDisabled}
                className={`w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white ${isLoginDisabled ? 'bg-gray-400' : 'bg-gray-800 hover:bg-[#222]'} focus:outline-none`}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </div>

            {loginError && (
              <div className="text-red-500 text-sm flex items-center justify-center mt-4">
                <IoAlertCircle className="mr-1" />
                {loginError}
              </div>
            )}

            <div className="text-sm text-center flex items-center justify-start bg-gray-100 px-6 py-4 rounded-lg shadow-lg mt-5 max-w-md mx-auto">
              <IoInformationCircleSharp className="text-blue-500 text-2xl sm:text-3xl lg:text-4xl flex-shrink-0 mr-4" />
              <p className="text-black font-medium text-sm sm:text-base leading-5">
                If you forget your password, please reach out to your group head for assistance.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberLoginForm;