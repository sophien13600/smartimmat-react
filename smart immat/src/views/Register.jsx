import Nav from "../components/Nav";
import {useState} from "react";
import api from "../../axios.config.js";

export default function Register() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [nom, setNom] = useState("");
 const [prenom, setPrenom] = useState("");
   async function handleSubmit (event) {
        event.preventDefault();
        //je recupere les inputs et je les envoie au backend
        try{
            const response = await api.post(
                "/api/auth/register",
                { email, nom, prenom, password },
                {
                    headers: { "Content-Type": "application/json"
                }

            });
            if(response){
                console.log(response.data);
            }

            }catch(error){
            console.error("Erreur de connexion:", error);
        }
    }

  return (
    <>
    <Nav/>
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Inscription</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
              type="email"
              className="form-control"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              id="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom
          </label>
          <input
              type="text"
              className="form-control"
              name="nom"
              onChange={(event) => setNom(event.target.value)}
              id="nom" />
        </div>
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">
            Prenom
          </label>
          <input
              type="text"
              className="form-control"
              name="prenom"
              onChange={(event) => setPrenom(event.target.value)}
              id="prenom" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            id="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Confirmer votre mot de passe
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            id="confirmPassword"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-modern"
        >
          S'inscrire
        </button>
      </form>
    </div>
    </>
  );
}