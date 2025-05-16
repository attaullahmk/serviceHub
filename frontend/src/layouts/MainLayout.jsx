import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';


const MainLayout = ({ requireAuth = false }) => {
  const location = useLocation();

  // Access Redux state using useSelector
  const { user, loading } = useSelector((state) => state.auth);

  // Show a loading spinner while loading the authentication state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If authentication is required and the user is not authenticated, redirect to login
  // if (requireAuth && !user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }


  /// If authentication is required and the user is not authenticated, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  

  // Render the layout with the outlet for nested routes
  return (
    // <div className="min-h-screen flex flex-col">
     <div> 
    
      {/* <main className="flex-grow container mx-auto px-4 py-8"> */}
      
       <main>
        <Outlet />
 
      </main>
    </div>
  );
};

export default MainLayout;

