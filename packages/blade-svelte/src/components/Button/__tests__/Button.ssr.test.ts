import { render } from 'svelte/server';
import { describe, it, expect } from 'vitest';
import Button from '../Button.svelte';

describe('<Button /> SSR', () => {
  it('server-renders to an HTML string containing the button and its text', () => {
    const { body } = render(Button, { props: { children: 'Pay Now' } });

    expect(body).toContain('<button');
    expect(body).toContain('Pay Now');
  });

  it('server-renders the disabled state', () => {
    const { body } = render(Button, {
      props: { children: 'Pay Now', isDisabled: true },
    });

    expect(body).toContain('disabled');
  });
});
