import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // ✅ Import PersistGate
import App from "./App";
import store, { persistor } from "./redux/Store"; // ✅ Import persistor
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'
// Load Google OAuth Client ID
const GOOGLE_CLIENT_ID = "272009640444-82h9f7582sthkk9952vlk4sv42na4hge.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        {/* ✅ PersistGate ensures Redux state is loaded before rendering */}
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  // </StrictMode>
);
