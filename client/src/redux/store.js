
import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '@/redux/slices/signUpSlice';
import emailReducer from '@/redux/slices/emailSlice';
import formDataReducer from '@/redux/slices/formDataSlice';
import educationReducer from '@/redux/slices/educationSlice';


const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    email: emailReducer,
    formData: formDataReducer,
    education: educationReducer,
  },
});

export default store;
