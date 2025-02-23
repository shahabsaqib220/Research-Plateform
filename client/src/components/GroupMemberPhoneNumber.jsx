'use client';
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext';
import axiosInstance from '@/services/axiosInstance';
import { Error as ErrorIcon, CheckCircle as CheckCircleIcon, Info as InfoIcon } from "@mui/icons-material";

const PhoneNumberComponent = () => {
  const { user, isAuthenticated, phoneNumber, updatePhoneNumber } = useGroupMemberAuth();
  const [inputPhoneNumber, setInputPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [backendMessage, setBackendMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate phone number
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^(?:\+92\d{10}|03\d{9})$/;
    return phoneRegex.test(number);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputPhoneNumber(value);

    // Validate the phone number
    if (validatePhoneNumber(value)) {
      setError("");
      setIsValid(true);
    } else {
      setError(
        value.startsWith("+92")
          ? "Phone number must start with +92 followed by 10 digits."
          : value.startsWith("03")
          ? "Phone number must start with 03 followed by 9 digits."
          : "Invalid phone number format."
      );
      setIsValid(false);
    }
  };

  // Handle add button click
  const handleAdd = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/member/group-member-phone/${user.id}`, { phoneNumber: inputPhoneNumber });
      setBackendMessage(response.data.message || "Phone number added successfully!");
      setIsSuccess(true); // Set success state to true
      updatePhoneNumber(inputPhoneNumber); // Update phone number in context
      console.log("Phone number added:", response.data);

      // Optionally, clear the success message after a timeout
      setTimeout(() => {
        setBackendMessage("");
      }, 3000); // Clear message after 3 seconds
    } catch (error) {
      setBackendMessage(error.response?.data?.message || "Error adding phone number.");
      console.error("Error adding phone number:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render the component if the user is not authenticated or if the phone number is already available
  if (!isAuthenticated || phoneNumber) {
    return null; // Do not render the component if the user is authenticated and has a phone number
  }

  return (
    <div style={{ maxWidth: "400px", marginTop: "5px", marginBottom: "20px" }}>
      <Typography variant="body2" color="textSecondary" style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <InfoIcon fontSize="small" style={{ marginRight: "4px" }} /> Please add your phone number
      </Typography>

      {/* Skeleton effect while loading */}
      {isLoading ? (
        <Skeleton variant="rectangular" width="70%" height="56px" />
      ) : (
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          value={inputPhoneNumber}
          onChange={handleInputChange}
          error={!!error}
          helperText={error}
          inputProps={{ inputMode: "numeric" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isValid ? (
                  <CheckCircleIcon color="success" />
                ) : inputPhoneNumber ? (
                  <ErrorIcon color="error" />
                ) : null}
              </InputAdornment>
            ),
          }}
        />
      )}

      {/* Add Button */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={!isValid || isLoading}
        onClick={handleAdd}
        style={{ marginTop: "16px" }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Add"}
      </Button>

      {/* Backend Message */}
      {backendMessage && (
        <Typography
          variant="body2"
          color={backendMessage.includes("Error") ? "error" : "success"}
          style={{ marginTop: "8px" }}
        >
          {backendMessage}
        </Typography>
      )}
    </div>
  );
};

export default PhoneNumberComponent;