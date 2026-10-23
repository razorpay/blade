// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parse } from 'svelte/compiler';
import plugin, { lintClasses, recommended } from '../lint/plugin.js';

const IMPORT =
  "<script>import { Button, Skeleton, Text } from '@razorpay/blade-svelte/components';</script>\n";

function rules(markup: string, options?: Parameters<typeof lintClasses>[2]): string[] {
  return lintClasses(`${IMPORT}${markup}`, 'Page.svelte', options).map(
    ({ ruleId, line, column }) => `${ruleId} ${line}:${column}`,
  );
}

describe('the class lint, on Svelte markup', () => {
  it('flags two classes that set one property', () => {
    expect(rules('<div class="px-2 px-4"></div>')).toEqual(['no-conflicting-classes 2:18']);
  });

  it('passes the branches of a ternary, variants and an important override', () => {
    expect(rules("<div class={on ? 'px-2' : 'px-4'}></div>")).toEqual([]);
    expect(rules('<div class="px-2 d:px-4 hover:px-3"></div>')).toEqual([]);
    expect(rules('<div class="p-2 p-0!"></div>')).toEqual([]);
  });

  it("flags a conditional class that cannot win in a class call: cx joins, it doesn't merge", () => {
    expect(rules("<div class={cx('px-2', dense && 'px-4')}></div>")).toEqual([
      'no-conflicting-classes 2:34',
    ]);
  });

  it('flags a class built from pieces, in markup and in a template literal', () => {
    expect(rules('<div class="bg-{tone} mt-2"></div>')).toEqual(['no-interpolated-classes 2:13']);
    // eslint-disable-next-line no-template-curly-in-string -- Svelte source under test
    expect(rules('<div class={`text-${size} mt-2`}></div>')).toEqual([
      'no-interpolated-classes 2:14',
    ]);
    // eslint-disable-next-line no-template-curly-in-string -- Svelte source under test
    expect(rules("<div class={`${dense ? 'p-2' : 'p-4'} mt-2`}></div>")).toEqual([]);
  });

  it("flags a Blade-shaped class Blade doesn't define, not an app's own", () => {
    expect(
      rules('<div class="bg-surface-gray-mutd brand-card text-brand-600 bg-surface-50"></div>'),
    ).toEqual(['no-unknown-blade-class 2:13']);
  });

  it('suggests the spacing token for an arbitrary length', () => {
    const [finding] = lintClasses(`${IMPORT}<div class="p-[16px]"></div>`, 'Page.svelte');
    expect(finding.message).toContain('`p-blade-5`');
  });

  it("lets a Blade component's class place it, and flags what restyles it", () => {
    expect(
      rules(
        '<Button class="mt-4 w-full self-end d:hidden [--interactive-background-primary-default:red]">Pay</Button>',
      ),
    ).toEqual([]);
    expect(rules('<Button class="mt-4 bg-surface-gray-subtle p-2">Pay</Button>')).toEqual([
      'no-restyle 2:21',
      'no-restyle 2:44',
    ]);
    // Typography aligns, a Skeleton takes its shape's radius; an element of
    // the app's own takes anything.
    expect(rules('<Skeleton class="h-5 w-full rounded-small" />')).toEqual([]);
    expect(
      rules('<Text class="text-center">Hi</Text><div class="bg-surface-gray-subtle"></div>'),
    ).toEqual([]);
  });

  it("takes an app's allowances per component, as class globs", () => {
    expect(
      rules('<Button class="rounded-small">Pay</Button>', { allow: { Button: ['rounded-*'] } }),
    ).toEqual([]);
  });

  it('checks class calls in the script too', () => {
    const findings = lintClasses(
      "<script>const c = cx('px-2 px-4');</script>\n<div></div>",
      'Page.svelte',
    );
    expect(findings.map(({ ruleId }) => ruleId)).toEqual(['no-conflicting-classes']);
  });
});

/** Runs one rule over a JS module, as oxlint or ESLint would. */
function run(ruleId: keyof typeof plugin.rules, code: string): string[] {
  const messages: string[] = [];
  const visitors = plugin.rules[ruleId].create({
    options: [],
    filename: 'styles.ts',
    report: ({ message }: { message: string }) => messages.push(message),
  } as never) as { CallExpression?: (node: unknown) => void };
  const onCall = visitors.CallExpression;
  const visit = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if ((node as { type?: string }).type === 'CallExpression') onCall?.(node);
    Object.values(node).forEach(visit);
  };
  // Svelte's parser reads a module as a component's script: an ESTree Program.
  visit(parse(`<script>${code}</script>`, { modern: true }).instance?.content);
  return messages;
}

describe('the class lint, as a plugin over a module', () => {
  it('checks class calls, once for nested ones', () => {
    expect(run('no-conflicting-classes', "cx('px-2', cx('px-4'));")).toHaveLength(1);
    expect(run('no-conflicting-classes', "other('px-2 px-4');")).toEqual([]);
  });

  it('reports only its own rule', () => {
    expect(run('prefer-token', "cx('px-2 px-4 m-[8px]');")).toEqual([
      '`m-[8px]` is a Blade spacing token: `m-blade-3`.',
    ]);
  });

  it('names itself blade, with a recommended set over its rules', () => {
    expect(plugin.meta.name).toBe('blade');
    expect(Object.keys(recommended).sort()).toEqual(
      Object.keys(plugin.rules)
        .map((id) => `blade/${id}`)
        .sort(),
    );
  });
});
