// src/redux/slices/signUpSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  otp: '', // Ensure otp is defined here
  securityQuestions: [], // Add security questions array
  securityAnswers: [],   // Add security answers array
  formData: [], // Add form data array
};

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
    setOTP: (state, action) => {
      state.otp = action.payload; // Set OTP here
    },
    setSecurityData: (state, action) => {
      const { questions, answers } = action.payload;
      state.securityQuestions = questions;
      state.securityAnswers = answers;
    },
    addFormData: (state, action) => {
      state.formData.push(action.payload);
    },
    removeFormData: (state, action) => {
      state.formData = state.formData.filter((data) => data.id !== action.payload);
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setConfirmPassword,
  setOTP,
  setSecurityData,
  addFormData,
  removeFormData,
} = signUpSlice.actions;

export default signUpSlice.reducer;