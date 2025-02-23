'use client';

import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axiosInstance';
import { selectFormData } from '@/redux/slices/formDataSlice';

const FinishRegistration = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const router = useRouter();
  const axios = axiosInstance();
  const formData = useSelector(selectFormData);

  // Select registration data from Redux
  const { firstName, lastName, email, password, securityQuestions, securityAnswers } = useSelector(
    (state) => state.signUp
  );

  const handleNext = async () => {
    console.log('Security Questions:', securityQuestions);
    console.log('Security Answers:', securityAnswers);



    console.log('Sign-Up Data:', { firstName, lastName, email, password, securityQuestions, securityAnswers });
    console.log('Form Data:', formData);
    formData.forEach(data => {
      console.log('File:', data.file);
    });

    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('firstName', firstName);
    formDataToSubmit.append('lastName', lastName);
    formDataToSubmit.append('email', email);
    formDataToSubmit.append('password', password);
    formDataToSubmit.append('phone', phone);
    formDataToSubmit.append('securityQuestions', JSON.stringify(securityQuestions));
    formDataToSubmit.append('securityAnswers', JSON.stringify(securityAnswers));

    formData.forEach((data, index) => {
      formDataToSubmit.append(`researchData[${index}][startDate]`, data.startDate);
      formDataToSubmit.append(`researchData[${index}][endDate]`, data.endDate);
      formDataToSubmit.append(`researchData[${index}][tags]`, JSON.stringify(data.tags));
      formDataToSubmit.append(`researchData[${index}][keywords]`, JSON.stringify(data.keywords));
      formDataToSubmit.append(`researchData[${index}][journals]`, JSON.stringify(data.journals));
      formDataToSubmit.append(`researchData[${index}][publicationLinks]`, JSON.stringify(data.publicationLinks));
      formDataToSubmit.append(`file`, data.file); // Sending files here
    });

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/users/register', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('Form submitted successfully');
      setIsLoading(false);
       // Replace with your next page route
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-50 p-4 space-y-8 md:space-y-0">
        <div className="flex flex-col items-center md:items-start space-y-4">
          {alert.message && (
            <div
              className={`w-full md:w-80 text-center p-4 rounded-md ${
                alert.type === 'success'
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}
            >
              {alert.message}
            </div>
          )}
          <h2 className="text-lg font-bold text-gray-700">Add Phone Number</h2>
          <PhoneInput
            country={'pk'}
            value={phone}
            onChange={(value) => setPhone(value)}
            inputClass="w-full text-black md:w-80 border border-gray-300 rounded-md"
            buttonClass="rounded-md"
            containerClass="w-full"
          />
          <button
            onClick={handleNext}
            className={`w-full md:w-80 bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-all duration-200 flex items-center justify-center ${
              isLoading ? 'cursor-not-allowed opacity-80' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : 'Next'}
          </button>
        </div>

        <div className="flex items-center justify-center rounded-lg p-6">
          <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800">
            "Research Platform for <br /> Academic Excellence"
          </h1>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FinishRegistration;