import { render } from 'svelte/server';
import { describe, it, expect } from 'vitest';
import Box from '../Box.svelte';

describe('<Box /> SSR', () => {
  it('server-renders a div by default with its text content', () => {
    const { body } = render(Box, { props: { children: 'Box content' } });

    expect(body).toContain('<div');
    expect(body).toContain('Box content');
  });

  it('server-renders the requested tag with className applied', () => {
    const { body } = render(Box, {
      props: { as: 'section', className: 'm-2 py-2 flex flex-row' },
    });

    expect(body).toMatch(/<section[^>]*class="m-2 py-2 flex flex-row"/);
  });
});
