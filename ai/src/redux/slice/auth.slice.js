import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../Utils/baseUrl';
// Async thunk for Google Login
export const googleLoginUser = createAsyncThunk(
    'auth/googleLogin',
    async (token, { rejectWithValue }) => {
        try {

            const response = await axios.post(`${BASE_URL}/google-login`, {
                token: token
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async ({ uid, username, fullName, email, photo }, { dispatch, rejectWithValue }) => {
    // console.log(uid, userName, fullName, email, photo);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {  username, fullName, email, image: photo }, { withCredentials: true });
     
      const userData = response?.data?.user;
     
      localStorage.setItem("Token", userData.token);
      localStorage.setItem("userId", userData.id);
      toast.success(response.data.message || "Google Login successful");
      return response.data;
    } catch (error) {
      // Optionally handle errors here
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("Token");
            const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem("Token");
            localStorage.removeItem("userId");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleLoginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(googleLoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(googleLoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.user.token;
                localStorage.setItem('token', action.payload.user.token);
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
            })
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
