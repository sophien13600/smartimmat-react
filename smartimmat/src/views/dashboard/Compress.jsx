import { useEffect, useMemo, useRef, useState } from "react";
import { compressImageAuto, compressPdfAuto, prettySize } from "../../utils/compressors";
import api from "../../../axios.config";

export default function Compress() {
  const [file, setFile] = useState(null);
  const [outBlob, setOutBlob] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [saveToHistory, setSaveToHistory] = useState(false);

  // Choix du type avant compression: "image" ou "pdf"
  const [typeChoice, setTypeChoice] = useState("image");
  const debounceRef = useRef(null);

  const inSize = useMemo(() => (file ? prettySize(file.size) : ""), [file]);
  const outSize = useMemo(() => (outBlob ? prettySize(outBlob.size) : ""), [outBlob]);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isImg = f.type.startsWith("image/");
    const isPdf = f.type === "application/pdf";
    if (typeChoice === "image" && !isImg) {
      setMsg("Type de fichier non valide. Veuillez choisir une image.");
      return;
    }
    if (typeChoice === "pdf" && !isPdf) {
      setMsg("Type de fichier non valide. Veuillez choisir un PDF.");
      return;
    }
    setFile(f);
    setOutBlob(null);
    setMsg("");
  };

  // Compression automatique dès qu'un fichier est choisi
  useEffect(() => {
    if (!file) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setBusy(true);
        setMsg("Compression en cours…");

        let compressed;
        if (typeChoice === "pdf") {
          compressed = await compressPdfAuto(file);
        } else {
          compressed = await compressImageAuto(file);
        }

        setOutBlob(compressed);
        setMsg("Compression terminée ✅");
      } catch (e) {
        console.error(e);
        setOutBlob(null);
        setMsg(e?.message || "La compression a échoué ❌");
      } finally {
        setBusy(false);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [file, typeChoice]);

  const downloadOut = () => {
    if (!outBlob || !file) return;
    const a = document.createElement("a");
    const url = URL.createObjectURL(outBlob);
    a.href = url;
    const name = file.name.replace(/(\.[^.]*)?$/, "-compressed$1");
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const uploadToHistory = async () => {
    if (!outBlob || !file) return;
    try {
      setBusy(true);
      const form = new FormData();
      const name = file.name.replace(/(\.[^.]*)?$/, "-compressed$1");
      form.append("file", new File([outBlob], name, { type: outBlob.type }));
      await api.post("/api/files/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg((m) => `${m} • Enregistré dans l'historique ✅`);
    } catch (e) {
      console.error(e);
      setMsg("Compression OK mais l'enregistrement a échoué ❌");
    } finally {
      setBusy(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setOutBlob(null);
    setMsg("");
    setSaveToHistory(false);
  };

  return (
    <div className="compress-page">
      <h1 className="page-title">Compresser un document</h1>
      <p className="page-sub">Sélectionnez d'abord le type, puis choisissez votre fichier. La compression démarre automatiquement.</p>

      <div className="card p-4 border rounded mb-4">
        <div className="flex items-center gap-3 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="typeChoice"
              value="image"
              checked={typeChoice === "image"}
              onChange={() => { setTypeChoice("image"); resetAll(); }}
              disabled={busy}
            />
            Image
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="typeChoice"
              value="pdf"
              checked={typeChoice === "pdf"}
              onChange={() => { setTypeChoice("pdf"); resetAll(); }}
              disabled={busy}
            />
            PDF
          </label>
        </div>

        <input
          type="file"
          accept={typeChoice === "pdf" ? "application/pdf" : "image/*"}
          onChange={onPick}
          disabled={busy}
        />

        {file && (
          <div className="mt-3 text-sm text-gray-600">Fichier: {file.name} • {file.type} • {inSize}</div>
        )}

        <div className="mt-4">
          <button className="bg-gray-200 px-3 py-2 rounded" onClick={resetAll} disabled={busy}>
            Réinitialiser
          </button>
        </div>

        {msg && <div className="mt-3 text-sm">{msg}</div>}
      </div>

      {outBlob && (
        <div className="card p-4 border rounded">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Résultat</div>
              <div className="text-sm text-gray-600">Avant: {inSize} • Après: {outSize}</div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={downloadOut} disabled={busy}>Télécharger</button>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={saveToHistory} onChange={(e) => setSaveToHistory(e.target.checked)} /> Enregistrer dans mon historique
              </label>
              <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={uploadToHistory} disabled={!saveToHistory || busy}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
