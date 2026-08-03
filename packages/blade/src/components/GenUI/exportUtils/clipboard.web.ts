/**
 * Copies text to the clipboard using the async Clipboard API.
 *
 * @returns `true` when the copy succeeded, `false` otherwise. Never throws.
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export { copyToClipboard };
