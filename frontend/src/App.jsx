import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
// import 'mapbox-gl/dist/mapbox-gl.css'; // map 
import './App.css'


const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes /> {/* Single entry point for all routes */}
    </BrowserRouter>
  );
};

export default App;
