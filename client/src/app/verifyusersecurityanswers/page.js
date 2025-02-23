'use client';
// components/SecurityQuestions.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux to get the email
import { AiOutlineExclamationCircle } from 'react-icons/ai'; // For error icon
import Image from 'next/image'; // For the right-side image
import { selectEmail } from '@/redux/slices/emailSlice'; // Assuming the email slice is set up correctly
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';


const SecurityQuestions = () => {
  const router = useRouter();
  const email = useSelector(selectEmail);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (index, value) => {
    const updatedAnswers = { ...answers, [index]: value };
    setAnswers(updatedAnswers);

    // Check if all answers are unique
    const uniqueAnswers = new Set(Object.values(updatedAnswers));
    if (uniqueAnswers.size !== Object.keys(updatedAnswers).length) {
      setFormError('Answers must be unique.');
    } else {
      setFormError('');
    }
  };

  const fetchSecurityQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/password/get-security-questions?email=${encodeURIComponent(email)}`, {
        method: 'GET', // Keep it as GET
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
  
      const data = await response.json();
      setSecurityQuestions(data.securityQuestions);
    } catch (err) {
      setError('Failed to fetch security questions. Please try again later.');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    // Convert the answers object to an array
    const answersArray = securityQuestions.map((_, index) => answers[index] || '');
  
    try {
      const response = await fetch('http://localhost:5000/api/v1/password/verify-security-questions', {
        method: 'POST', // Use POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, answers: answersArray }), // Send email and answers as JSON
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
      } else {
        setError('');
        alert('Security answers verified successfully!');
        router.push('/verify-phone-number'); // Redirect to the next page
      }
    } catch (err) {
      setError('Verification failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (email) fetchSecurityQuestions();
  }, [email]);

  return (
    <>
    <Navbar/>
    <div className="flex flex-col md:flex-row items-center justify-between w-full min-h-screen p-6 bg-gray-100">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-2xl font-bold text-blue-500">Security Questions</h1>
        {error && (
          <div className="flex items-center text-red-500">
            <AiOutlineExclamationCircle className="mr-2" />
            {error}
          </div>
        )}
        {securityQuestions.map((question, index) => (
          <div key={index} className="space-y-2">
            <p className="font-medium text-gray-700">{question}</p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={answers[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="Your answer"
            />
          </div>
        ))}
        {formError && (
          <div className="flex items-center text-red-500">
            <AiOutlineExclamationCircle className="mr-2" />
            {formError}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={
            Object.keys(answers).length !== securityQuestions.length ||
            formError ||
            isSubmitting
          }
          className={`w-40 p-2 text-white font-semibold rounded-md ${
            Object.keys(answers).length === securityQuestions.length &&
            !formError &&
            !isSubmitting
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Verify
        </button>
      </div>

      <img
  src="https://assets.aboutamazon.com/dims4/default/26082a2/2147483647/strip/true/crop/1996x1125+2+0/resize/1320x744!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2F4c%2Fa0%2F16c6682b491e874051c614b886e0%2Fhero-illustration-scam-revised2.jpg" // Replace with your external image URL
  alt="Security"
  width={500} // Adjusted width for a larger image
  height={500} // Adjusted height for a larger image
  className="rounded-lg shadow-lg"
/>
    </div>
    <Footer/>
    </>
  );
};

export default SecurityQuestions;
