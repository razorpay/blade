/**
 * Turning a Figma token payload into TypeScript source, and reading the source back.
 *
 * The old serializer stripped quotes off every string value with a blanket regex, which is how
 * `faint: 'transparent'` shipped as a bare `transparent` identifier and threw a ReferenceError the
 * moment the theme was imported. Values are now tagged by the plugin (expression / string /
 * template) and, for payloads from older plugin builds, inferred from `expressionRoots` instead of
 * assumed. Everything written is then read back and checked against the bindings the target file
 * actually has.
 */

const IDENTIFIER_REGEX = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const NUMERIC_KEY_REGEX = /^\d+$/;

// Value kinds emitted by the plugin. Short keys keep the gzipped workflow_dispatch payload small.
const EXPRESSION = 'e'; // written bare:      globalColors.chromatic.azure[500]
const STRING = 's'; // written quoted:    'transparent'
const TEMPLATE = 't'; // written in backticks: `hsla(0, 0%, 0%, ${opacity[8]})`
// Not emitted by the plugin. Source text lifted straight out of the file being rewritten, for
// tokens that are preserved rather than regenerated.
const RAW = 'r';

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** A `{ k, v }` pair emitted by the plugin, as opposed to a nested token group. */
const isTaggedValue = (value) =>
  isPlainObject(value) && typeof value.k === 'string' && typeof value.v === 'string';

const isLeaf = (value) => !isPlainObject(value) || isTaggedValue(value);

const quote = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** First identifier in a member expression: `globalColors.chromatic.azure[500]` -> `globalColors`. */
const rootOf = (expression) => String(expression).split(/[.[(]/)[0].trim();

/**
 * Untagged values come from plugin builds predating value tagging. The workflow always runs the
 * script from master while plugin builds are installed by hand, so those payloads stay in
 * circulation and have to keep working — just without the guesswork that broke `transparent`.
 */
const serializeUntaggedValue = (value, expressionRoots) => {
  const raw = String(value);
  // Already-quoted forms carry their own kind: backticks a template, single quotes a string.
  if (raw.startsWith('`') && raw.endsWith('`')) {
    return raw;
  }
  if (raw.length > 1 && raw.startsWith("'") && raw.endsWith("'")) {
    return raw;
  }
  // Otherwise infer it, which is all a payload from an older plugin build gives us to go on.
  return expressionRoots.includes(rootOf(raw)) ? raw : quote(raw);
};

const serializeValue = (value, expressionRoots) => {
  if (!isTaggedValue(value)) {
    return serializeUntaggedValue(value, expressionRoots);
  }
  if (value.k === EXPRESSION || value.k === RAW) {
    return value.v;
  }
  if (value.k === TEMPLATE) {
    return `\`${value.v}\``;
  }
  return quote(value.v);
};

const serializeKey = (key) =>
  IDENTIFIER_REGEX.test(key) || NUMERIC_KEY_REGEX.test(key) ? key : JSON.stringify(key);

/**
 * Serializes a token tree into a JS object literal. Output is re-formatted by prettier afterwards,
 * so the indentation here only matters when a failure gets printed.
 *
 * `comments` re-attaches comment lines harvested from the file being overwritten, keyed by token
 * path. Without it every push silently strips the `// @deprecated` markers that are the only
 * warning consumers of those tokens get.
 */
const serializeTokens = (
  tree,
  expressionRoots = [],
  { comments = {}, path = '', depth = 1 } = {},
) => {
  const pad = '  '.repeat(depth);
  const closingPad = '  '.repeat(depth - 1);

  const entries = Object.entries(tree).map(([key, value]) => {
    const tokenPath = path ? `${path}.${key}` : key;
    const serialized = isLeaf(value)
      ? serializeValue(value, expressionRoots)
      : serializeTokens(value, expressionRoots, { comments, path: tokenPath, depth: depth + 1 });

    const attached = (comments[tokenPath] ?? []).map((comment) => `${pad}${comment}`);
    return [...attached, `${pad}${serializeKey(key)}: ${serialized},`].join('\n');
  });

  return entries.length ? `{\n${entries.join('\n')}\n${closingPad}}` : '{}';
};

/** Every leaf path in a token tree, dotted and sorted, for diffing one payload against another. */
const collectTokenPaths = (tree, prefix = '', collected = []) => {
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isLeaf(value)) {
      collected.push(path);
    } else {
      collectTokenPaths(value, path, collected);
    }
  }
  return collected.sort();
};

