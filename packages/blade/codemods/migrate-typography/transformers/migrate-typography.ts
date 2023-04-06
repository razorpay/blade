import type { Transform } from 'jscodeshift';

const transformer: Transform = (file) => {
  const map = {
    s: 50,
    m: 50,
    l: 100,
    xl: 200,
    '2xl': 300,
    '3xl': 400,
    '4xl': 600,
    '5xl': 700,
    '6xl': 800,
  };

  const prefix = 'theme.typography.lineHeights';
  const newSource = file.source.replace(
    // gets both .s and ['2xl'] or ["2xl"]
    /theme\.typography\.lineHeights\.?((\w+)|(\W.*\]))/g,
    (_, match) => {
      const token = match.replace(/\[|\]|'|"/g, '');
      return `${prefix}[${map[token]}]`;
    },
  );

  return newSource;
};

export default transformer;
