import { Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import Login from "../views/Login";
const AppRoutes = () => {

   return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connexion" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes