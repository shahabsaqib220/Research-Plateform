'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOTP } from '@/redux/slices/signUpSlice';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axiosInstance';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const OTPInput = () => {
  const [otp, setOtp] = useState(Array(6).fill('')); // Store OTP in array of length 6
  const [timeLeft, setTimeLeft] = useState(120); // Countdown timer
  const [isDisabled, setIsDisabled] = useState(false); // Disable inputs and button on timeout
  const [errorMessage, setErrorMessage] = useState(''); // Error message from backend
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for button
  const dispatch = useDispatch();
  const email = useSelector((state) => state.signUp.email); // Access email from Redux
  const router = useRouter();

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDisabled(true); // Disable fields and button when timer reaches 0
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e, index) => {
    const newOtp = otp.slice();
    newOtp[index] = e.target.value;

    setOtp(newOtp); // Update OTP state locally

    if (newOtp.every((digit) => digit.length === 1)) {
      dispatch(setOTP(newOtp.join(''))); // Dispatch the OTP to Redux store if all digits are filled
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Set loading state
    try {
      const response = await axiosInstance.post('/users/verify-otp', {
        email,
        otp: otp.join(''), // Join OTP array into a single string
      });

      if (response.status === 200) {
        setErrorMessage(response.data.message); // Show success message
        router.push('/securityQuestions');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <>
    <Navbar/>
      {/* Code for signUp form */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white">
        {/* Left side with OTP input */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <div className="bg-gray-100 shadow-lg rounded-lg p-6 w-full max-w-md">
            <h4 className="mb-4 text-md font-bold leading-none tracking-tight text-gray-900">
              Verify <mark className="px-2 text-white bg-blue-600 rounded">OTP!</mark>
            </h4>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center md:text-left">
              OTP is sent to <span className="text-blue-500">{email}</span>
            </h2>
            <div className="bg-gray-0 flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  disabled={isDisabled} // Disable inputs if timer expires
                  className="w-12 h-12 text-center text-black font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-5 text-center">
              OTP expires in{' '}
              <span className="text-blue-500 font-semibold">{formatTime(timeLeft)}</span>
            </p>

            {errorMessage && (
              <div
                className="p-4 mt-5 text-sm text-black rounded-lg bg-gray-300"
                role="alert"
              >
                <span className="font-semibold"></span>
                {errorMessage}
              </div>
            )}
            <button
              type="button"
              disabled={isDisabled || otp.some((digit) => digit.length === 0) || isSubmitting} // Disable button if timer expires, OTP is incomplete, or during submission
              onClick={handleSubmit} // Handle OTP submission
              className={`w-full mt-8 flex items-center justify-center ${
                isDisabled || otp.some((digit) => digit.length === 0) || isSubmitting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-bold py-2 rounded-md transition-all duration-200`}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8h-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>

        {/* Right side with Heading */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <h1 className="text-center text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-snug">
            "Research Platform for <br /> Academic Excellence"
          </h1>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OTPInput;
