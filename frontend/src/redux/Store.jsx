import { configureStore } from "@reduxjs/toolkit"; 
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./authSlice";

// Persist config
const persistConfig = {
  key: "auth",
  storage,
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use persisted reducer
  },
  // Optional: Disable non-serializable checks (not recommended, but an option if needed)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist-related actions
      },
    }),
});

// Persistor for the store
export const persistor = persistStore(store);

export default store;
