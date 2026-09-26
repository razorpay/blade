/** An icon as data: SVG markup (what `*.svg?raw` yields) or a URL. */
export type IconSource = string;

export function isIconMarkup(source: IconSource): boolean {
  return source.trimStart().startsWith('<');
}

/** What an `<img>` can load: markup becomes a data URI, a URL passes through. */
export function iconUrl(source: IconSource): string {
  return isIconMarkup(source)
    ? `data:image/svg+xml;utf8,${encodeURIComponent(source.trim())}`
    : source;
}
