import { createSlice } from '@reduxjs/toolkit';

export const emailSlice = createSlice({
  name: 'email',
  initialState: {
    email: '',
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { setEmail } = emailSlice.actions;

export const selectEmail = (state) => state.email.email;

export default emailSlice.reducer;
