'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmail } from '@/redux/slices/emailSlice';
import { LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { RxAvatar } from 'react-icons/rx'; // Import the avatar icon

const Page = () => {
  const [email, setEmailState] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    setLoading(true);
    setUserData(null);
    setEmailError('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/password/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to find account');
      }

      const data = await response.json();
      setUserData(data);
      dispatch(setEmail(email));

      // Fetch the profile image using profileImageId (if available)
      if (data.profileImageId) {
        const imageResponse = await fetch(`http://localhost:5000/api/v1/user/getProfileImage/${data.profileImageId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if needed
          },
        });

        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setUserData((prevData) => ({
            ...prevData,
            profileImage: imageUrl, // Set the image URL in userData
          }));
        } else {
          console.error('Failed to fetch profile image');
        }
      }
    } catch (error) {
      setEmailError('Account not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleNext = async () => {
    if (userData && userData.email) {
      dispatch(setEmail(userData.email)); // Set the email in Redux

      try {
        const response = await fetch('http://localhost:5000/api/v1/password/send-reset-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userData.email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send OTP');
        }

        const data = await response.json();
        console.log(data.message); // Log success message (optional)

        // Navigate to the OTP verification page
        await new Promise((resolve) => setTimeout(resolve, 100)); // Optional delay
        router.push('/UserForgetPasswordOtpVerification');
      } catch (error) {
        console.error('Error sending OTP:', error);
        setEmailError('Failed to send OTP. Please try again.'); // Display error message to the user
      }
    } else {
      console.error('User   data does not contain email');
      setEmailError('User   data is incomplete.'); // Display error message to the user
    }
  };

  const handleEmailChange = (e) => {
    setEmailState(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="font-[sans-serif] bg-white flex items-center justify-center md:h-screen p-4">
        <div className="shadow-lg max-w- 6xl max-md:max-w-lg rounded-md p-6">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div className="max-md:order-1 lg:min-w-[450px]">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="lg:w-11/12 w-full object-cover"
                alt="login-image"
              />
            </div>
            <form className="md:max-w-md w-full mx-auto">
              <div className="mb-12">
                <h3 className="text-4xl font-extrabold mb-8 text-blue-600">Forgot Password?</h3>
                <h3 className="text-xl font-semibold mb-8 text-black">
                  Let us help you find your account!
                </h3>
                <label className="text-md font-semibold mb-2 text-black">Enter Your Email</label>
                <div className="flex items-center space-x-2 w-full max-w-md mx-auto">
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={`p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none ${
                      !validateEmail(email) ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    onClick={handleSearch}
                    disabled={!validateEmail(email) || loading}
                  >
                    <FiSearch size={24} />
                  </button>
                </div>

                {loading && <LinearProgress className="mt-4" />} {/* MUI Linear Progress */}

                {emailError && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-red-600 mt-2 bg-red-100 p-3 rounded-md shadow-md">
                    <FiAlertCircle size={16} className="mr-2 sm:mb-0 mb-1" />
                    <p className="font-medium">{emailError}</p>
                  </div>
                )}

{userData && (
  <div className="mt-6 bg-gray-100 p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center shadow-md">
    {/* User Image and Name Section */}
    <div className="flex items-center sm:space-x-4 mb-3 sm:mb-0">
      {/* User Image */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-full ring-4 ring-blue-500 bg-gray-200 flex items-center justify-center">
        {userData.profileImage ? (
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <RxAvatar className="text-blue-400 w-8 h-8" />
        )}
      </div>

      {/* User Name */}
      <div className="flex flex-col text-center sm:text-left">
        <h2 className="text-md sm:text-xl ml-4 font-semibold text-gray-700">
          {userData.name}
        </h2>
      </div>
    </div>

    {/* "Next" Button */}
    <button
      type="button"
      onClick={handleNext}
      className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0 px-4 font-semibold py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
    >
      Next
    </button>
  </div>
)}


              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;