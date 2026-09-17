/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * These cover the failure modes that reached review on the last Figma token push, so a regression
 * shows up here instead of on a PR.
 */
const {
  collectDeclarationComments,
  collectFileBindings,
  matchesSegmentPattern,
  mergePreservedTokens,
  scanDeclaration,
  collectTokenPaths,
  collectTokenPathsFromSource,
  diffTokenPaths,
  findUnresolvableValueRoots,
  replaceDeclaration,
  serializeTokens,
  // eslint-disable-next-line import/no-commonjs
} = require('../tokenSerializer');

const EXPRESSION_ROOTS = ['globalColors', 'opacity'];

const THEME_DECLARATION = /const colors: ColorsWithModes = \{(.|\n)+?\n\};/gm;

const THEME_FILE = `import {
  colors as globalColors,
  opacity,
  elevation as themeElevation,
} from '~tokens/global';
import type { ThemeTokens, ColorsWithModes } from './theme';
import * as helpers from './helpers';
import defaultExport from './defaultExport';

const colors: ColorsWithModes = {
  onLight: {
    surface: {
      background: {
        primary: {
          faint: 'transparent',
          intense: globalColors.chromatic.azure[500],
        },
      },
    },
    overlay: {
      background: {
        subtle: \`hsla(0, 0%, 0%, \${opacity[8]})\`,
      },
    },
  },
};

const bladeTheme: ThemeTokens = { colors };

export default bladeTheme;
`;

describe('serializeTokens', () => {
  it('writes each tagged value kind in the form the theme file expects', () => {
    const serialized = serializeTokens(
      {
        faint: { k: 's', v: 'transparent' },
        intense: { k: 'e', v: 'globalColors.chromatic.azure[500]' },
        overlay: { k: 't', v: 'hsla(0, 0%, 0%, ${opacity[8]})' },
      },
      EXPRESSION_ROOTS,
    );

    expect(serialized).toContain("faint: 'transparent',");
    expect(serialized).toContain('intense: globalColors.chromatic.azure[500],');
    expect(serialized).toContain('overlay: `hsla(0, 0%, 0%, ${opacity[8]})`,');
  });

  it('quotes untagged values whose root is not an importable expression', () => {
    // the regression: the old serializer stripped quotes off every string, turning the literal
    // 'transparent' into a bare identifier that threw a ReferenceError on import
    const serialized = serializeTokens({ faint: 'transparent' }, EXPRESSION_ROOTS);

    expect(serialized).toContain("faint: 'transparent',");
    expect(serialized).not.toContain('faint: transparent,');
  });

  it('leaves untagged values whose root is an importable expression bare', () => {
    const serialized = serializeTokens(
      { intense: 'globalColors.chromatic.azure[500]' },
      EXPRESSION_ROOTS,
    );

    expect(serialized).toContain('intense: globalColors.chromatic.azure[500],');
  });

  it('preserves untagged template literal values', () => {
    const serialized = serializeTokens(
      { subtle: '`hsla(0, 0%, 0%, ${opacity[8]})`' },
      EXPRESSION_ROOTS,
    );

    expect(serialized).toContain('subtle: `hsla(0, 0%, 0%, ${opacity[8]})`,');
  });

  it('escapes quotes inside string values', () => {
    expect(serializeTokens({ odd: { k: 's', v: "it's" } }, EXPRESSION_ROOTS)).toContain(
      "odd: 'it\\'s',",
    );
  });

  it('writes numeric and identifier keys bare and quotes anything else', () => {
    const serialized = serializeTokens(
      { 50: { k: 's', v: 'a' }, azure: { k: 's', v: 'b' }, 'a-b': { k: 's', v: 'c' } },
      EXPRESSION_ROOTS,
    );

    expect(serialized).toContain('50:');
    expect(serialized).toContain('azure:');
    expect(serialized).toContain('"a-b":');
  });
});

describe('collectTokenPaths', () => {
  it('returns sorted leaf paths and treats a tagged value as a leaf, not a group', () => {
    const paths = collectTokenPaths({
      onLight: {
        surface: { background: { gray: { subtle: { k: 'e', v: 'globalColors.gray[100]' } } } },
        transparent: { k: 's', v: 'transparent' },
      },
    });

    expect(paths).toEqual(['onLight.surface.background.gray.subtle', 'onLight.transparent']);
  });
});

