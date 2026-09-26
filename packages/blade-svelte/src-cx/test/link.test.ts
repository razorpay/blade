import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import LinkHarness from './fixtures/LinkHarness.svelte';
import { expectClass } from './classes';

const prevented = () => document.body.dataset.prevented;

beforeEach(() => {
  delete document.body.dataset.prevented;
});

describe('Link', () => {
  it('is always an anchor; the caller class comes last', () => {
    const { getByTestId } = render(LinkHarness);
    const link = getByTestId('link') as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/card');
    expect(link.hasAttribute('rel')).toBe(false);
    expect(link.className.endsWith('ml-2')).toBe(true);
    expectClass(link, 'inline');
  });

  it('guards a new tab and keeps the caller rel', () => {
    const { getByTestId } = render(LinkHarness, {
      props: {
        href: 'https://razorpay.com',
        target: '_blank',
        rel: 'nofollow',
      },
    });
    const link = getByTestId('link');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('nofollow noopener noreferrer');
  });

  it('puts the glyph on the asked side, sized by the link', () => {
    const leading = render(LinkHarness, { props: { withIcon: true } });
    const first = leading.getByTestId('link').firstElementChild;
    expect(first?.querySelector('svg')).not.toBeNull();
    expectClass(first?.firstElementChild, 'w-4 h-4');
    leading.unmount();

    const trailing = render(LinkHarness, {
      props: { withIcon: true, iconPosition: 'trailing', size: 'small' },
    });
    const last = trailing.getByTestId('link').lastElementChild;
    expect(last?.querySelector('svg')).not.toBeNull();
    expectClass(last?.firstElementChild, 'w-3 h-3');
  });

  it('a disabled link has no href, says so, and swallows the click', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(LinkHarness, {
      props: { isDisabled: true, onClick },
    });
    const link = getByTestId('link');
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    return fireEvent.click(link).then(() => {
      expect(onClick).not.toHaveBeenCalled();
      expect(prevented()).toBe('true');
    });
  });

  it('hands a plain internal click to the router adapter', () => {
    const navigate = vi.fn(() => true);
    const onClick = vi.fn();
    const { getByTestId } = render(LinkHarness, {
      props: { navigate, onClick },
    });
    return fireEvent.click(getByTestId('link')).then(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith('/card', expect.anything());
      expect(prevented()).toBe('true');
    });
  });

  it('leaves the browser its clicks: modified, new tab, external, unhandled', () => {
    const navigate = vi.fn(() => true);
    const modified = render(LinkHarness, { props: { navigate } });
    return fireEvent
      .click(modified.getByTestId('link'), { metaKey: true })
      .then(() => {
        expect(navigate).not.toHaveBeenCalled();
        expect(prevented()).toBe('false');
        modified.unmount();

        const blank = render(LinkHarness, {
          props: { navigate, target: '_blank' },
        });
        return fireEvent.click(blank.getByTestId('link')).then(() => {
          expect(navigate).not.toHaveBeenCalled();
          blank.unmount();
        });
      })
      .then(() => {
        const external = render(LinkHarness, {
          props: { navigate, href: 'https://razorpay.com/support' },
        });
        return fireEvent.click(external.getByTestId('link')).then(() => {
          expect(navigate).not.toHaveBeenCalled();
          external.unmount();
        });
      })
      .then(() => {
        const declined = vi.fn(() => false);
        const { getByTestId } = render(LinkHarness, {
          props: { navigate: declined },
        });
        return fireEvent.click(getByTestId('link')).then(() => {
          expect(declined).toHaveBeenCalledTimes(1);
          expect(prevented()).toBe('false');
        });
      });
  });

  it('lets onClick cancel before the router sees it', () => {
    const navigate = vi.fn(() => true);
    const { getByTestId } = render(LinkHarness, {
      props: {
        navigate,
        onClick: (event: MouseEvent) => event.preventDefault(),
      },
    });
    return fireEvent.click(getByTestId('link')).then(() => {
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});

describe('Button variant="link"', () => {
  it('is a button that wears the same look as Link', () => {
    const { getByTestId } = render(LinkHarness, {
      props: { color: 'neutral', size: 'small' },
    });
    const action = getByTestId('action') as HTMLButtonElement;
    const link = getByTestId('link');
    expect(action.tagName).toBe('BUTTON');
    expect(action.type).toBe('button');

    // The same look, save the display: Link is `inline` to wrap with its
    // sentence, the button `inline-flex` to take only its content's width.
    const look = link.className
      .replace(/ ml-2$/, '')
      .split(' ')
      .filter((name) => name !== 'inline');
    for (const name of look) {
      expect(action.className.split(' ')).toContain(name);
    }
    expectClass(link, 'inline');
    expectClass(action, 'inline-flex');
    // None of the box classes leak into the link variant.
    expect(action.className.split(' ')).not.toContain('flex');
    expect(action.className).not.toMatch(/\bh-\d|bg-interactive|rounded-small/);
  });
});
