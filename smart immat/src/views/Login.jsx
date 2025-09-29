import { useContext } from "react";
import Nav from "../components/Nav";
import { useState } from "react";
import api from "../../axios.config";

export default function Login() {
  const { setIsAuthenticated,} = useContext(GlobalContext);
  const {setUser} = useContext(GlobalContext);
  const [email, setEmail] = useState("")
  const [password , setPassword] = useState("")
  const navigate = useNavigate();


  async function handleSubmit(event) {
    event.preventDefault();
    
    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email: email.current.value,
          password: password.current.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log('Réponse:', response.data.nom);
      if(response){
        localStorage.setItem('email', response.data.email)
        setUser(response.data.nom,response.data.role)
        setIsAuthenticated(true)
        
        //setUser(data)
        navigate('/')
        console.log('ok');
        
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
              setEmail ={(event) =>event.target.value}
              value ={email}
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
              setPassword ={(event) =>event.target.value}
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
