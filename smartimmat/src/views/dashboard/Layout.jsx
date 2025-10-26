import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/dashboard.css";

export default function DashboardLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  return (
    <div className="dash-grid">
      <aside className="dash-aside">
        <div className="brand">
          <div className="brand-icon">📁</div>
          <div>
            <div className="brand-title">SmartImmat</div>
            <div className="brand-sub">Pro</div>
          </div>
        </div>
        <nav className="menu">
          <NavLink to="files" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>Mes fichiers</NavLink>
          <NavLink to="historique" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>Historique</NavLink>
          <NavLink to="profil" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>Profil</NavLink>
        </nav>
        <button className="logout" onClick={handleLogout}>Déconnexion</button>
      </aside>
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}
