/** Story-only helpers: fake latency and a card-number mask for the demos. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type Value = string | number | null | undefined;

export function digitsOnly(value: Value): string {
  return String(value ?? '').replace(/\D/g, '');
}

export function groupInFours(value: Value): string {
  return digitsOnly(value).replace(/(.{4})(?=.)/g, (group) => `${group} `);
}

/** Maps a failed declarative constraint to demo copy (the app passes `$t`). */
export function describeConstraint(code: string): string {
  if (code === 'required') {
    return 'This field is required';
  }
  if (code === 'email') {
    return 'Enter a valid email address';
  }
  return 'Check this value';
}

export function stamp(): string {
  return new Date().toISOString().slice(11, 23);
}

import type { StoryMeta } from './types';

/**
 * A story's argTypes as `StoryDef` promises: its own replace the group's.
 * Storybook merges them instead, so the group's controls a story doesn't
 * list are hidden here. Without its own, a story keeps the group's.
 */
export function storyArgTypes(meta: StoryMeta, name: string): Record<string, unknown> | undefined {
  const own = meta.stories[name]?.argTypes;
  if (!own) return undefined;
  const hidden = Object.keys(meta.argTypes ?? {})
    .filter((key) => !(key in own))
    .map((key) => [key, { table: { disable: true } }]);
  return { ...Object.fromEntries(hidden), ...own };
}

/** A story that lists no argTypes of its own shows no controls panel. */
export function hasNoControls(meta: StoryMeta, name: string): boolean {
  const own = meta.stories[name]?.argTypes;
  return own !== undefined && Object.keys(own).length === 0;
}

type ArgsRecord = Record<string, unknown>;

/** Drops a story file's plumbing: its `Props` interface and the `args` prop. */
function stripPlumbing(raw: string): string {
  let code = raw;
  const props = /\n[ \t]*interface Props\b[^{]*\{/.exec(code);
  if (props) {
    let depth = 0;
    let end = props.index + props[0].length - 1;
    for (; end < code.length; end += 1) {
      if (code[end] === '{') depth += 1;
      else if (code[end] === '}' && (depth -= 1) === 0) break;
    }
    code = code.slice(0, props.index) + code.slice(end + 1).replace(/^;?[ \t]*/, '');
  }
  return code.replace(/\n[ \t]*let \{[^}]*\bargs\b[^}]*\}[^;\n]*\$props\(\);[ \t]*/g, '');
}

const literal = (value: unknown): string =>
  value === undefined ? 'undefined' : JSON.stringify(value);

/** A story file as the example it stands for, with the controls' values filled in. */
export function toExample(raw: string, args: ArgsRecord): string {
  return stripPlumbing(raw)
    // `name={args.key}` (or `|| undefined`): the attribute as written by hand,
    // dropped when the control is empty.
    .replace(
      /(\s+)([\w:-]+)=\{args\.(\w+)(?:\s*(?:\|\||\?\?)\s*(?:undefined|''|""))?\}/g,
      (_whole, space: string, name: string, key: string) => {
        const value = args[key];
        if (value === undefined || value === null || value === '') return '';
        return typeof value === 'string' ? `${space}${name}="${value}"` : `${space}${name}={${String(value)}}`;
      },
    )
    // A control as text content: the text itself.
    .replace(/\{args\.(\w+)\}/g, (_whole, key: string) => {
      const value = args[key];
      return typeof value === 'string' ? value : `{${literal(value)}}`;
    })
    // Any other use of a control: its value.
    .replace(/\bargs\.(\w+)/g, (_whole, key: string) => literal(args[key]))
    // Comparisons between filled-in values settle to true or false.
    .replace(/("[^"]*"|undefined) (===|!==) (['"])([^'"]*)\3/g, (_whole, left: string, op: string, _q: string, right: string) => {
      const value = left === 'undefined' ? undefined : (JSON.parse(left) as string);
      return String(op === '===' ? value === right : value !== right);
    })
    // Spread props written as a cast (`{...({ a: "x" } as T)}`): attributes.
    .replace(/(\s+)\{\.\.\.\(\{([^{}]*)\} as \w+\)\}/g, (_whole, space: string, pairs: string) =>
      pairs
        .split(',')
        .map((pair) => /^\s*(\w+):\s*(.+?)\s*$/.exec(pair))
        .filter((match): match is RegExpExecArray => match !== null && match[2] !== 'undefined')
        .map(([, key, value]) => (value.startsWith('"') ? `${space}${key}=${value}` : `${space}${key}={${value}}`))
        .join(''),
    )
    // A toggle settled: `name={true ? A : B}` keeps the branch it picks, and
    // an attribute left `undefined` goes.
    .replace(
      /(\s+)([\w:-]+)=\{(true|false|undefined|null) \? ([^:{}]+?) : ([^{}]+?)\}/g,
      (_whole, space: string, name: string, flag: string, yes: string, no: string) => {
        const picked = (flag === 'true' ? yes : no).trim();
        return picked === 'undefined' ? '' : `${space}${name}={${picked}}`;
      },
    )
    // An icon picked by name from the set: the icon itself.
    .replace(/\bglyphs\["(\w+)"\]/g, '$1')
    // The paths an app imports from, not the stories' own.
    .replace(/(['"])(?:\.\.\/)+index\1/g, "'@razorpay/blade-svelte/cx'")
    .replace(/(['"])(?:\.\.\/)+icons(?:\/glyphs)?\1/g, "'@razorpay/blade-svelte/icons'")
    .replace(/(['"])(?:\.\.\/)+runes\1/g, "'@razorpay/blade-svelte/cx/runes'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n(?:[ \t]*\n)+(<\/script>)/g, '\n$1')
    .replace(/import \* as glyphs from '@razorpay\/blade-svelte\/icons';/, (line, _o: number, code: string) => {
      const used = [...new Set(code.match(/\b[A-Z]\w*Icon\b/g) ?? [])].filter((name) => !code.includes(`import { ${name}`));
      return used.length ? `import { ${used.join(', ')} } from '@razorpay/blade-svelte/icons';` : '';
    })
    // Type imports only the dropped `Props` used.
    .replace(/import \{([^}]*)\} from ('[^']+');/g, (line, list: string, from: string, _o: number, code: string) => {
      const kept = list
        .split(',')
        .map((name) => name.trim())
        .filter((name) => {
          const type = /^type (\w+)$/.exec(name);
          return name && (!type || code.split(type[1]).length > 2);
        });
      return kept.length ? `import { ${kept.join(', ')} } from ${from};` : '';
    })
    .replace(/\n[ \t]*\n(<\/script>)/g, '\n$1')
    .trim();
}

/**
 * "Show code" for a story: its own file (imported `?raw`) rather than the
 * wrapper component the story renders, re-rendered as the controls change.
 */
export function exampleSource(raw: string): {
  language: string;
  transform: (code: string, context: { args?: ArgsRecord }) => string;
} {
  return {
    language: 'svelte',
    transform: (_code, context) => toExample(raw, context.args ?? {}),
  };
}
