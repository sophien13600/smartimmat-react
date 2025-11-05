// Simple client-side compression utilities for images and PDFs
// Image compression uses Canvas to resize and re-encode at lower quality.
// PDF compression (MVP) rasterizes each page to JPEG using pdfjs-dist, then rebuilds
// a new PDF with jpeg-encoded pages using pdf-lib. This will turn vector/text into images
// but achieves predictable size reduction.

import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Utility: read a File/Blob into an HTMLImageElement
async function loadImageFromFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(e);
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Draw image into canvas with optional maxWidth/maxHeight, keeping aspect ratio
function drawToCanvas(img, { maxWidth, maxHeight }) {
  const { width, height } = img;
  let targetW = width;
  let targetH = height;

  if (maxWidth || maxHeight) {
    const ratio = width / height;
    if (maxWidth && targetW > maxWidth) {
      targetW = maxWidth;
      targetH = Math.round(targetW / ratio);
    }
    if (maxHeight && targetH > maxHeight) {
      targetH = maxHeight;
      targetW = Math.round(targetH * ratio);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas;
}

export async function compressImage(file, options = {}) {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.7, mimeType } = options;
  if (!file || !file.type.startsWith('image/')) throw new Error('Fichier image attendu');

  const img = await loadImageFromFile(file);
  const canvas = drawToCanvas(img, { maxWidth, maxHeight });
  const type = mimeType || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) throw new Error('Echec de la compression');
  return blob;
}

// Heuristic-based automatic image compression preserving aspect ratio and choosing optimal quality/size
export async function compressImageAuto(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Fichier image attendu');
  // Large file guard
  if (file.size > 40 * 1024 * 1024) throw new Error('Image trop volumineuse (>40MB)');

  // Load to get dimensions
  const img = await loadImageFromFile(file);
  const pxCount = img.width * img.height;

  // Decide target max dimension based on megapixels
  // > 16MP: cap to 2560; > 8MP: 2048; > 3MP: 1920; else keep size
  let maxDim = 0;
  if (pxCount > 16_000_000) maxDim = 2560;
  else if (pxCount > 8_000_000) maxDim = 2048;
  else if (pxCount > 3_000_000) maxDim = 1920;
  else maxDim = Math.max(img.width, img.height); // no resize

  const canvas = drawToCanvas(img, { maxWidth: maxDim, maxHeight: maxDim });

  // Determine if the image has transparency; if yes keep PNG to preserve
  const ctx = canvas.getContext('2d');
  const sample = ctx.getImageData(0, 0, Math.min(32, canvas.width), Math.min(32, canvas.height)).data;
  let hasAlpha = false;
  for (let i = 3; i < sample.length; i += 4) {
    if (sample[i] < 255) { hasAlpha = true; break; }
  }

  // Choose mime type and quality
  const isPngInput = file.type === 'image/png';
  const mimeType = hasAlpha ? 'image/png' : 'image/jpeg';

  // Quality heuristic (JPEG only). Favor visual quality while reducing size.
  // Base on original size and resized pixels
  let quality = 0.82; // default good balance
  const mb = file.size / (1024 * 1024);
  if (mb > 12) quality = 0.7;
  else if (mb > 6) quality = 0.75;
  else if (mb > 3) quality = 0.8;
  else quality = 0.85;

  // For small images after downscale, bump a bit
  if (pxCount < 2_000_000) quality = Math.min(0.9, quality + 0.05);

  // PNG: quality parameter is ignored; let browser choose compression
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, mimeType === 'image/jpeg' ? quality : undefined));
  if (!blob) throw new Error('Echec de la compression');
  return blob;
}

// Render a PDF page to a canvas as an image
async function renderPdfPage(page, scale = 1.0) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

export async function compressPdf(file, options = {}) {
  const { scale = 1.0, jpegQuality = 0.7 } = options;
  if (!file || file.type !== 'application/pdf') throw new Error('Fichier PDF attendu');

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const outPdf = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const canvas = await renderPdfPage(page, scale);

    // Convert canvas to JPEG blob and embed into new PDF
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', jpegQuality));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await outPdf.embedJpg(bytes);

    const pageW = embedded.width;
    const pageH = embedded.height;
    const outPage = outPdf.addPage([pageW, pageH]);
    outPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
    });
  }

  // Optionally add minimal metadata
  outPdf.setTitle('Compressed PDF');
  outPdf.setProducer('SmartImmat');
  outPdf.setCreator('SmartImmat');

  const outBytes = await outPdf.save();
  return new Blob([outBytes], { type: 'application/pdf' });
}

// Automatic PDF compression with tuned defaults for good quality vs size
export async function compressPdfAuto(file) {
  if (!file || file.type !== 'application/pdf') throw new Error('Fichier PDF attendu');
  if (file.size > 40 * 1024 * 1024) throw new Error('PDF trop volumineux (>40MB)');
  // Keep scale at 1.0 to preserve readability, use slightly reduced JPEG quality
  return compressPdf(file, { scale: 1.0, jpegQuality: 0.72 });
}

export function prettySize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
