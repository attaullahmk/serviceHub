import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
// import 'mapbox-gl/dist/mapbox-gl.css'; // map 

// import Footer from './components/footer/Footer';

import './App.css'


const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes /> {/* Single entry point for all routes */}
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;
