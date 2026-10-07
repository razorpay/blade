/** An image as data: SVG markup (what `*.svg?raw` yields) or a URL. */
export type ImageData = string;

export function isImageMarkup(source: ImageData): boolean {
  return source.trimStart().startsWith('<');
}

/** What an `<img>` can load: markup becomes a data URI, a URL passes through. */
export function imageUrl(source: ImageData): string {
  return isImageMarkup(source)
    ? `data:image/svg+xml;utf8,${encodeURIComponent(source.trim())}`
    : source;
}
