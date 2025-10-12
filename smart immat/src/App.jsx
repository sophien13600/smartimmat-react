import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import Nav from "./components/Nav";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/Routes";
<<<<<<< HEAD
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthProvider >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
=======
import { AuthContext } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthContext value={false}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContext>
>>>>>>> f5c511f (push pull)
  );
}

export default App;
