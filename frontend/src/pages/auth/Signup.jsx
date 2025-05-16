// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../../redux/AuthSlice";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Signup.css";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//     otp: "",
//   });

//   const [error, setError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkGoogleLogin = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const token = params.get("token");

//       if (token) {
//         localStorage.setItem("authToken", token);
//         window.history.replaceState({}, "", "/signup");

//         try {
//           const response = await axios.get(`${BASE_URL}/api/auth/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           const user = response.data.user;
//           dispatch(loginSuccess({ user, token }));
//           navigate("/services");
//         } catch (err) {
//           navigate("/login");
//         }
//       }
//     };

//     checkGoogleLogin();
//   }, [dispatch, navigate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const sendOtp = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await axios.post(`${BASE_URL}/api/auth/send-otp`, { email: formData.email });
//       setOtpSent(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   // const verifyOtpAndSignup = async (e) => {
//   //   e.preventDefault();
//   //   setError("");

//   //   try {
//   //     const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, formData);
//   //     const { token, user } = response.data;
//   //     localStorage.setItem("authToken", token);
//   //     dispatch(loginSuccess({ user, token }));
//   //     navigate("/");
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || "Signup failed!");
//   //   }
//   // };

//   const verifyOtpAndSignup = async (e) => {
//     e.preventDefault();
//     setError("");
  
//     try {
//       const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, formData);
//       const { token, user } = response.data;
//       localStorage.setItem("authToken", token);
//       dispatch(loginSuccess({ user, token }));
  
//       // Redirect to the path the user attempted to access before signup
//       const redirectPath = location.state?.from || "/";
//       navigate(redirectPath, { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed!");
//     }
//   };
  

//   const handleGoogleLogin = () => {
//     window.location.href = `${BASE_URL}/api/auth/google`;
//   };

//   return (
//     <div className="container signup-container">
//       <div className="card signup-card">
//         <h2 className="text-center">Sign Up</h2>

//         {error && <div className="alert alert-danger">{error}</div>}

//         {!otpSent ? (
//           <form onSubmit={sendOtp}>
//             <div className="mb-3">
//               <label className="form-label">Full Name</label>
//               <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Email</label>
//               <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
//             </div>
//             <button type="submit" className="btn btn-primary w-100">Send OTP</button>
//           </form>
//         ) : (
//           <form onSubmit={verifyOtpAndSignup}>
//             <div className="mb-3">
//               <label className="form-label">OTP</label>
//               <input type="text" className="form-control" name="otp" value={formData.otp} onChange={handleChange} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Password</label>
//               <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
//             </div>
//             <button type="submit" className="btn btn-primary w-100">Verify OTP & Sign Up</button>
//           </form>
//         )}

//         <div className="google-signin mt-3 text-center">
//           <button onClick={handleGoogleLogin} className="btn btn-danger w-100">
//             Sign up with Google
//           </button>
//         </div>

//         <p className="mt-3 text-center">
//           Already have an account? <a href="/login">Login</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;







// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/AuthSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    otp: "",
  });

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Persist redirect path in session storage
  useEffect(() => {
    if (location.state?.from) {
      sessionStorage.setItem('authRedirect', JSON.stringify(location.state.from));
    }
  }, [location]);

  // Get redirect path function
  const getRedirectPath = () => {
    // First check current location state
    if (location.state?.from) {
      return typeof location.state.from === 'string' 
        ? location.state.from 
        : location.state.from?.pathname;
    }
    
    // Fallback to session storage
    const stored = sessionStorage.getItem('authRedirect');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return typeof parsed === 'string' ? parsed : parsed?.pathname;
      } catch {
        return "/";
      }
    }
    
    // Default fallback
    return "/";
  };


// this add for profile creation
useEffect(() => {
    const checkGoogleLogin = async () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const redirectPath = getRedirectPath();

        if (token) {
            try {
                // Store the token
                localStorage.setItem("authToken", token);

                // Fetch the authenticated user
                const response = await axios.get(`${BASE_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const user = response.data.user;
                dispatch(loginSuccess({ user, token }));

                // Create the user profile if not already created
                 await axios.post(`${BASE_URL}/api/userProfiles/${user._id}`, {
            user: user._id
        }
      );

                // Redirect after successful Google login
                navigate(redirectPath, { replace: true });
            } catch (err) {
                console.error("Google signup failed:", err);
                navigate("/signup");
            }
        }
    };

    checkGoogleLogin();
}, [dispatch, navigate, location]);










  // Debug the location state
  // useEffect(() => {
  //   console.log("Signup location state:", location.state);
  // }, [location]);

  // useEffect(() => {
  //   const checkGoogleLogin = async () => {
  //     const params = new URLSearchParams(window.location.search);
  //     const token = params.get("token");
  //     const redirectPath = getRedirectPath();

  //     if (token) {
  //       try {
  //         localStorage.setItem("authToken", token);
  //         const response = await axios.get(`${BASE_URL}/api/auth/me`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });

  //         const user = response.data.user;
  //         dispatch(loginSuccess({ user, token }));
          
  //         navigate(redirectPath, { replace: true });
  //       } catch (err) {
  //         console.error("Google signup failed:", err);
  //         navigate("/signup");
  //       }
  //     }
  //   };

  //   checkGoogleLogin();
  // }, [dispatch, navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${BASE_URL}/api/auth/send-otp`, { email: formData.email });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };



  // this for profile creation
  const verifyOtpAndSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
        // Verify the OTP and create the user
        const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, formData);
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);
        dispatch(loginSuccess({ user, token }));

        // Create the user profile after successful signup
        console.log("Creating user profile for:");
 // to remove that form that can be write this logic in the backend
        await axios.post(`${BASE_URL}/api/userProfiles/${user._id}`, {
            user: user._id
        }
      );


        // Redirect to the intended page
        const redirectPath = getRedirectPath();
        console.log("Redirecting after signup to:", redirectPath);
        navigate(redirectPath, { replace: true });
    } catch (err) {
        setError(err.response?.data?.message || "Signup failed!");
    }
};


  // const verifyOtpAndSignup = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, formData);
  //     const { token, user } = response.data;
  //     localStorage.setItem("authToken", token);
  //     dispatch(loginSuccess({ user, token }));

  //     const redirectPath = getRedirectPath();
  //     console.log("Redirecting after signup to:", redirectPath);
  //     navigate(redirectPath, { replace: true });
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Signup failed!");
  //   }
  // };

  const handleGoogleLogin = () => {
    const redirectPath = getRedirectPath();
    window.location.href = `${BASE_URL}/api/auth/google?redirectPath=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <div className="container signup-container">
      <div className="card signup-card">
        <h2 className="text-center">Sign Up</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {!otpSent ? (
          <form onSubmit={sendOtp}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyOtpAndSignup}>
            <div className="mb-3">
              <label className="form-label">OTP</label>
              <input type="text" className="form-control" name="otp" value={formData.otp} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Verify OTP & Sign Up</button>
          </form>
        )}

        <div className="google-signin mt-3 text-center">
          <button onClick={handleGoogleLogin} className="btn btn-danger w-100">
            Sign up with Google
          </button>
        </div>

        <p className="mt-3 text-center">
          Already have an account?{' '}
          <button 
            className="btn btn-link p-0" 
            onClick={() => navigate('/login', { state: location.state })}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;