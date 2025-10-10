//import { useContext,  } from "react";

import Nav from "../components/Nav";
import { useContext, useState } from "react";
import api from "../../axios.config";
//import { GlobalContext } from "../contexts/GlobalContext.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {Buffer} from "buffer";

export default function Login() {
  const { setIsAuthenticated, setUser} = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post(
        "/api/auth/login",
        { email, password },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        //     console.log(response.data);
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
          const buf = Buffer.from(`${email}`, 'utf-8');
          const base64String = buf.toString('base64');

        // localStorage.setItem("password", {password});
        setUser(localStorage.setItem("user", JSON.stringify(base64String)))
         
        setIsAuthenticated(true);
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
