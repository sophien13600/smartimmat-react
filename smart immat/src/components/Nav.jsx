import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            Smart Immat
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll"></div>
          <div className="col-12 col-lg-4 d-flex justify-content-lg-end justify-content-start">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="">
                  Compresser
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="">
                  Convertir
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-outline-primary mx-3" to="">
                  S'inscrire
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-primary" to="/connexion">
                  Connexion
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
