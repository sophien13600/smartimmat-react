import { useState } from "react";
import api from "../../../axios.config";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onChoose = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setMessage("");
    setUploading(true);
    try {
      // Optional: send to backend if available
      const form = new FormData();
      selected.forEach((f) => form.append("files", f));
      // If your backend route differs, adjust here
      await api.post("/api/files/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setFiles((prev) => [...selected.map(f => ({ name: f.name, size: f.size, type: f.type, date: new Date().toISOString().slice(0,10) })), ...prev]);
      setMessage("Téléversement réussi.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setMessage("Le téléversement a échoué (simulation si l'API n'existe pas).");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const fileList = Array.from(dt.files || []);
    if (!fileList.length) return;
    const fakeEvent = { target: { files: fileList } };
    onChoose(fakeEvent);
  };

  return (
    <div className="files-page">
      <h1 className="page-title">Mes fichiers</h1>
      <p className="page-sub">Gérez, convertissez et compressez vos fichiers</p>

      <div
        className="upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="upload-icon">⬆️</div>
        <div className="upload-title">Téléverser des fichiers</div>
        <div className="upload-sub">Glissez-déposez vos fichiers ici ou cliquez pour parcourir</div>
        <div className="upload-hint">Formats supportés: JPG, PNG, WEBP, AVIF, PDF (Max 10 MB)</div>
        <label className="btn-choose">
          {uploading ? "Téléversement…" : "Choisir des fichiers"}
          <input type="file" multiple onChange={onChoose} disabled={uploading} hidden />
        </label>
      </div>

      {message && <div className="note">{message}</div>}

      <section className="recent">
        <h2 className="recent-title">Fichiers récents</h2>
        {files.length === 0 ? (
          <div className="empty">Aucun fichier pour le moment.</div>
        ) : (
          <ul className="file-list">
            {files.map((f, idx) => (
              <li key={idx} className="file-item">
                <span className="file-name">{f.name}</span>
                <span className="file-meta">{(f.size/1024/1024).toFixed(2)} MB • {f.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
