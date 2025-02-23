'use client'

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";
import { CircularProgress } from "@mui/material";
import { selectEmail } from "@/redux/slices/emailSlice"; // Redux email slice
import { FiLock } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResetPassword = () => {
  const email = useSelector(selectEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/password/user-new-password",
        { email, password, confirmPassword }
      );

      setSuccessMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar/>
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:flex-row">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 mb-6 lg:mb-0">
       
      
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow sm:max-w-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              />
              {!validatePassword(password) && password && (
                <span className="text-red-500 text-sm">
                  Password must be 8+ characters, include uppercase, lowercase, and special character.
                </span>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              />
              {confirmPassword && confirmPassword !== password && (
                <span className="text-red-500 text-sm">Passwords do not match.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                !validatePassword(password)
              }
              className={`w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? <CircularProgress size={24} className="text-white" /> : "Reset Password"}
            </button>

            {error && (
              <div className="flex items-center text-red-500 text-sm mt-2">
                <AiOutlineExclamationCircle className="mr-2" /> {error}
              </div>
            )}

            {successMessage && (
              <div className="flex items-center text-green-500 text-sm mt-2">
                <AiOutlineCheckCircle className="mr-2" /> {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default ResetPassword;
