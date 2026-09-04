import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Box from '../Box.svelte';
import type { BoxAs } from '../types';

describe('<Box />', () => {
  it('renders as a div by default', () => {
    render(Box, { props: { children: 'Box content', testID: 'box' } });

    const box = screen.getByTestId('box');
    expect(box.tagName).toBe('DIV');
    expect(box).toHaveTextContent('Box content');
  });

  it.each<BoxAs>(['div', 'section', 'footer', 'header', 'main', 'aside', 'nav', 'span', 'label'])(
    'renders as %s when as is set',
    (as) => {
      render(Box, { props: { as, children: 'content', testID: 'box' } });
      expect(screen.getByTestId('box').tagName).toBe(as.toUpperCase());
    },
  );

  it('forwards className to the underlying element', () => {
    render(Box, {
      props: { className: 'm-2 py-2 flex flex-row', testID: 'box' },
    });

    expect(screen.getByTestId('box')).toHaveClass('m-2', 'py-2', 'flex', 'flex-row');
  });

  it('forwards arbitrary data-* and aria-* attributes', () => {
    render(Box, {
      props: {
        testID: 'box',
        'data-analytics-id': 'checkout-summary',
        'aria-label': 'Summary',
      },
    });

    const box = screen.getByTestId('box');
    expect(box).toHaveAttribute('data-analytics-id', 'checkout-summary');
    expect(box).toHaveAttribute('aria-label', 'Summary');
  });

  it('sets the data-testid meta attribute from testID', () => {
    render(Box, { props: { testID: 'my-box' } });
    expect(screen.getByTestId('my-box')).toBeInTheDocument();
  });
});
