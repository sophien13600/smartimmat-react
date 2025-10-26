import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../axios.config";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/auth.css";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, setToken } = useContext(AuthContext);

  const defaultTab = useMemo(() => {
    if (location.pathname.includes("inscription")) return "register";
    return "login";
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Shared state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register-only
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function decodeJwtPayload(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  async function handleLogin(e) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res?.data?.token) {
        const token = res.data.token;
        setToken(token);
        setIsAuthenticated(true);
        const payload = decodeJwtPayload(token);
        if (payload) {
          setUser({ email: payload.userEmail, nom: payload.userName });
        }
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Identifiants invalides ou erreur serveur.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post(
        "/api/auth/register",
        { email, password, nom, prenom },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res?.status >= 200 && res?.status < 300) {
        // After registration, switch to login tab with email pre-filled
        setActiveTab("login");
      }
    } catch (err) {
      setError("Impossible de créer le compte. Essayez à nouveau.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-page">
        <div className="app-branding">
          <div className="brand-icon" aria-hidden />
          <h1 className="brand-title">SmartImmat</h1>
          <p className="brand-subtitle">Gérez, convertissez et compressez vos fichiers</p>
        </div>

        <div className="tabs">
          <button
            className={"tab " + (activeTab === "login" ? "active" : "")}
            onClick={() => setActiveTab("login")}
            type="button"
          >
            Connexion
          </button>
          <button
            className={"tab " + (activeTab === "register" ? "active" : "")}
            onClick={() => setActiveTab("register")}
            type="button"
          >
            Inscription
          </button>
        </div>

        <div className="card">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="auth-form">
              <h3>Connexion</h3>
              <p className="helper-text">Connectez-vous à votre compte pour accéder à vos fichiers</p>

              {error && <div className="error">{error}</div>}

              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <label htmlFor="password" className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="primary" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <h3>Inscription</h3>
              {error && <div className="error">{error}</div>}

              <label htmlFor="regEmail" className="form-label">Email</label>
              <div className="input-wrapper">
                <input
                  id="regEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="nom" className="form-label">Nom</label>
              <div className="input-wrapper">
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="prenom" className="form-label">Prénom</label>
              <div className="input-wrapper">
                <input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="regPassword" className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <input
                  id="regPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="primary" disabled={loading}>
                {loading ? "Création…" : "Créer le compte"}
              </button>

              <div className="switch">
                Déjà un compte ? <button type="button" className="link" onClick={() => setActiveTab("login")}>Se connecter</button>
              </div>
            </form>
          )}
        </div>


      </div>
    </>
  );
}