/**
 * Identifiers that resolve at module scope in a source file: named/default/namespace imports and
 * top-level declarations. Type-only imports are skipped — they are erased at runtime, so a value
 * leaning on one still throws.
 */
const collectFileBindings = (fileContent) => {
  const bindings = new Set();

  const importRegex = /import\s+(type\s+)?([^;]+?)\s+from\s+['"][^'"]+['"]/g;
  let match = importRegex.exec(fileContent);
  while (match) {
    const [, isTypeOnly, clause] = match;
    if (!isTypeOnly) {
      const namedBlock = /\{([^}]*)\}/.exec(clause);
      if (namedBlock) {
        namedBlock[1]
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
          .forEach((entry) => {
            if (entry.startsWith('type ')) return;
            const alias = /\sas\s+([A-Za-z_$][\w$]*)$/.exec(entry);
            bindings.add(alias ? alias[1] : entry);
          });
      }
      const namespaceImport = /\*\s+as\s+([A-Za-z_$][\w$]*)/.exec(clause);
      if (namespaceImport) bindings.add(namespaceImport[1]);
      const defaultImport = /^([A-Za-z_$][\w$]*)\s*(?:,|$)/.exec(clause.trim());
      if (defaultImport) bindings.add(defaultImport[1]);
    }
    match = importRegex.exec(fileContent);
  }

  const declarationRegex = /^(?:export\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm;
  match = declarationRegex.exec(fileContent);
  while (match) {
    bindings.add(match[1]);
    match = declarationRegex.exec(fileContent);
  }

  return bindings;
};

/**
 * Proxy that records the property path it was walked down, so an object literal full of member
 * expressions can be evaluated without the real modules being present. Also survives template
 * literal interpolation.
 */
const makePathProxy = (path) =>
  new Proxy(function pathProxy() {}, {
    get(target, property) {
      if (property === Symbol.toPrimitive) return () => path;
      if (property === 'toString' || property === 'valueOf') return () => path;
      if (typeof property === 'symbol') return undefined;
      return makePathProxy(`${path}.${String(property)}`);
    },
    apply() {
      return makePathProxy(path);
    },
  });

const MAX_RESOLUTION_ATTEMPTS = 64;

/**
 * Evaluates an object literal with every free identifier stubbed out, returning both the resulting
 * tree and the identifiers that were not in `availableRoots`. That second list is the check the old
 * pipeline was missing: a non-empty result means the file references something it cannot resolve.
 */
const parseObjectLiteralSource = (source, availableRoots = []) => {
  const roots = new Set(availableRoots.filter((name) => IDENTIFIER_REGEX.test(name)));
  const missingRoots = [];

  for (let attempt = 0; attempt < MAX_RESOLUTION_ATTEMPTS; attempt++) {
    const names = [...roots];
    try {
      // Deliberately sloppy mode. A Figma variable named `000` produces `someToken[000]`, which
      // strict mode rejects outright as an octal literal — crashing the push instead of reporting
      // it. The numeric value is irrelevant here; only the leaf paths and the free identifiers are.
      // eslint-disable-next-line no-new-func
      const evaluate = new Function(...names, `return (${source});`);
      return { tree: evaluate(...names.map((name) => makePathProxy(name))), missingRoots };
    } catch (error) {
      const undefinedIdentifier = /^([A-Za-z_$][\w$]*) is not defined$/.exec(error.message ?? '');
      if (error instanceof ReferenceError && undefinedIdentifier) {
        missingRoots.push(undefinedIdentifier[1]);
        roots.add(undefinedIdentifier[1]);
        continue;
      }
      throw new Error(`Could not parse the token declaration: ${error.message}`);
    }
  }

  throw new Error(
    `Gave up resolving the token declaration after ${MAX_RESOLUTION_ATTEMPTS} unresolved identifiers.`,
  );
};

