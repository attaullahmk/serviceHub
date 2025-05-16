// import { configureStore } from "@reduxjs/toolkit"; 
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
// import authReducer from "./AuthSlice";

// // Persist config
// const persistConfig = {
//   key: "auth",
//   storage,
// };

// // Create persisted reducer
// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// // Configure the store
// const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer, // Use persisted reducer
//   },
//   // Optional: Disable non-serializable checks (not recommended, but an option if needed)
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'], // Ignore persist-related actions
//       },
//     }),
// });

// // Persistor for the store
// export const persistor = persistStore(store);

// export default store;


// updat version for notafication slice and auth slice
// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./AuthSlice";
import notificationReducer from "./notificationSlice"; // Import the new notification reducer

// Persist config
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

// Create persisted reducer for auth
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Persistor for the store
export const persistor = persistStore(store);

export default store;

