import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import Nav from "./components/Nav";
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./router/Routes";

function App() {
  return (
    
    <BrowserRouter >
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
