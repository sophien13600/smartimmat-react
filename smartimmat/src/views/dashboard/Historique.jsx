import { useEffect, useState } from "react";
import api from "../../../axios.config";

export default function Historique() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/files/history");
      setHistory(res.data || []);
    } catch (e) {
      console.error("Erreur de récupération de l'historique:", e);
      setMessage("Impossible de charger l'historique ❌");
    } finally {
      setLoading(false);
    }
  };

  // Refresh when page opens, and when user returns focus to the tab
  useEffect(() => {
    fetchHistory();
    const onFocus = () => fetchHistory();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchHistory();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const downloadByFilename = async (filename) => {
    try {
      const res = await api.get(`/api/files/download/${filename}`, { responseType: "blob" });
      const dispo = res.headers?.["content-disposition"] || res.headers?.get?.("content-disposition");
      let downloadName = filename;
      if (dispo) {
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(dispo);
        downloadName = decodeURIComponent(match?.[1] || match?.[2] || downloadName);
      }
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (e) {
      console.error("Erreur de téléchargement:", e);
      setMessage("Le téléchargement a échoué ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/files/history/${id}`);
      setMessage("Élément supprimé de l'historique ✅");
      fetchHistory();
    } catch (e) {
      console.error(e);
      setMessage("La suppression a échoué ❌");
    }
  };

  return (
    <div className="history-page">
      <h1 className="page-title">Historique des traitements</h1>
      <p className="page-sub">Retrouvez vos fichiers compressés et convertis</p>

      {message && <div className="note">{message}</div>}
      {loading && <div className="empty">Chargement…</div>}

      {!loading && (
        history.length === 0 ? (
          <div className="empty">Aucun historique pour le moment.</div>
        ) : (
          <ul className="file-list">
            {history.map((h) => (
              <li key={h.id} className="file-item flex justify-between items-center">
                <div>
                  <span className="file-name font-medium">{h.resultFilename}</span>
                  <span className="file-meta text-gray-500 text-sm ml-2">
                    {h.action} • {h.size ? (h.size / 1024 / 1024).toFixed(2) + " MB" : "taille inconnue"} • {new Date(h.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="btn-group">
                  <button className="btn btn-outline-primary" onClick={() => downloadByFilename(h.resultFilename)}>
                    Télécharger
                  </button>
                  <button className="btn btn-danger ml-2" onClick={() => handleDelete(h.id)}>
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
