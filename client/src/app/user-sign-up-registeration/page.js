
'use client'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFirstName, setLastName, setEmail, setPassword, setConfirmPassword } from '@/redux/slices/signUpSlice';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axiosInstance';
import { CircularProgress } from '@mui/material';
import Navbar from '@/components/Navbar';


const SignUpForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstNameState] = useState('');
  const [lastName, setLastNameState] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [confirmPassword, setConfirmPasswordState] = useState('');
  const [alert, setAlert] = useState('');



  // Adding a validator ro ensure that the somw field cannot fill up by the user
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to validate password strength
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation checks
    if (!firstName.trim()) {
      setAlert('First name is required.');
      return;
    }
  
    if (!email.trim() || !validateEmail(email)) {
      setAlert('Please enter a valid email address.');
      return;
    }
  
    if (!validatePassword(password)) {
      setAlert(
        'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special symbols.'
      );
      return;
    }
  
    if (password !== confirmPassword) {
      setAlert('Passwords do not match.');
      return;
    }
  
    // Clear alert and proceed
    setAlert('');
  
    dispatch(setFirstName(firstName));
    dispatch(setLastName(lastName));
    dispatch(setEmail(email));
    dispatch(setPassword(password));
    dispatch(setConfirmPassword(confirmPassword));
  
    setLoading(true);
  
    try {
      const response = await axiosInstance.post('/users/send-otp', { email });
  
      if (response.status === 200) {
        console.log(response.data.message);
        router.push('/verifyOtp');
      } else if (response.status === 400 && response.data.message === 'Email already exists') {
        setAlert('This email is already registered.');
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
  
      // Check if error response exists and handle specific cases
      if (error.response && error.response.data) {
        if (error.response.status === 400 && error.response.data.message === 'Email already exists') {
          setAlert('This email is already registered.');
        } else {
          setAlert('Error sending OTP. Please try again.');
        }
      } else {
        setAlert('Error sending OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <>
    <Navbar/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 bg-gray-100">
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://i.pinimg.com/736x/87/ec/6c/87ec6c2b942b1b1f944b87a2f92134db.jpg"
            alt="logo"
            className="w-16 h-16"
          />
          <h1 className="text-center text-2xl md:text-3xl font-extrabold mt-2 text-gray-900">
            Create Your <span className="text-blue-600">Account!</span>
          </h1>
          

         




 {alert && (
  <div
    className="p-4 mt-8 text-sm  text-red-800 bg-red-100 rounded-lg flex items-center"
    role="alert"
    style={{ wordWrap: 'break-word', maxWidth: '100%', maxHeight:'15%', whiteSpace: 'normal' }}
  >
    {alert}
  </div>
)}
        </div>

        {/* Here we are rendering the alert message */}






        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstNameState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastNameState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmailState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPasswordState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
          </button>
        </form>
      </div>
      <div className="flex items-center justify-center rounded-lg p-6">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800">
          "Research Platform for <br /> Academic Excellence"
        </h1>
      </div>
    </div>
    </>
  );
};

export default SignUpForm;
