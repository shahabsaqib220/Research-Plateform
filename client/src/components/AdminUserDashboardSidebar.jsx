'use client';

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/services/AuthContext';
import axiosInstance from '@/services/axiosInstance';
import Navbar from '@/components/Navbar';
import { FaCamera } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress'; // Spinner for uploading
import { Skeleton } from '@mui/material'; // Skeleton component
import { useRouter } from 'next/router';

const ProfileImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('/default-avatar.png'); // Default avatar
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for skeleton
  const [successMessage, setSuccessMessage] = useState('');
  const { isLoggedIn, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      
      router.push('/login'); // Redirect to login page
    
    }

    const fetchProfileImage = async () => {
      try {
        const response = await axiosInstance.get('/login/getprofileimage', {
          responseType: 'blob',
        });

        if (response.status === 200) {
          const url = URL.createObjectURL(response.data);
          setImageUrl(url);
        } else if (response.data.error === "Profile image not found") {
          // If no profile image is found, keep the default avatar
          setImageUrl('/default-avatar.png');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Do not set an error message; just keep the default avatar
      } finally {
        setLoading(false); // Data fetch is complete
      }
    };

    fetchProfileImage();
  }, [isLoggedIn]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setImage(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setError('');
      setUploadEnabled(true);
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    setIsUploading(true);
    setUploadEnabled(false);

    const formData = new FormData();
    formData.append('profileImage', image);

    try {
      const response = await axiosInstance.post('/login/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setImageUrl(response.data.imageUrl);
        setError('');
        setSuccessMessage('Profile image uploaded successfully!');
        setTimeout(() => window.location.reload(), 1500); // Reload after success
      } else {
        setError(response.data.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Error uploading image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadEnabled(false);
    }
  };

  return (
    <>
      <Navbar />

      {loading ? (
        // Skeleton effect while loading
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-12">
          <div className="max-w-screen-xl mx-auto px-6">
            <Skeleton variant="text" height={60} width="50%" />
            <Skeleton variant="text" height={40} width="30%" className="mt-4" />
            <Skeleton variant="circle" width={144} height={144} className="mt-8 mx-auto" />
            <Skeleton variant="rectangular" height={48} width={200} className="mt-6 mx-auto" />
          </div>
        </div>
      ) : (
        // Main content after loading
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 font-[sans-serif] py-12">
          <div className="max-w-screen-lg mx-auto flex flex-col-reverse sm:flex-col md:flex-row items-center justify-between px-6">
            {/* Text Section */}
            <div className="mt-8 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                {`${user?.firstName || ''} ${user?.lastName || ''}`}
              </h1>
              <p className="max-w-md mt-4 text-lg text-gray-300">
                "A centralized1 hub for managing operations, monitoring progress, and overseeing key
                administrative tasks efficiently."
              </p>
              {error && (
                <div className="max-w-md mx-auto mt-6">
                  <div className="flex items-center bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-4 rounded-md shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.681-1.36 3.446 0l5.899 10.499c.764 1.36-.192 3.002-1.724 3.002H4.082c-1.532 0-2.488-1.642-1.724-3.002l5.899-10.499zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-.25-4a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0V10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="max-w-md mx-auto mt-6">
                  <div className="flex items-center bg-green-50 border border-green-200 text-green-600 text-sm font-medium p-4 rounded-md shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4a1 1 0 112 0 1 1 0 01-2 0zm0-8a1 1 0 012 0v4a1 1 0 01-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{successMessage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col items-center md:items-start sm:mt-8">
              <div className="relative">
                <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden relative flex items-center justify-center">
                  {isUploading ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="absolute -bottom-2 right-2 flex items-center justify-center bg-blue-500 w-10 h-10 rounded-full cursor-pointer border-2 border-white">
                  <FaCamera className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                onClick={handleUpload}
                className={`px-4 py-2 rounded font-semibold ml-6 mt-6 transition duration-200 ${
                  uploadEnabled
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
                disabled={!uploadEnabled || isUploading}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImageUpload;