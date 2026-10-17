// Small shared helpers used by the tool files.

// Escape text before putting it inside innerHTML (file names can contain < > & ").
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Load an image from a URL / data URL. Rejects with a readable message if the browser cannot open it
// (for example HEIC photos from some iPhones), instead of waiting forever.
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('This image could not be opened. Please use a JPG, PNG or WEBP file.'));
    img.src = src;
  });
}
