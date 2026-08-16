// Trigger instant file download in browser
export function downloadFile(blobOrUrl, filename) {
  let url = blobOrUrl;
  let isCreatedUrl = false;

  if (blobOrUrl instanceof Blob) {
    url = URL.createObjectURL(blobOrUrl);
    isCreatedUrl = true;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (isCreatedUrl) {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
