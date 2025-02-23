'use client'
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";
import axios from "axios";
import { selectEmail } from '@/redux/slices/emailSlice'; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";


const VerifyPhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const email = useSelector(selectEmail);
  const router = useRouter();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setError("");
    setSuccessMessage("");
    setIsVerifying(true);

    try {
      const response = await axios.post("http://localhost:5000/api/v1/password/verify-phone-number", {
        email,
        phoneNumber: phoneNumber,
      });

      if (response.data.message === "Phone number verified successfully!") {
        setSuccessMessage(response.data.message);
        router.push("/user-reset-password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to verify phone number.");
    } finally {
      setIsVerifying(false);
    }
  };

  const validateInput = (value) => {
    const phoneRegex = /^[0-9]*$/; // Only allow numbers
    if (phoneRegex.test(value)) {
      setPhoneNumber(value);
      setError("");
    } else {
      setError("Please enter a valid phone number.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Verify Your Phone Number
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Enter your mobile phone number with the country code (e.g., 923001234567).
          </p>

          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => validateInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-3"
          />
          
          {error && (
            <div className="flex items-center text-red-500 text-sm mb-3">
              <AiOutlineExclamationCircle className="mr-2" /> {error}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center text-green-500 text-sm mb-3">
              <AiOutlineCheckCircle className="mr-2" /> {successMessage}
            </div>
          )}

          <button
            onClick={handleVerify}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition ${
              isVerifying ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VerifyPhoneNumber;
