/**
 * Triggers a browser download of the given content by creating a temporary
 * object URL and clicking a synthetic anchor. Accepts either a `Blob` (e.g. a
 * generated PNG) or a string (e.g. a CSV), in which case a `Blob` is created
 * with the provided MIME type. The object URL is always revoked afterwards.
 */
const downloadBlob = (content: Blob | string, filename: string, mimeType: string): void => {
  const blob =
    typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const objectUrl = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    // Revoke on the next tick so the download has a chance to start in all browsers.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
};

export { downloadBlob };