const extractDeclarationBody = (fileContent, declarationRegex) => {
  const matches = fileContent.match(new RegExp(declarationRegex.source, declarationRegex.flags));
  if (!matches || matches.length !== 1) {
    return { body: null, matchCount: matches ? matches.length : 0 };
  }
  const openingBrace = matches[0].indexOf('{');
  const closingBrace = matches[0].lastIndexOf('}');
  return { body: matches[0].slice(openingBrace, closingBrace + 1), matchCount: 1 };
};

const COMMENT_LINE_REGEX = /^(\/\/|\/\*|\*)/;
const GROUP_LINE_REGEX = /^([A-Za-z0-9_$]+|'[^']*'|"[^"]*"):\s*\{$/;
const LEAF_LINE_REGEX = /^([A-Za-z0-9_$]+|'[^']*'|"[^"]*"):\s*(.+?),?$/;
// prettier moves a value that does not fit onto the line after its key
const WRAPPED_KEY_LINE_REGEX = /^([A-Za-z0-9_$]+|'[^']*'|"[^"]*"):$/;

const unquoteKey = (key) => key.replace(/^['"]|['"]$/g, '');

/**
 * Brackets a value has opened and not yet closed. Quoted strings are dropped first so a literal
 * `'('` does not count. A positive result means prettier broke the value over several lines.
 */
const openBracketCount = (text) => {
  let depth = 0;
  for (const char of text.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, '')) {
    if ('([{'.includes(char)) depth++;
    else if (')]}'.includes(char)) depth--;
  }
  return depth;
};

/**
 * Reads a prettier-formatted declaration into two path-keyed maps: the comment lines sitting above
 * each entry, and the raw source text of each leaf value.
 *
 * Both exist because Figma is not the whole story. It has no concept of a deprecated token, so
 * `// @deprecated` and the tokens it marks live only in the source; a regeneration that does not
 * carry them over deletes them.
 */
const scanDeclaration = (fileContent, declarationRegex) => {
  const { body } = extractDeclarationBody(fileContent, declarationRegex);
  if (!body) return { comments: {}, values: {} };

  const comments = {};
  const values = {};
  /** Parent path -> child keys in the order the file lists them. */
  const childOrder = {};
  const stack = [];
  let pending = [];
  /**
   * A leaf whose value continues on the following lines: wrapped onto the next line after a bare
   * `key:`, or broken across several. Lines are collected until its brackets balance, because a
   * truncated value would show up as a bogus change and, for a preserved token, be written back.
   */
  let openValue = null;
  const settleValue = (path, text) => {
    if (openBracketCount(text) > 0) {
      openValue = { path, text };
    } else {
      values[path] = text.replace(/,$/, '');
    }
  };

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    if (!line || (line === '{' && !openValue)) continue;

    if (openValue) {
      const { path, text } = openValue;
      openValue = null;
      settleValue(path, text ? `${text}\n${line}` : line);
      continue;
    }

    if (COMMENT_LINE_REGEX.test(line)) {
      pending.push(line);
      continue;
    }

    if (line === '}' || line === '},') {
      stack.pop();
      pending = [];
      continue;
    }

    const wrappedKey = WRAPPED_KEY_LINE_REGEX.exec(line);
    const group = wrappedKey ? null : GROUP_LINE_REGEX.exec(line);
    const leaf = wrappedKey || group ? null : LEAF_LINE_REGEX.exec(line);
    const key = unquoteKey((wrappedKey ?? group ?? leaf)?.[1] ?? '');
    if (!key) {
      pending = [];
      continue;
    }

    const parentPath = stack.join('.');
    const path = [...stack, key].join('.');
    childOrder[parentPath] = [...(childOrder[parentPath] ?? []), key];

    if (pending.length) {
      comments[path] = pending;
      pending = [];
    }
    if (group) {
      stack.push(key);
    } else if (wrappedKey) {
      openValue = { path, text: '' };
    } else {
      settleValue(path, leaf[2]);
    }
  }

  return { comments, values, childOrder };
};

