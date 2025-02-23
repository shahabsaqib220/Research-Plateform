import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  degrees: [],  // Array to hold multiple degrees
  maxDegrees: 3, // Limit the number of degrees
};

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    addDegree: (state, action) => {
      if (state.degrees.length < state.maxDegrees) {
        state.degrees.push(action.payload);
      }
    },
    removeDegree: (state, action) => {
      state.degrees = state.degrees.filter((_, index) => index !== action.payload);
    },
    updateDegree: (state, action) => {
      const { index, updatedDegree } = action.payload;
      state.degrees[index] = { ...state.degrees[index], ...updatedDegree };
    },
    resetDegrees: (state) => {
      state.degrees = [];
    },
  },
});

export const { addDegree, removeDegree, updateDegree, resetDegrees } = educationSlice.actions;
export default educationSlice.reducer;