import Nav from "../components/Nav";

export default function Register() {
  return (
    <>
    <Nav/>
    <div className="form-container">
      <form className="auth-form" action="/inscription" method="post">
        <h2>Inscription</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input type="email" className="form-control" name="email" id="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom
          </label>
          <input type="text" className="form-control" name="nom" id="nom" />
        </div>
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">
            Prenom
          </label>
          <input type="text" className="form-control" name="prenom" id="prenom" />
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
          name="role"
          value="abonne"
          className="btn btn-primary btn-modern"
        >
          S'inscrire
        </button>
      </form>
    </div>
    </>
  );
}