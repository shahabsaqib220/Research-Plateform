'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSecurityData } from '@/redux/slices/signUpSlice';

const SecurityQuestions = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const questions = [
    'What is the name of your first pet?',
    'What is the name of the street you grew up on?',
    'What is your favorite childhood teacher\'s name?',
    'What is your favorite book or movie?',
    'What is your mother’s maiden name?',
    'What is the name of the city where you were born?',
    'What was the make and model of your first car?',
    'What is the name of your first school?',
    'What was your childhood nickname?',
    'What is your favorite food?',
    'What is the name of your best friend from childhood?',
    'What was the first concert you attended?',
    'What is the name of the place where you first worked?',
    'What was your dream job as a child?',
    'What was the name of your first stuffed animal?',
  ];

  const [selectedQuestions, setSelectedQuestions] = useState(['', '', '']);
  const [answers, setAnswers] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index] = value;
    setSelectedQuestions(updatedQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const validate = () => {
    const uniqueQuestions = new Set(selectedQuestions);
    const uniqueAnswers = new Set(answers);

    if (selectedQuestions.includes('') || answers.includes('')) {
      setError('All questions and answers must be filled.');
      return false;
    }

    if (uniqueQuestions.size !== selectedQuestions.length) {
      setError('Selected questions must be unique.');
      return false;
    }

    if (uniqueAnswers.size !== answers.length) {
      setError('Answers must be unique.');
      return false;
    }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (validate()) {
      setIsLoading(true);

      // Dispatch to Redux
      dispatch(
        setSecurityData({
          questions: selectedQuestions,
          answers: answers,
        })
      );

      console.log('Dispatched Security Questions and Answers to Redux');

      // Simulate API call or navigate to the next step
      setTimeout(() => {
        setIsLoading(false);
        router.push('/uploadreseachpapers');
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white">
        <div className="flex flex-col items-center justify-center p-4 md:p-8 space-y-6">
          <h4 className="mb-4 text-md font-bold leading-none tracking-tight text-gray-900">
            Setup Your <mark className="px-2 text-white bg-blue-600 rounded">Security Questions</mark> & Answers
          </h4>
          <p className="text-sm font-normal text-gray-500 lg:text-xl">
            Keep in mind your security questions & answers
          </p>
          <p className="text-sm font-normal text-gray-500 lg:text-xl">
            These will be asked when you try to recover your password!
          </p>

          {selectedQuestions.map((_, index) => (
            <div key={index} className="flex flex-col w-full max-w-lg space-y-2">
              <select
                value={selectedQuestions[index]}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-600"
              >
                <option value="" disabled>
                  Select a question
                </option>
                {questions.map((question, idx) => (
                  <option key={idx} value={question}>
                    {question}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Your answer"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-600"
              />
            </div>
          ))}

{error && (
  <div className="flex items-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md mt-4">
    <span className="mr-2 text-red-500">
      <i className="ri-error-warning-line"></i>
      {/* Replace "ri-error-warning-line" with any React Icon import like RiErrorWarningLine */}
    </span>
    <p className="text-sm font-medium">{error}</p>
  </div>
)}


          <button
            onClick={handleNext}
            className={`w-full max-w-lg mt-4 bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-all duration-200 flex items-center justify-center ${
              isLoading ? 'cursor-not-allowed opacity-80' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : 'Next'}
          </button>
        </div>

        <div className="flex items-center justify-center max-w-screen-lg p-4 md:p-8">
          <h1 className="text-center text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-snug">
            "Research Platform for <br /> Academic Excellence"
          </h1>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SecurityQuestions;
