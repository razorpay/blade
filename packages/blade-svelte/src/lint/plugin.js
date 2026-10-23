// @razorpay/blade-svelte/configs/lint: lint rules for the classes an app
// writes, for oxlint (`jsPlugins`) or ESLint (flat config `plugins`). Both
// load the same ESLint-shaped plugin; rules are synchronous over the class
// index (`./engine.js`).
//
// oxlint hands a JS plugin only the `<script>` of a `.svelte` file, so the
// markup is read from disk and parsed with Svelte's own compiler; its
// reports sit on the file's first line with the real `[line:col]` in the
// message. A component without a `<script>` never reaches a plugin: run
// `lintClasses` over those (as an app's scriptless-svelte pass does).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import {
  conflictsIn,
  isBladeShaped,
  isKnown,
  loadIndex,
  restyles,
  splitClass,
  tokenFor,
} from './engine.js';

const require = createRequire(import.meta.url);

/** Calls whose string arguments are class lists. */
const DEFAULT_CALLEES = ['cx', 'cn', 'clsx', 'classNames', 'twMerge'];
/** Where a markup tag counts as a Blade component. */
const DEFAULT_SOURCES = ['@razorpay/blade-svelte/components'];

const RULES = {
  'no-conflicting-classes': {
    description: 'Two classes in one class list set the same property.',
    message: ({ first, second, property }) =>
      `\`${first}\` and \`${second}\` both set ${property}: classes join, they do not merge, so the stylesheet's order decides — keep one.`,
  },
  'no-interpolated-classes': {
    description: 'A class name built from pieces is never generated.',
    message: ({ text }) =>
      `\`${text}\` builds a class name from pieces, which UnoCSS and Tailwind never see: write each class in full and pick one.`,
  },
  'no-unknown-blade-class': {
    description: "A class in Blade's vocabulary that Blade does not define.",
    message: ({ token }) => `\`${token}\` is not a Blade class.`,
  },
  'prefer-token': {
    description: 'An arbitrary length that is a Blade spacing token.',
    message: ({ token, suggestion }) => `\`${token}\` is a Blade spacing token: \`${suggestion}\`.`,
  },
  'no-restyle': {
    description: "A Blade component's class places it; its look is its props.",
    message: ({ token, component, keys }) =>
      `\`${token}\` restyles ${component} (${keys.join(
        ', ',
      )}): a Blade component's \`class\` places it — margin, size, flex or grid item, position, \`hidden\` — or repoints a token (\`[--token:…]\`); its look is its props.`,
  },
};

/** Where a list's classes came from: the text, and its offset in the file. */
function tokensOf(text, start) {
  const tokens = [];
  for (const match of text.matchAll(/\S+/g)) {
    tokens.push({ token: match[0], start: start + match.index });
  }
  return tokens;
}

const calleeName = (callee) =>
  callee?.type === 'Identifier'
    ? callee.name
    : callee?.type === 'MemberExpression' && callee.property?.type === 'Identifier'
    ? callee.property.name
    : undefined;

const startOf = (node) => node.start ?? node.range?.[0] ?? 0;

/**
 * The class lists an expression can produce, as alternatives: a ternary is
 * one or the other, `a && 'x'` is nothing or `x`, an array or a class call
 * is all of its parts together. Each alternative is a list of
 * `{ token, start }`. Pieces that build a class name (`bg-${tone}`) are
 * reported and left out.
 */
