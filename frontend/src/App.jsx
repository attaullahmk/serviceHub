// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";
// import AdminRoutes from "./routes/AdminRoutes";


// // import 'mapbox-gl/dist/mapbox-gl.css'; // map 

// // import Footer from './components/footer/Footer';

// import './App.css'



// const App = () => {
//   return (
//     <BrowserRouter>
//       <AppRoutes /> {/* Single entry point for all routes */}
//       {/* <Footer /> */}
    
//     </BrowserRouter>
//   );
// };

// export default App;


import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// import 'mapbox-gl/dist/mapbox-gl.css'; // Optional
// import Footer from './components/footer/Footer';
import './App.css';

const AppWrapper = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminPath ? <AdminRoutes /> : <AppRoutes />}
      {/* {!isAdminPath && <Footer />} */}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
