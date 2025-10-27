import { useState, useEffect } from "react";
import api from "../../../axios.config";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger la liste des fichiers depuis le backend
  const fetchFiles = async () => {
    try {
      const res = await api.get("/api/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Erreur de récupération des fichiers:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload d’un ou plusieurs fichiers
  const onChoose = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setMessage("");
    setUploading(true);

    try {
      // Envoi un seul fichier à la fois (car le backend attend .single("file"))
      for (const f of selected) {
        const form = new FormData();
        form.append("file", f);
        await api.post("/api/files/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage("Téléversement réussi ✅");
      fetchFiles(); // Recharge la liste des fichiers après upload
    } catch (err) {
      console.error(err);
      setMessage("Le téléversement a échoué ❌");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Gestion du drag & drop
  const onDrop = (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const fileList = Array.from(dt.files || []);
    if (!fileList.length) return;
    const fakeEvent = { target: { files: fileList } };
    onChoose(fakeEvent);
  };

  // Téléchargement direct depuis le serveur
  const handleDownload = async (filename, originalName) => {
    try {
      const res = await api.get(`/api/files/download/${filename}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Erreur de téléchargement:", err);
    }
  };

  return (
    <div className="files-page">
      <h1 className="page-title">Mes fichiers</h1>
      <p className="page-sub">Gérez vos fichiers — téléversez et téléchargez facilement</p>

      <div
        className="upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="upload-icon">⬆️</div>
        <div className="upload-title">Téléverser des fichiers</div>
        <div className="upload-sub">
          Glissez-déposez vos fichiers ici ou cliquez pour parcourir
        </div>
        <div className="upload-hint">
          Formats supportés: JPG, PNG, PDF, DOCX, etc.
        </div>
        <label className="btn-choose">
          {uploading ? "Téléversement…" : "Choisir des fichiers"}
          <input
            type="file"
            multiple
            onChange={onChoose}
            disabled={uploading}
            hidden
          />
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
              <li key={idx} className="file-item flex justify-between items-center">
                <div>
                  <span className="file-name font-medium">{f.originalName}</span>
                  <span className="file-meta text-gray-500 text-sm ml-2">
                    {(f.size / 1024 / 1024).toFixed(2)} MB •{" "}
                    {new Date(f.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="download-btn bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDownload(f.filename, f.originalName)}
                >
                  Télécharger
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
