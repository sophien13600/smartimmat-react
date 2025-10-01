import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import Nav from "./components/Nav";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/Routes";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthProvider >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
