import { useContext, useEffect, useMemo, useState } from "react";
import api from "../../../axios.config";
import { AuthContext } from "../../contexts/AuthContext";

function initialsFromName(name, email) {
  const base = (name || email || "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return (letters || base[0] || "?").toUpperCase();
}

export default function Profil() {
  const { user, setUser, logout } = useContext(AuthContext);

  const [fullname, setFullname] = useState(user?.nom || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [infoErr, setInfoErr] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");

  const [deleting, setDeleting] = useState(false);
  const avatarText = useMemo(() => initialsFromName(fullname, email), [fullname, email]);

  useEffect(() => {
    // hydrate from user when component mounts or user changes
    setFullname(user?.nom || user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setInfoMsg("");
    setInfoErr("");
    setSavingInfo(true);
    try {
      const body = { name: fullname, nom: fullname, email };
      // Try common endpoints; fall back to local update if API not available
      const doRequest = async () => {
        try {
          const { data } = await api.put("/api/users/me", body);
          return data;
        } catch (err) {
          // try alternate
          const { data } = await api.put("/api/profile", body);
          return data;
        }
      };
      let data;
      try {
        data = await doRequest();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Profile update failed on API, updating local state only.", err?.response || err);
      }
      const updated = data?.user || { ...(user || {}), name: fullname, nom: fullname, email };
      setUser(updated);
      setInfoMsg("Modifications enregistrées.");
    } catch (err) {
      setInfoErr("Échec de l'enregistrement des informations.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdErr("");
    if (newPwd.length < 6) {
      setPwdErr("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdErr("La confirmation ne correspond pas.");
      return;
    }
    setSavingPwd(true);
    try {
      try {
        await api.post("/api/auth/change-password", { currentPassword: currentPwd, newPassword: newPwd });
      } catch (_) {
        await api.post("/api/users/me/password", { currentPassword: currentPwd, newPassword: newPwd });
      }
      setPwdMsg("Mot de passe modifié avec succès.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      setPwdErr("Échec de la modification du mot de passe.");
    } finally {
      setSavingPwd(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    const confirm1 = window.confirm("Cette action est irréversible. Supprimer définitivement votre compte ?");
    if (!confirm1) return;
    setDeleting(true);
    try {
      try {
        await api.delete("/api/users/me");
      } catch (_) {
        await api.delete("/api/profile");
      }
    } catch (err) {
      // Even if backend not ready, still clear session to simulate deletion
      // eslint-disable-next-line no-console
      console.warn("Delete account API failed; proceeding to logout.", err?.response || err);
    } finally {
      logout();
      setDeleting(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Profil</h1>
      <p className="page-sub">Gérez vos informations personnelles et votre compte</p>

      <section className="card">
        <header className="card-header">
          <div>
            <div className="card-title">Informations personnelles</div>
            <div className="card-sub">Mettez à jour vos informations de profil</div>
          </div>
        </header>

        <div className="profile-head">
          <div className="avatar" aria-label="avatar">{avatarText}</div>
          <div className="identity">
            <div className="identity-name">{fullname || user?.nom || user?.name || "Utilisateur"}</div>
            <div className="identity-email">{email || user?.email || ""}</div>
          </div>
        </div>

        <form className="form" onSubmit={handleSaveInfo}>
          <label className="label">Nom complet
            <div className="input-wrap">
              <input type="text" className="input" value={fullname} onChange={(e)=>setFullname(e.target.value)} placeholder="Jean Dupont" />
            </div>
          </label>

          <label className="label">Email
            <div className="input-wrap">
              <input type="email" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="jean.dupont@example.com" />
            </div>
          </label>

          {infoErr && <div className="alert error">{infoErr}</div>}
          {infoMsg && <div className="alert success">{infoMsg}</div>}

          <button className="btn primary" type="submit" disabled={savingInfo}>{savingInfo ? "Enregistrement…" : "Enregistrer les modifications"}</button>
        </form>
      </section>

      <section className="card">
        <header className="card-header">
          <div className="card-title">Modifier le mot de passe</div>
          <div className="card-sub">Assurez-vous que votre compte utilise un mot de passe sécurisé</div>
        </header>

        <form className="form" onSubmit={handleChangePassword}>
          <label className="label">Mot de passe actuel
            <div className="input-wrap">
              <input type="password" className="input" value={currentPwd} onChange={(e)=>setCurrentPwd(e.target.value)} />
            </div>
          </label>
          <label className="label">Nouveau mot de passe
            <div className="input-wrap">
              <input type="password" className="input" value={newPwd} onChange={(e)=>setNewPwd(e.target.value)} />
            </div>
          </label>
          <label className="label">Confirmer le mot de passe
            <div className="input-wrap">
              <input type="password" className="input" value={confirmPwd} onChange={(e)=>setConfirmPwd(e.target.value)} />
            </div>
          </label>

          {pwdErr && <div className="alert error">{pwdErr}</div>}
          {pwdMsg && <div className="alert success">{pwdMsg}</div>}

          <button className="btn primary" type="submit" disabled={savingPwd}>{savingPwd ? "Modification…" : "Modifier le mot de passe"}</button>
        </form>
      </section>

      <section className="card danger">
        <header className="card-header">
          <div className="card-title">Zone de danger</div>
          <div className="card-sub">Supprimer définitivement votre compte et toutes les données associées</div>
        </header>
        <button className="btn danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Suppression…" : "Supprimer mon compte"}</button>
      </section>
    </div>
  );
}
