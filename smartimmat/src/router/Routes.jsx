import PrivateRoute from "./PrivateRoute";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import Auth from "../views/Auth";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import DashboardLayout from "../views/dashboard/Layout";
import Files from "../views/dashboard/Files";
import Historique from "../views/dashboard/Historique";
import Profil from "../views/dashboard/Profil";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connexion" element={<Auth />} />
      <Route path="/inscription" element={<Auth />} />
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}> 
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="files" replace />} />
          <Route path="files" element={<Files />} />
          <Route path="historique" element={<Historique />} />
          <Route path="profil" element={<Profil />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