describe('collectFileBindings', () => {
  const bindings = collectFileBindings(THEME_FILE);

  it.each([
    ['a named import', 'opacity'],
    ['an aliased named import', 'globalColors'],
    ['a namespace import', 'helpers'],
    ['a default import', 'defaultExport'],
    ['a top level declaration', 'bladeTheme'],
  ])('finds %s', (_label, name) => {
    expect(bindings.has(name)).toBe(true);
  });

  it('skips type-only imports, which are erased at runtime', () => {
    expect(bindings.has('ColorsWithModes')).toBe(false);
    expect(bindings.has('ThemeTokens')).toBe(false);
  });
});

describe('findUnresolvableValueRoots', () => {
  it('reports a bare value the target file cannot resolve', () => {
    const declarationSource = serializeTokens(
      { faint: { k: 'e', v: 'transparent' }, muted: { k: 'e', v: 'someOtherRoot.x' } },
      EXPRESSION_ROOTS,
    );

    expect(findUnresolvableValueRoots({ fileContent: THEME_FILE, declarationSource })).toEqual([
      'someOtherRoot',
      'transparent',
    ]);
  });

  it('reports rather than crashes on an index a Figma variable named `000` produces', () => {
    // `[000]` is an octal literal, which strict mode rejects outright — the check used to throw
    // and take the whole push down instead of naming the unresolvable root
    const declarationSource = serializeTokens(
      { subtle: { k: 'e', v: '_styles.button.primary.default[000]' } },
      EXPRESSION_ROOTS,
    );

    expect(findUnresolvableValueRoots({ fileContent: THEME_FILE, declarationSource })).toEqual([
      '_styles',
    ]);
  });

  it('accepts values rooted in identifiers the file imports or declares', () => {
    const declarationSource = serializeTokens(
      {
        faint: { k: 's', v: 'transparent' },
        intense: { k: 'e', v: 'globalColors.chromatic.azure[500]' },
        subtle: { k: 't', v: 'hsla(0, 0%, 0%, ${opacity[8]})' },
      },
      EXPRESSION_ROOTS,
    );

    expect(findUnresolvableValueRoots({ fileContent: THEME_FILE, declarationSource })).toEqual([]);
  });
});

describe('collectTokenPathsFromSource', () => {
  it('reads the token paths already in a theme file', () => {
    const { paths, matchCount } = collectTokenPathsFromSource(THEME_FILE, THEME_DECLARATION);

    expect(matchCount).toBe(1);
    expect(paths).toEqual([
      'onLight.overlay.background.subtle',
      'onLight.surface.background.primary.faint',
      'onLight.surface.background.primary.intense',
    ]);
  });

  it('reports the match count when the declaration is missing so the file is not written blind', () => {
    expect(collectTokenPathsFromSource('const other = {};', THEME_DECLARATION).matchCount).toBe(0);
  });
});

describe('replaceDeclaration', () => {
  it('replaces a single declaration without treating `$` in values as a replacement pattern', () => {
    const { content, matchCount } = replaceDeclaration({
      fileContent: THEME_FILE,
      declarationRegex: THEME_DECLARATION,
      replacement: 'const colors: ColorsWithModes = {\n  a: `hsla(0, 0%, 0%, ${opacity[8]})`,\n};',
    });

    expect(matchCount).toBe(1);
    expect(content).toContain('a: `hsla(0, 0%, 0%, ${opacity[8]})`,');
  });

  it('leaves the file untouched when the declaration does not match exactly once', () => {
    const fileContent = `${THEME_FILE}\n${THEME_FILE}`;
    const { content, matchCount } = replaceDeclaration({
      fileContent,
      declarationRegex: THEME_DECLARATION,
      replacement: 'const colors: ColorsWithModes = {};',
    });

    expect(matchCount).toBe(2);
    expect(content).toBe(fileContent);
  });
});

describe('collectDeclarationComments', () => {
  // Figma has no concept of a deprecated token, so `// @deprecated` lives only in the source and
  // every regeneration used to drop it.
  const COMMENTED_FILE = `const colors: ColorsWithModes = {
  onLight: {
    popup: {
      // @deprecated
      // Use popup.background.gray.subtle instead
      subtle: globalColors.gray[100],
    },
    // this group is on its way out
    legacy: {
      intense: globalColors.gray[900],
    },
  },
};
`;

  it('keys comment lines by the token path they sit above', () => {
    expect(collectDeclarationComments(COMMENTED_FILE, THEME_DECLARATION)).toEqual({
      'onLight.popup.subtle': ['// @deprecated', '// Use popup.background.gray.subtle instead'],
      'onLight.legacy': ['// this group is on its way out'],
    });
  });

  it('re-attaches them to the regenerated declaration', () => {
    const comments = collectDeclarationComments(COMMENTED_FILE, THEME_DECLARATION);
    const serialized = serializeTokens(
      { onLight: { popup: { subtle: { k: 'e', v: 'globalColors.gray[100]' } } } },
      EXPRESSION_ROOTS,
      { comments },
    );

    expect(serialized).toContain('// @deprecated');
    expect(serialized).toContain('// Use popup.background.gray.subtle instead');
  });

  it('drops comments for token paths the payload no longer has', () => {
    const comments = collectDeclarationComments(COMMENTED_FILE, THEME_DECLARATION);
    const serialized = serializeTokens(
      { onLight: { popup: { moderate: { k: 'e', v: 'globalColors.gray[100]' } } } },
      EXPRESSION_ROOTS,
      { comments },
    );

    expect(serialized).not.toContain('@deprecated');
  });
});

