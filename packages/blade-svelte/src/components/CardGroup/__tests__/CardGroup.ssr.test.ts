import { render } from 'svelte/server';
import { describe, it, expect } from 'vitest';
import CardGroupItem from '../CardGroupItem.svelte';
import CardGroupTestHarness from './CardGroupTestHarness.svelte';

describe('<CardGroupItem /> SSR', () => {
  it('server-renders a navigating row as an anchor', () => {
    const { body } = render(CardGroupItem, { props: { children: 'Cards', href: '/cards' } });

    expect(body).toContain('<a');
    expect(body).toContain('href="/cards"');
    expect(body).toContain('Cards');
  });
});

describe('<CardGroup /> SSR', () => {
  it('server-renders the group and its rows', () => {
    const { body } = render(CardGroupTestHarness, { props: { defaultIsExpanded: true } });

    expect(body).toContain('role="group"');
    expect(body).toContain('Cards');
    expect(body).toContain('Wallet');
    expect(body).toContain('Google Pay');
  });
});
