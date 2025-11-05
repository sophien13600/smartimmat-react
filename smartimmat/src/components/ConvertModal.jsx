import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Lightweight modal component to choose output image format and optional compression
// This implementation does not rely on Tailwind. It uses inline styles + Bootstrap buttons
// so it renders as a real modal overlay above the page content in any setup.
// Props:
// - open: boolean
// - file: { filename, originalName, size, mimetype }
// - onCancel: () => void
// - onConfirm: (options: { format: string, compress: boolean }) => void
export default function ConvertModal({ open, file, onCancel, onConfirm }) {
  const [format, setFormat] = useState("png");
  const [compress, setCompress] = useState(false);

  useEffect(() => {
    // Reset defaults when modal opens
    if (open) {
      setFormat("png");
      setCompress(false);
      // lock scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      // cleanup on unmount
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1050, // above navbar/toolbars
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    backdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: "rgba(0,0,0,0.4)",
    },
    card: {
      position: "relative",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,.2)",
      width: 600,
      maxWidth: "95vw",
      padding: 24,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    fileBox: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "#f8fafc",
    },
    fileBadge: {
      height: 40,
      width: 40,
      borderRadius: 8,
      background: "#eef2ff",
      color: "#4f46e5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
    },
    optionLabel: {
      display: "block",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      cursor: "pointer",
    },
    footer: {
      marginTop: 24,
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
    },
  };

  const OptionRow = ({ value, title, description }) => (
    <label style={styles.optionLabel}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <input
          type="radio"
          name="format"
          value={value}
          checked={format === value}
          onChange={() => setFormat(value)}
          style={{ marginTop: 4 }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>{description}</div>
        </div>
      </div>
    </label>
  );

  const modal = (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onCancel} aria-hidden="true" />

      {/* Modal card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Convertir le fichier</div>
            <div style={{ color: "#6b7280" }}>Choisissez le format de sortie pour votre fichier</div>
          </div>
          <button className="btn btn-sm btn-light" onClick={onCancel} aria-label="Fermer">✕</button>
        </div>

        {file && (
          <div style={styles.fileBox}>
            <div style={styles.fileBadge}>
              {(file.mimetype || "").split("/")[1]?.toUpperCase()?.slice(0, 3) || "FILE"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.originalName || file.filename}
              </div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>
                {(file.mimetype || "").toUpperCase()} • {file.size ? (file.size / 1024 / 1024).toFixed(1) + " MB" : ""}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 8, fontWeight: 600 }}>Format de sortie</div>
        <div>
          <OptionRow value="png" title="PNG" description="Transparence, sans perte" />
          <OptionRow value="webp" title="WEBP" description="Moderne, optimisé web" />
          <OptionRow value="avif" title="AVIF" description="Dernière génération, très compact" />
          <OptionRow value="jpg" title="JPG" description="Compatible partout" />
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600 }}>Compresser après conversion</div>
            <div style={{ color: "#6b7280", fontSize: 14 }}>Réduire la taille du fichier</div>
          </div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={!!compress}
              onChange={(e) => setCompress(e.target.checked)}
            />
            <span style={{ fontSize: 14 }}>{compress ? "Activé" : "Désactivé"}</span>
          </label>
        </div>

        <div style={styles.footer}>
          <button className="btn btn-light" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={() => onConfirm({ format, compress })}>Convertir</button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
