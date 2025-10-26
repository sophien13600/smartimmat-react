export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Smart Immat</h1>
      <p>Bienvenue. Veuillez vous connecter pour accéder au tableau de bord.</p>
      <p>
        <a className="btn btn-primary" href="/connexion">Aller à la connexion</a>
      </p>
    </div>
  );
}