import Nav from "../components/Nav";
import api from "../../axios.config";
import { useState } from "react";

export default function Dashboard() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const downloadFile = async () => {
    setError("");
    setDownloading(true);
    try {
      const res = await api.get("/api/files/download", {
        responseType: "blob",
      });

      // Try to extract filename from headers, fallback
      const dispo = res.headers?.["content-disposition"] || res.headers?.get?.("content-disposition");
      let filename = "fichier.bin";
      if (dispo) {
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(dispo);
        filename = decodeURIComponent(match?.[1] || match?.[2] || filename);
      }

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError("Impossible de télécharger le fichier.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className="container py-4">
        <h1 className="mb-3">Tableau de bord</h1>
        <p className="text-muted">Bienvenue dans votre espace. Vous pouvez télécharger un fichier d'exemple ci-dessous.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary" onClick={downloadFile} disabled={downloading}>
          {downloading ? "Téléchargement…" : "Télécharger un fichier"}
        </button>
      </div>
    </div>
  );
}