// src/utils/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? children : <Navigate 
  to="/login" 
  state={{ 
    from: {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    } 
  }} 
  replace 
/>;
};

export default PrivateRoute;