function alternatives(node, ctx, limit = 64) {
  const product = (lists) =>
    lists.reduce(
      (acc, options) => acc.flatMap((a) => options.map((b) => [...a, ...b])).slice(0, limit),
      [[]],
    );
  switch (node?.type) {
    case 'Literal':
      return typeof node.value === 'string' ? [tokensOf(node.value, startOf(node) + 1)] : [[]];
    case 'TemplateLiteral': {
      const parts = [];
      node.quasis.forEach((quasi, index) => {
        const text = quasi.value.cooked ?? quasi.value.raw;
        let body = text;
        let offset = startOf(quasi);
        // A piece glued to an expression is half a class name.
        if (index > 0 && /^\S/.test(body)) {
          const glued = /^\S+/.exec(body)[0];
          ctx.interpolated(`\${…}${glued}`, offset);
          body = body.slice(glued.length);
          offset += glued.length;
        }
        if (index < node.quasis.length - 1 && /\S$/.test(body)) {
          const glued = /\S+$/.exec(body)[0];
          ctx.interpolated(`${glued}\${…}`, offset + body.length - glued.length);
          body = body.slice(0, -glued.length);
        }
        parts.push([tokensOf(body, offset)]);
        if (index < node.expressions.length) {
          const expression = node.expressions[index];
          const tight = /\S$/.test(text) || /^\S/.test(node.quasis[index + 1]?.value.raw ?? '');
          parts.push(tight ? [[]] : alternatives(expression, ctx, limit));
        }
      });
      return product(parts);
    }
    case 'ConditionalExpression':
      return [
        ...alternatives(node.consequent, ctx, limit),
        ...alternatives(node.alternate, ctx, limit),
      ].slice(0, limit);
    case 'LogicalExpression':
      return node.operator === '&&'
        ? [[], ...alternatives(node.right, ctx, limit)].slice(0, limit)
        : [...alternatives(node.left, ctx, limit), ...alternatives(node.right, ctx, limit)].slice(
            0,
            limit,
          );
    case 'ArrayExpression':
      return product(node.elements.map((element) => alternatives(element, ctx, limit)));
    case 'ObjectExpression':
      // clsx's `{ 'px-2': isDense }`: each key is there or not.
      return product(
        node.properties.map((property) =>
          property.type === 'Property' && !property.computed
            ? [
                [],
                property.key.type === 'Literal'
                  ? tokensOf(String(property.key.value), startOf(property.key) + 1)
                  : tokensOf(property.key.name, startOf(property.key)),
              ]
            : [[]],
        ),
      );
    case 'BinaryExpression':
      if (node.operator === '+') {
        const left = node.left.type === 'Literal' ? String(node.left.value) : undefined;
        if (left !== undefined && /\S$/.test(left) && node.right.type !== 'Literal') {
          ctx.interpolated(`${/\S+$/.exec(left)[0]} + …`, startOf(node));
        }
        return product([alternatives(node.left, ctx, limit), alternatives(node.right, ctx, limit)]);
      }
      return [[]];
    case 'CallExpression':
      return ctx.callees.includes(calleeName(node.callee))
        ? product(node.arguments.map((argument) => alternatives(argument, ctx, limit)))
        : [[]];
    default:
      return [[]];
  }
}

/** Every rule's check over one class list's alternatives. */
function checkList(lists, ctx, component) {
  const index = loadIndex();
  const reported = new Set();
  const once = (key, fn) => {
    if (!reported.has(key)) {
      reported.add(key);
      fn();
    }
  };
  for (const list of lists) {
    const tokens = list.map(({ token }) => token);
    for (const conflict of conflictsIn(tokens, index)) {
      const at = list.find(({ token }) => token === conflict.second)?.start ?? 0;
      once(`c|${conflict.first}|${conflict.second}`, () =>
        ctx.report('no-conflicting-classes', conflict, at),
      );
    }
  }
  for (const { token, start } of lists.flat()) {
    const { utility } = splitClass(token);
    once(`t|${token}|${start}`, () => {
      if (!isKnown(utility, index) && isBladeShaped(utility, index)) {
        ctx.report('no-unknown-blade-class', { token }, start);
      }
      const suggestion = tokenFor(utility, index);
      if (suggestion) ctx.report('prefer-token', { token, suggestion }, start);
      if (component) {
        const keys = restyles(token, component.name, ctx.allow[component.name], index);
        if (keys.length > 0) {
          ctx.report('no-restyle', { token, component: component.name, keys }, start);
        }
      }
    });
  }
}

/** Line and column (1-based) of an offset. */
function position(text, offset) {
  const before = text.slice(0, offset).split('\n');
  return { line: before.length, column: before[before.length - 1].length + 1 };
}

/**
 * A depth-first walk of a Svelte AST, with each node's nearest element.
 * `visit` returning true skips the node's children (a class list it has
 * checked whole).
 */
function walk(node, visit, element) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit, element));
    return;
  }
  const isElement = typeof node.type === 'string' && Array.isArray(node.attributes);
  if (typeof node.type === 'string' && visit(node, element)) return;
  for (const [key, child] of Object.entries(node)) {
    if (key === 'parent' || key === 'metadata' || key === 'instance' || key === 'module') continue;
    if (child && typeof child === 'object') walk(child, visit, isElement ? node : element);
  }
}

/**
 * Lints a Svelte file's markup and both scripts: what oxlint's rules do,
 * for the files oxlint does not hand to plugins. Returns
 * `{ ruleId, message, line, column }` for each finding.
 */
