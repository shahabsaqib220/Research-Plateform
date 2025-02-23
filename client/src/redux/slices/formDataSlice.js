// filepath: /redux/slices/formDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    addFormData: (state, action) => {
      state.push(action.payload);
    },
    removeFormData: (state, action) => {
      return state.filter((data) => data.id !== action.payload);
    },
  },
});

export const { addFormData, removeFormData } = formDataSlice.actions;
export const selectFormData = (state) => state.formData;
export default formDataSlice.reducer;