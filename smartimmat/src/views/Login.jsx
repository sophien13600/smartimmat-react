//import { useContext,  } from "react";

import Nav from "../components/Nav";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../../axios.config";

export default function Login() {
  const { setIsAuthenticated, setUser, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await api.post(
        "/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token)
        setToken(token);
        setIsAuthenticated(true);

        // Optionally decode token to populate user context
        const payload = decodeJwtPayload(token);
        const userData = { email: payload.userEmail, nom: payload.userName }
        if (response.data.token) {
          setUser({ email: payload.userEmail, nom: payload.userName });
        }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  }

  return (
    <>
      <Nav />
      <div className="form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Connexion</h2>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              id="email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
            />
          </div>
          <button className="btn btn-primary btn-modern">Connexion</button>
        </form>
      </div>
    </>
  );
}