export function lintClasses(text, filename = 'file.svelte', options = {}) {
  const findings = [];
  const callees = options.callees ?? DEFAULT_CALLEES;
  const sources = options.sources ?? DEFAULT_SOURCES;
  const ctx = {
    callees,
    allow: options.allow ?? {},
    report(ruleId, data, offset) {
      findings.push({ ruleId, message: RULES[ruleId].message(data), ...position(text, offset) });
    },
    interpolated(piece, offset) {
      ctx.report('no-interpolated-classes', { text: piece }, offset);
    },
  };
  if (!filename.endsWith('.svelte')) return findings;
  const { parse } = require('svelte/compiler');
  let ast;
  try {
    ast = parse(text, { modern: true, filename });
  } catch {
    return findings;
  }
  const blade = new Set();
  for (const script of [ast.instance, ast.module]) {
    for (const statement of script?.content.body ?? []) {
      if (statement.type === 'ImportDeclaration' && sources.includes(statement.source.value)) {
        for (const specifier of statement.specifiers) blade.add(specifier.local.name);
      }
    }
    walk(script?.content, (node) => {
      if (node.type !== 'CallExpression' || !callees.includes(calleeName(node.callee)))
        return false;
      checkList(alternatives(node, ctx), ctx);
      return true;
    });
  }
  walk(ast.fragment, (node, element) => {
    const component =
      element?.type === 'Component' && blade.has(element.name.split('.')[0])
        ? { name: element.name.split('.')[0] }
        : undefined;
    if (node.type === 'Attribute' && node.name === 'class') {
      const values = Array.isArray(node.value) ? node.value : [node.value];
      const parts = values.map((part, index) => {
        if (part?.type === 'Text') {
          // `class="bg-{tone}"`: text glued to an expression is half a class.
          let body = part.data;
          let offset = part.start;
          if (values[index - 1]?.type === 'ExpressionTag' && /^\S/.test(body)) {
            const glued = /^\S+/.exec(body)[0];
            ctx.interpolated(`{…}${glued}`, offset);
            body = body.slice(glued.length);
            offset += glued.length;
          }
          if (values[index + 1]?.type === 'ExpressionTag' && /\S$/.test(body)) {
            const glued = /\S+$/.exec(body)[0];
            ctx.interpolated(`${glued}{…}`, offset + body.length - glued.length);
            body = body.slice(0, -glued.length);
          }
          return [tokensOf(body, offset)];
        }
        if (part?.type === 'ExpressionTag') {
          const glued =
            /\S$/.test(values[index - 1]?.data ?? ' ') ||
            /^\S/.test(values[index + 1]?.data ?? ' ');
          return glued ? [[]] : alternatives(part.expression, ctx);
        }
        return [[]];
      });
      const lists = parts.reduce(
        (acc, choices) => acc.flatMap((a) => choices.map((b) => [...a, ...b])).slice(0, 64),
        [[]],
      );
      checkList(lists, ctx, component);
      return true;
    }
    if (node.type === 'ClassDirective') {
      checkList([[{ token: node.name, start: node.start + 'class:'.length }]], ctx, component);
      return true;
    }
    if (node.type === 'CallExpression' && callees.includes(calleeName(node.callee))) {
      checkList(alternatives(node, ctx), ctx);
      return true;
    }
    return false;
  });
  return findings;
}

/** One ESLint-shaped rule over the shared checks, keeping its own reports. */
function rule(ruleId) {
  return {
    meta: {
      type: ruleId === 'prefer-token' ? 'suggestion' : 'problem',
      docs: { description: RULES[ruleId].description },
      schema: [
        {
          type: 'object',
          properties: {
            callees: { type: 'array', items: { type: 'string' } },
            sources: { type: 'array', items: { type: 'string' } },
            allow: { type: 'object' },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const options = context.options?.[0] ?? {};
      const filename = context.filename ?? context.getFilename?.();
      if (filename?.endsWith('.svelte')) {
        // The markup is not in the AST: lint the file as Svelte parses it.
        return {
          Program(program) {
            let text;
            try {
              text = readFileSync(filename, 'utf8');
            } catch {
              return;
            }
            for (const finding of lintClasses(text, filename, options)) {
              if (finding.ruleId !== ruleId) continue;
              context.report({
                node: program,
                message: `[${finding.line}:${finding.column}] ${finding.message}`,
              });
            }
          },
        };
      }
      const callees = options.callees ?? DEFAULT_CALLEES;
      const ctx = {
        callees,
        allow: options.allow ?? {},
        node: undefined,
        report(id, data) {
          if (id === ruleId) context.report({ node: ctx.node, message: RULES[id].message(data) });
        },
        interpolated(piece) {
          ctx.report('no-interpolated-classes', { text: piece });
        },
      };
      // A class call inside another one is checked with it, not again.
      const inner = new WeakSet();
      const markInner = (node) => {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
          node.forEach(markInner);
          return;
        }
        if (node.type === 'CallExpression' && callees.includes(calleeName(node.callee)))
          inner.add(node);
        for (const [key, child] of Object.entries(node)) {
          if (key !== 'parent' && child && typeof child === 'object') markInner(child);
        }
      };
      return {
        CallExpression(node) {
          if (!callees.includes(calleeName(node.callee)) || inner.has(node)) return;
          node.arguments.forEach(markInner);
          ctx.node = node;
          checkList(alternatives(node, ctx), ctx);
        },
      };
    },
  };
}

const plugin = {
  meta: { name: 'blade' },
  rules: Object.fromEntries(Object.keys(RULES).map((id) => [id, rule(id)])),
};

/** The recommended severities, for `.oxlintrc.json` `rules` or an ESLint config. */
export const recommended = {
  'blade/no-conflicting-classes': 'error',
  'blade/no-interpolated-classes': 'error',
  'blade/no-unknown-blade-class': 'error',
  'blade/no-restyle': 'error',
  'blade/prefer-token': 'warn',
};

export default plugin;
