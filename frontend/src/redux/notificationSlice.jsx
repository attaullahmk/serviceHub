import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [], // Holds notifications
  loading: false, // Tracks loading state if necessary
  error: null, // Tracks errors if any
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload); // Add new notification to the list
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload // Remove notification by id
      );
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload; // Set notifications directly (useful when fetching from DB)
    },
    clearNotifications: (state) => {
      state.notifications = []; // Clear all notifications
    },
  },
});

export const {
  addNotification,
  removeNotification,
  setNotifications,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