/** Comment lines in a declaration, keyed by the token path they sit above. */
const collectDeclarationComments = (fileContent, declarationRegex) => {
  const { comments } = scanDeclaration(fileContent, declarationRegex);
  return comments;
};

/** Segment-wise glob where `*` matches exactly one segment: `*.popup.background.subtle`. */
const matchesSegmentPattern = (path, pattern) => {
  const pathSegments = path.split('.');
  const patternSegments = pattern.split('.');
  if (pathSegments.length !== patternSegments.length) return false;
  return patternSegments.every(
    (segment, index) => segment === '*' || segment === pathSegments[index],
  );
};

/**
 * Carries tokens that exist in the file but not in the payload back into the tree.
 *
 * Figma only knows about tokens somebody authored there. Deprecated aliases are kept in code
 * purely so consumers do not break, so a regeneration from Figma alone deletes them — which is
 * how `popup.[background|border].[subtle|intense]` disappeared out from under a release.
 *
 * The existing source text is reinserted verbatim, so whatever the file already said stays true.
 * A path the payload does define is left alone: Figma wins wherever Figma has an opinion.
 */
const mergePreservedTokens = ({ tree, existingValues, preservedPaths, childOrder = {} }) => {
  const preserved = [];
  if (!preservedPaths?.length) return { tree, preserved };

  const merged = JSON.parse(JSON.stringify(tree));
  const touchedParents = new Set();

  for (const path of Object.keys(existingValues)) {
    if (!preservedPaths.some((pattern) => matchesSegmentPattern(path, pattern))) continue;

    const segments = path.split('.');
    const leafKey = segments.pop();
    let cursor = merged;
    for (const segment of segments) {
      if (!isPlainObject(cursor[segment])) cursor[segment] = {};
      cursor = cursor[segment];
    }
    if (cursor[leafKey] !== undefined) continue;

    cursor[leafKey] = { k: RAW, v: existingValues[path] };
    touchedParents.add(segments.join('.'));
    preserved.push(path);
  }

  // Inserting appends, which would shunt a preserved token to the bottom of its group and show up
  // as a pile of moved lines on an otherwise no-op push. Put the affected groups back into the
  // order the file already had.
  for (const parentPath of touchedParents) {
    const order = childOrder[parentPath];
    if (!order?.length) continue;

    const segments = parentPath ? parentPath.split('.') : [];
    let cursor = merged;
    for (const segment of segments) cursor = cursor[segment];

    const reordered = {};
    for (const key of order) if (key in cursor) reordered[key] = cursor[key];
    for (const key of Object.keys(cursor)) if (!(key in reordered)) reordered[key] = cursor[key];

    if (segments.length) {
      let parent = merged;
      for (const segment of segments.slice(0, -1)) parent = parent[segment];
      parent[segments[segments.length - 1]] = reordered;
    } else {
      Object.keys(merged).forEach((key) => delete merged[key]);
      Object.assign(merged, reordered);
    }
  }

  return { tree: merged, preserved: preserved.sort() };
};

/** Token paths already present in a source file, for diffing against an incoming payload. */
const collectTokenPathsFromSource = (fileContent, declarationRegex) => {
  const { body, matchCount } = extractDeclarationBody(fileContent, declarationRegex);
  if (!body) {
    return { paths: [], matchCount };
  }
  const { tree } = parseObjectLiteralSource(body);
  return { paths: collectTokenPaths(tree), matchCount };
};

/**
 * The `transparent` check: every bare identifier the serialized declaration leans on has to be
 * resolvable inside the file it is about to live in.
 */
