'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail } from '@/redux/slices/emailSlice'; // Assuming the email slice is set up correctly
import { LinearProgress } from '@mui/material'; // Linear Progress from MUI
import Navbar from '@/components/Navbar';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';  // Importing icons
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

const VerifyOtp = () => {
  // Accessing email from Redux
  const email = useSelector((state) => state.email.email);
  const router = useRouter();
  
  // States for OTP inputs, countdown, and form
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [isOtpExpired, setIsOtpExpired] = useState(false);
 
const [otpSuccess, setOtpSuccess] = useState(''); // State for OTP success messages
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // Countdown Timer
    if (countdown > 0 && !isOtpExpired) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsOtpExpired(true); // OTP expired
    }
  }, [countdown]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d{0,1}$/.test(value)) { // Only allow numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = async () => {
    const otpPayload = otp.join(''); // Join OTP values into a string
    if (otpPayload.length === 6) {
      setIsVerifying(true);
      setOtpError('');
      setOtpSuccess(''); // Reset success message
      try {
        // Send the OTP to backend for verification
        const response = await fetch('http://localhost:5000/api/v1/password/verify-reset-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp: otpPayload, email }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          
          // Use the error message from the backend directly
          if (errorData.error) {
            setOtpError(errorData.error);
          } else {
            setOtpError('Error verifying OTP. Please try again later.'); // General fallback error
          }
        } else {
          setOtpSuccess('OTP verified successfully!'); // Success message
          setOtpError(''); // Clear any previous error messages
          router.push("/verifyusersecurityanswers")
        
          // Optionally, navigate to the next page or perform further actions
        }
        
      } catch (error) {
        console.error('Error:', error);
        setOtpError('Error verifying OTP. Please try again later.'); // Display error message
      } finally {
        setIsVerifying(false);
      }
    } else {
      setOtpError('Please enter a 6-digit OTP.');
    }
  };



  // Check if all OTP fields are filled
  const isOtpFilled = otp.every((digit) => digit !== '');

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row max-w-4xl p-4 bg-white shadow-lg rounded-md w-full">
        {/* Left side (Image) */}
        <div className="md:w-1/2 w-full flex justify-center items-center mb-4 md:mb-0">
          <img
            src="https://img.freepik.com/premium-vector/unlock-password-correct-success-login-concept-vector-illustration-flat-design_662353-282.jpg?semt=ais_hybrid" // Replace with your image URL
            alt="OTP Illustration"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>

        {/* Right side (OTP inputs) */}
        <div className="flex flex-col justify-center items-center md:w-1/2 w-full">
          <h3 className="text-md font-black  text-black mb-4">OTP sent to <span className="font-semibold">{email}</span></h3>

          {/* OTP Inputs */}
          <div className="flex space-x-2 mb-4 font-semibold">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-12 h-12 text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={isOtpExpired || isVerifying}
              />
            ))}
          </div>


          <div className="flex flex-col items-center mb-6">
  {/* OTP Error Message */}
  {otpError && (
    <div className="flex items-center space-x-2 text-red-600 mb-4 p-4 bg-red-100 rounded-md shadow-md">
      <FiAlertCircle className="text-xl" />
      <p className="font-semibold">{otpError}</p>
    </div>
  )}

  {/* Verification Success Message */}
  {otpSuccess && (
    <div className="flex items-center space-x-2 text-green-600 mb-4 p-4 bg-green-100 rounded-md shadow-md">
      <FiCheckCircle className="text-xl" />
      <p className="font-semibold">{otpSuccess}</p>
    </div>
  )}

  {/* Countdown Timer */}
  <div className="flex items-center space-x-2 mb-4 p-4 bg-gray-100 rounded-md shadow-md">
    {isOtpExpired ? (
      <>
        <FiAlertCircle className="text-red-600 text-xl" />
        <p className="text-red-600 font-semibold">OTP has expired</p>
      </>
    ) : (
      <>
        <FiClock className="text-gray-600 text-xl" />
        <p className="text-sm text-gray-600">OTP expires in {Math.floor(countdown / 60)}:{countdown % 60}</p>
      </>
    )}
  </div>

  {/* Linear Progress Indicator while verifying */}
  {isVerifying && (
    <div className="w-full mt-4">
      <LinearProgress color="primary" />
    </div>
  )}
</div>


          {/* Verify OTP Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 font-semibold px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            disabled={isOtpExpired || isVerifying || !isOtpFilled} // Disable button until OTP is fully entered
          >
            Verify OTP
          </button>

     
          
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default VerifyOtp;
