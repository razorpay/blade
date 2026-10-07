// An SVG import is its URL: the icon set (`src-cx/icons`) re-exports its files
// this way, and a font plugin turns icon folders' imports into glyphs.
declare module '*.svg' {
  const url: string;
  export default url;
}

// Raw imports of the SVG icons (and the story READMEs): a string of the file's
// contents. Vite handles `?raw` natively; other bundlers need a raw-source rule.
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

declare module '*.md?raw' {
  // eslint-disable-next-line one-var -- each module declares its own export
  const content: string;
  export default content;
}

// A story's own source, for Storybook's "Show code".
declare module '*.svelte?raw' {
  // eslint-disable-next-line one-var -- each module declares its own export
  const content: string;
  export default content;
}