describe('mergePreservedTokens', () => {
  // Figma only knows the tokens somebody authored there. Deprecated aliases are kept in code so
  // consumers do not break, and a regeneration from the payload alone deletes them — which is
  // exactly how `popup.[background|border].[subtle|intense]` vanished from a release.
  const DEPRECATED_FILE = `const colors: ColorsWithModes = {
  onLight: {
    popup: {
      background: {
        // @deprecated
        subtle: globalColors.gray[100],
        gray: {
          moderate: globalColors.gray[200],
        },
      },
    },
  },
};
`;

  const payloadWithoutDeprecated = {
    onLight: {
      popup: { background: { gray: { moderate: { k: 'e', v: 'globalColors.gray[200]' } } } },
    },
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const scanned = () => scanDeclaration(DEPRECATED_FILE, THEME_DECLARATION);

  it('carries a code-only token back in with its source text intact', () => {
    const { values, childOrder } = scanned();
    const { tree, preserved } = mergePreservedTokens({
      tree: payloadWithoutDeprecated,
      existingValues: values,
      preservedPaths: ['*.popup.background.subtle'],
      childOrder,
    });

    expect(preserved).toEqual(['onLight.popup.background.subtle']);
    expect(serializeTokens(tree, EXPRESSION_ROOTS)).toContain('subtle: globalColors.gray[100],');
  });

  it('puts it back where it was rather than appending it to the group', () => {
    const { values, childOrder, comments } = scanned();
    const { tree } = mergePreservedTokens({
      tree: payloadWithoutDeprecated,
      existingValues: values,
      preservedPaths: ['*.popup.background.subtle'],
      childOrder,
    });
    const serialized = serializeTokens(tree, EXPRESSION_ROOTS, { comments });

    // `subtle` came before `gray` in the file and has to stay there, or a no-op push shows up as
    // a pile of moved lines
    expect(serialized.indexOf('subtle:')).toBeLessThan(serialized.indexOf('gray:'));
    expect(serialized).toContain('// @deprecated');
  });

  it('leaves the payload in charge wherever the payload has an opinion', () => {
    const { values, childOrder } = scanned();
    const { tree, preserved } = mergePreservedTokens({
      tree: {
        onLight: { popup: { background: { subtle: { k: 'e', v: 'globalColors.gray[900]' } } } },
      },
      existingValues: values,
      preservedPaths: ['*.popup.background.subtle'],
      childOrder,
    });

    expect(preserved).toEqual([]);
    expect(serializeTokens(tree, EXPRESSION_ROOTS)).toContain('subtle: globalColors.gray[900],');
  });

  it('drops the token once its path is taken off the list', () => {
    const { values, childOrder } = scanned();
    const { tree, preserved } = mergePreservedTokens({
      tree: payloadWithoutDeprecated,
      existingValues: values,
      preservedPaths: [],
      childOrder,
    });

    expect(preserved).toEqual([]);
    expect(serializeTokens(tree, EXPRESSION_ROOTS)).not.toContain('globalColors.gray[100]');
  });
});

describe('matchesSegmentPattern', () => {
  it.each([
    ['onLight.popup.background.subtle', '*.popup.background.subtle', true],
    ['onDark.popup.background.subtle', '*.popup.background.subtle', true],
    ['onLight.popup.background.gray.subtle', '*.popup.background.subtle', false],
    ['onLight.popup.border.subtle', '*.popup.background.subtle', false],
  ])('%s vs %s -> %s', (path, pattern, expected) => {
    expect(matchesSegmentPattern(path, pattern)).toBe(expected);
  });
});

describe('diffTokenPaths', () => {
  it('separates added from removed paths', () => {
    expect(diffTokenPaths(['a.b', 'a.c'], ['a.c', 'a.d'])).toEqual({
      added: ['a.d'],
      removed: ['a.b'],
    });
  });
});
