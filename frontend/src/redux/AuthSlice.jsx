import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PURGE } from "redux-persist";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
  loading: false,
  error: null,
  token: localStorage.getItem("authToken") || null, // Load token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Store user & token in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("authToken", action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
    setUser: (state, action) => {
      state.user = action.payload; // Update user state
      localStorage.setItem("user", JSON.stringify(action.payload)); // Persist updated user
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, setUser } = authSlice.actions;

// Persist config
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

// Create persisted reducer
export const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

// Thunk action for logout
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");

  dispatch({ type: PURGE, key: "root", result: () => null });
  dispatch(logoutSuccess());
};

// Thunk action for login
export const loginUser = (formData, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
    dispatch(loginSuccess(response.data));
    navigate("/");
  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || "Login failed!"));
  }
};

// Thunk action to update user role to "provider"
export const updateUserRoleToProvider = () => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (!user) return;

  const updatedUser = { ...user, role: "provider" };

  dispatch(setUser(updatedUser)); // Update Redux state
};

// Axios interceptor for automatic logout on 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);

export default persistedAuthReducer;
