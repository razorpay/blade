// Raw imports of the SVG icons (and the story READMEs): a string of the file's
// contents. Vite handles `?raw` natively; other bundlers need a raw-source rule.
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
