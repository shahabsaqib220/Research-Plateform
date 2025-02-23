'use client'

import React, { useState, useEffect, useContext } from 'react';
import { FaExclamationCircle } from 'react-icons/fa'; // React Icons for error handling
import axiosInstance from '../../services/axiosInstance'; // Assuming you have an axiosInstance setup for API calls
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { MdOutlineMailOutline } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import Footer from '@/components/Footer';
import { AuthContext } from "@/services/AuthContext";
import MemberLoginForm from '../member-Login-Form/page';




const Login = () => {
  const { login, isLoggedIn } = useContext(AuthContext); // Destructure 'login' and 'isLoggedIn' from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const router = useRouter();

  // Email validation regex
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  // Enable/disable the button based on form input
  useEffect(() => {
    if (email && password && emailRegex.test(email)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  // If already logged in, redirect to the user dashboard
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/userDashboard");
    }
  }, [isLoggedIn, router]);


  
  const handleForgotPasswordClick = () => {
    // Navigate to the "userForgetPassword" page
    router.push('/userForgetPassword');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
        const response = await axiosInstance.post("/login/auth", { email, password });

        // Call the login function from AuthContext to set token and user state
        login(response.data.token, response.data.user); // Pass user details here

        // Redirect to user dashboard after successful login
        router.push("/userDashboard");
    } catch (err) {
        // Manage errors from backend
      console.log(err)
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <Navbar />

      <div className="font-[sans-serif] mb-96">
        <div className="grid lg:grid-cols-2 gap-4 max-lg:gap-12 bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-12 h-[320px]">
          <div>
            <div className="max-w-lg mt-16 max-lg:hidden">
              <h3 className="text-3xl font-bold text-white">Log in as your Admin Account!</h3>
              <p className="text-sm mt-4 text-white">Access your personalized dashboard on our Research Platform for Academic Excellence by securely logging in. Stay connected to your academic resources and progress with ease.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl space-x-4 max-sm:space-y-4 mb-8 sm:px-6 px-4 py-8 max-w-md w-full h-max shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] max-lg:mx-auto">
            <form onSubmit={handleLogin}>
              <div className="mb-8">
                <h3 className="text-3xl font-extrabold text-gray-800 mb-16">Log In</h3>
                {error && (
                  <div className="flex items-center text-red-600 mb-4">
                    <FaExclamationCircle className="mr-2" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div>
                {!emailRegex.test(email) && email && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-4a1 1 0 112 0v4a1 1 0 01-2 0V6zm1 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Please enter a valid email address</span>
                  </div>
                )}

                <label htmlFor="email" className="text-gray-800 mb-2 font-semibold text-sm block">Email</label>
                <div className="relative flex items-center">
                  <input type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} required className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="you@example.com" />
                  <MdOutlineMailOutline className="w-[18px] h-[18px] absolute right-4" />
                </div>
              </div>

              <div className="mt-6">
                {password.length > 0 && password.length < 8 && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-4a1 1 0 012 0v4a1 1 0 01-2 0V6zm1 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Password must contain at least 8 characters</span>
                  </div>
                )}

                <label htmlFor="password" className="text-gray-800 text-sm mb-2 block font-semibold">Password</label>
                <div className="relative flex items-center">
                  <input type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} name="password" required className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter password" />
                  <MdLockOutline className="w-[18px] h-[18px] absolute right-4 cursor-pointer" />
                </div>
              </div>

              <div className="mt-4 text-right">
      <a
        href="javascript:void(0);"
        className="text-blue-600 text-sm font-semibold hover:underline"
        onClick={handleForgotPasswordClick}
      >
        Forgot your password?
      </a>
    </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className={`w-full p-3 font-semibold bg-blue-600 text-white rounded-lg focus:outline-none ${isButtonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isButtonDisabled || loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>

              <p className="text-sm mt-8 text-center text-gray-800">Don't have an account? <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a></p>
            </form>
          </div>
        </div>
      </div>

      <MemberLoginForm/>




      <Footer />
    </>
  );
};

export default Login;
