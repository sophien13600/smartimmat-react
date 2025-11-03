import Nav from "../components/Nav";
import api from "../../axios.config";
import { useState } from "react";

export default function Dashboard() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [currentAction, setCurrentAction] = useState("");

  // Utilitaire générique pour appeler un endpoint qui renvoie un blob et déclencher le téléchargement
  const processAndDownload = async (
    endpoint,
    params = {},
    actionLabel = "traiter"
  ) => {
    setError("");
    setCurrentAction(actionLabel);
    setDownloading(true);
    try {
      const res = await api.get(endpoint, { params, responseType: "blob" });

      // Extraction du nom de fichier depuis l'en-tête Content-Disposition
      const dispo =
        res.headers?.["content-disposition"] ||
        res.headers?.get?.("content-disposition");
      let filename = "fichier.bin";
      if (dispo) {
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(
          dispo
        );
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
      console.error(e);
      setError(`Impossible de ${actionLabel} le fichier.`);
    } finally {
      setDownloading(false);
      setCurrentAction("");
    }
  };

  const downloadFile = async () => {
    await processAndDownload("/api/files/download", {}, "télécharger");
  };

  // Appeler le backend pour compresser avant de télécharger
  const compressFile = async () => {
    // endpoint backend attendu: GET /api/files/compress
    await processAndDownload("/api/files/compress", {}, "compresser");
  };

  // Appeler le backend pour convertir avant de télécharger
  const convertFile = async () => {
    // Demande un format à l'utilisateur (par défaut pdf)
    let format = window.prompt(
      "Format de conversion souhaité (pdf, docx, txt)",
      "pdf"
    );
    if (!format) format = "pdf";
    // endpoint backend attendu: GET /api/files/convert?format=pdf
    await processAndDownload("/api/files/convert", { format }, "convertir");
  };

  return (
    <div>
      <Nav />
      <div className="container py-4">
        <h1 className="mb-3">Tableau de bord</h1>
        <p className="text-muted">
          Bienvenue dans votre espace. Vous pouvez télécharger, compresser ou
          convertir un fichier ci-dessous.
        </p>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={downloadFile}
            disabled={downloading}
          >
            {downloading && currentAction === "télécharger"
              ? "Téléchargement…"
              : "Télécharger"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={compressFile}
            disabled={downloading}
          >
            {downloading && currentAction === "compresser"
              ? "Compression…"
              : "Compresser"}
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={convertFile}
            disabled={downloading}
          >
            {downloading && currentAction === "convertir"
              ? "Conversion…"
              : "Convertir"}
          </button>
        </div>

        {downloading && currentAction && (
          <p className="text-muted mt-3">
            Opération en cours : {currentAction}…
          </p>
        )}
      </div>
    </div>
  );
}
