// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import { createRawSnippet } from 'svelte';
import Collapsible from '../components/collapsible/Collapsible.svelte';

// A server render has no `document`: what probes the browser must not run.
const html = (markup: string): ReturnType<typeof createRawSnippet> =>
  createRawSnippet(() => ({ render: () => markup }));

describe('server rendering', () => {
  it('renders an expanded Collapsible (its panel probes animation support)', () => {
    const { body } = render(Collapsible, {
      props: {
        isExpanded: true,
        children: html('<button>Details</button>'),
        content: html('<p>Body</p>'),
      },
    } as never);
    expect(body).toContain('Body');
  });
});