const findUnresolvableValueRoots = ({ fileContent, declarationSource }) => {
  const { missingRoots } = parseObjectLiteralSource(declarationSource, [
    ...collectFileBindings(fileContent),
  ]);
  return [...new Set(missingRoots)].sort();
};

/**
 * Replaces a declaration, reporting how many times it matched. A count other than 1 means the file
 * drifted (renamed or reformatted declaration) and must not be written blind.
 */
const replaceDeclaration = ({ fileContent, declarationRegex, replacement }) => {
  const regex = new RegExp(declarationRegex.source, declarationRegex.flags);
  const matches = fileContent.match(regex) ?? [];
  if (matches.length !== 1) {
    return { content: fileContent, matchCount: matches.length };
  }
  // function form so `$&`/`$1` inside token values are not treated as replacement patterns
  return { content: fileContent.replace(regex, () => replacement), matchCount: 1 };
};

const diffTokenPaths = (before, after) => {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    added: after.filter((path) => !beforeSet.has(path)),
    removed: before.filter((path) => !afterSet.has(path)),
  };
};

/** Whitespace and a trailing comma are formatting, not part of the value. */
const normalizeValueSource = (value) => String(value).replace(/\s+/g, '').replace(/,$/, '');

/**
 * Tokens whose value changed between two `scanDeclaration` reads of the same file.
 *
 * Path diffs only see additions and removals, so a push that recolours tokens used to report
 * "0 added · 0 removed" — indistinguishable from a push that did nothing. Only paths present on
 * both sides count; anything else is an addition or removal and is reported as one already.
 */
const diffTokenValues = (beforeValues, afterValues) =>
  Object.keys(afterValues)
    .filter(
      (path) =>
        path in beforeValues &&
        normalizeValueSource(beforeValues[path]) !== normalizeValueSource(afterValues[path]),
    )
    .sort()
    .map((path) => ({ path, before: beforeValues[path], after: afterValues[path] }));

/** Leaf path -> the source text the serializer would write for it. */
const collectTokenValues = (tree, expressionRoots = [], prefix = '', collected = {}) => {
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isLeaf(value)) {
      collected[path] = serializeValue(value, expressionRoots);
    } else {
      collectTokenValues(value, expressionRoots, path, collected);
    }
  }
  return collected;
};

/**
 * What a token tree would change in a source file, worked out from the file's text alone.
 *
 * The Figma plugin runs this against files it downloads, so it must never evaluate them — which
 * rules out `parseObjectLiteralSource`. `scanDeclaration` only reads lines. Paths matching
 * `preservedPaths` are code-owned and kept by every push, so they are not reported as removed.
 */
const diffTokenTreeAgainstSource = ({
  tree,
  fileContent,
  declarationRegex,
  expressionRoots = [],
  preservedPaths = [],
}) => {
  const { values: before } = scanDeclaration(fileContent, declarationRegex);
  const after = collectTokenValues(tree, expressionRoots);
  const isPreserved = (path) =>
    preservedPaths.some((pattern) => matchesSegmentPattern(path, pattern));

  return {
    added: Object.keys(after)
      .filter((path) => !(path in before))
      .sort(),
    removed: Object.keys(before)
      .filter((path) => !(path in after) && !isPreserved(path))
      .sort(),
    changed: diffTokenValues(before, after),
  };
};

module.exports = {
  EXPRESSION,
  RAW,
  STRING,
  TEMPLATE,
  collectDeclarationComments,
  matchesSegmentPattern,
  mergePreservedTokens,
  scanDeclaration,
  collectFileBindings,
  collectTokenPaths,
  collectTokenPathsFromSource,
  collectTokenValues,
  diffTokenPaths,
  diffTokenTreeAgainstSource,
  diffTokenValues,
  extractDeclarationBody,
  findUnresolvableValueRoots,
  isTaggedValue,
  parseObjectLiteralSource,
  replaceDeclaration,
  serializeTokens,
};
