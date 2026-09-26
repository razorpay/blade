import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import AccordionHarness from './fixtures/AccordionHarness.svelte';

describe('Accordion', () => {
  it('is a labelled group of header buttons; the caller class comes last', () => {
    const { getByTestId } = render(AccordionHarness);
    const root = getByTestId('methods');
    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('aria-labelledby')).toBeTruthy();
    expect(root.className.endsWith('mt-2')).toBe(true);

    const upi = getByTestId('methods-0');
    expect(upi.tagName).toBe('BUTTON');
    expect(upi.getAttribute('type')).toBe('button');
    expect(upi.getAttribute('aria-expanded')).toBe('false');
  });

  it('mounts content only while its item is open, one at a time', () => {
    const onChange = vi.fn();
    const { getByTestId, queryByTestId } = render(AccordionHarness, {
      props: { onChange },
    });
    expect(queryByTestId('content-upi')).toBeNull();

    return fireEvent
      .click(getByTestId('methods-0'))
      .then(() => {
        const header = getByTestId('methods-0');
        // The content sits in the body box, inside the region.
        const panel = getByTestId('content-upi').parentElement
          ?.parentElement as HTMLElement;
        expect(header.getAttribute('aria-expanded')).toBe('true');
        expect(header.getAttribute('aria-controls')).toBe(panel.id);
        expect(panel.getAttribute('role')).toBe('region');
        expect(panel.getAttribute('aria-labelledby')).toBe(header.id);
        expect(onChange).toHaveBeenLastCalledWith('upi');
        return fireEvent.click(getByTestId('methods-2'));
      })
      .then(() =>
        waitFor(() => expect(queryByTestId('content-upi')).toBeNull())
      )
      .then(() => {
        expect(getByTestId('content-wallet')).toBeTruthy();
        return fireEvent.click(getByTestId('methods-2'));
      })
      .then(() =>
        waitFor(() => expect(queryByTestId('content-wallet')).toBeNull())
      )
      .then(() => {
        expect(onChange).toHaveBeenLastCalledWith(null);
      });
  });

  it('opens the initial value, and a second press closes it', () => {
    const onChange = vi.fn();
    const { getByTestId, queryByTestId } = render(AccordionHarness, {
      props: {
        value: 'wallet',
        onChange,
      },
    });
    expect(getByTestId('content-wallet')).toBeTruthy();
    return fireEvent.click(getByTestId('methods-2')).then(() => {
      expect(queryByTestId('content-wallet')).toBeNull();
      expect(onChange).toHaveBeenLastCalledWith(null);
    });
  });

  it('an actionable item reports the press and never expands', () => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    const { getByTestId, queryByTestId } = render(AccordionHarness, {
      props: { onClick, onChange },
    });
    const card = getByTestId('methods-1');
    expect(card.hasAttribute('aria-expanded')).toBe(false);

    return fireEvent.click(card).then(() => {
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'card' }),
        expect.anything()
      );
      expect(onChange).not.toHaveBeenCalled();
      expect(queryByTestId('content-card')).toBeNull();
    });
  });

  it('lets onClick veto an expand', () => {
    const { getByTestId, queryByTestId } = render(AccordionHarness, {
      props: { onClick: () => false },
    });
    return fireEvent.click(getByTestId('methods-0')).then(() => {
      expect(queryByTestId('content-upi')).toBeNull();
      expect(getByTestId('methods-0').getAttribute('aria-expanded')).toBe(
        'false'
      );
    });
  });

  it('a disabled item swallows a synthetic click', () => {
    const onClick = vi.fn();
    const { getByTestId, queryByTestId } = render(AccordionHarness, {
      props: { onClick },
    });
    const emi = getByTestId('methods-3') as HTMLButtonElement;
    expect(emi.disabled).toBe(true);
    return fireEvent.click(emi).then(() => {
      expect(onClick).not.toHaveBeenCalled();
      expect(queryByTestId('content-emi')).toBeNull();
    });
  });

  it('arrows, Home and End move focus between enabled headers', () => {
    const { getByTestId } = render(AccordionHarness);
    const upi = getByTestId('methods-0');
    upi.focus();
    return fireEvent
      .keyDown(upi, { key: 'ArrowDown' })
      .then(() => {
        expect(document.activeElement).toBe(getByTestId('methods-1'));
        return fireEvent.keyDown(getByTestId('methods-1'), { key: 'End' });
      })
      .then(() => {
        // EMI is disabled: Wallets is the last enabled header.
        expect(document.activeElement).toBe(getByTestId('methods-2'));
        return fireEvent.keyDown(getByTestId('methods-2'), {
          key: 'ArrowDown',
        });
      })
      .then(() => {
        expect(document.activeElement).toBe(upi);
      });
  });

  it('an actionable item draws the chevron pointing right', () => {
    const { getByTestId } = render(AccordionHarness);
    const chevron = getByTestId('methods-1').querySelector('svg')
      ?.parentElement as HTMLElement;
    expect(chevron.className).toContain('-rotate-90');
  });

  it('trailing replaces the chevron', () => {
    const { getByTestId } = render(AccordionHarness, {
      props: { withTrailing: true },
    });
    const header = getByTestId('methods-0');
    expect(header.querySelector('svg')).toBeNull();
    expect(getByTestId('status-upi')).toBeTruthy();
  });

  it('draws a title and subtitle string in Blade type', () => {
    const { getByTestId } = render(AccordionHarness);
    const header = getByTestId('methods-0');
    const title = [...header.querySelectorAll('span')].find(
      (node) => node.textContent?.trim() === 'UPI'
    ) as HTMLElement;
    const subtitle = [...header.querySelectorAll('span')].find(
      (node) => node.textContent?.trim() === 'Any UPI app'
    ) as HTMLElement;
    expect(title.className).toContain('font-semibold');
    expect(title.className).toContain('text-200');
    expect(subtitle.className).toContain('text-surface-gray-muted');
  });

  it('draws the leading, unless the number prefix takes its place', () => {
    const leading = render(AccordionHarness, { props: { withLeading: true } });
    expect(leading.getByTestId('leading-upi')).toBeTruthy();
    leading.unmount();
    const { queryByTestId, getByTestId } = render(AccordionHarness, {
      props: { withLeading: true, showNumberPrefix: true },
    });
    expect(queryByTestId('leading-upi')).toBeNull();
    expect(getByTestId('methods-2').textContent).toContain('3.');
  });

  it('a required accordion blocks the submit until one item is open', () => {
    const onSubmit = vi.fn();
    const { getByTestId, container } = render(AccordionHarness, {
      props: { onSubmit, isRequired: true },
    });
    const form = container.querySelector('form') as HTMLFormElement;

    return fireEvent
      .submit(form)
      .then(() => {
        expect(onSubmit).not.toHaveBeenCalled();
        return fireEvent.click(getByTestId('methods-0'));
      })
      .then(() => fireEvent.submit(form))
      .then(() => waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1)))
      .then(() => {
        expect(onSubmit.mock.calls[0]?.[0]).toEqual({
          instrument: 'upi',
        });
      });
  });
});

describe('Accordion (blade)', () => {
  const itemOf = (header: HTMLElement) =>
    header.closest('.group\\/item') as HTMLElement;

  it('transparent: items on the page, a divider after every one', () => {
    const { getByTestId } = render(AccordionHarness);
    const header = getByTestId('methods-0');
    const item = itemOf(header);
    expect(item.className).toContain('border-b-thin');
    expect(item.className).toContain('border-surface-gray-muted');
    expect(item.parentElement?.className).not.toContain('surface-raised');
    expect(header.parentElement?.getAttribute('role')).toBe('heading');
    expect(header.parentElement?.getAttribute('aria-level')).toBe('3');
    expect(header.className).toContain('bg-transparent');
    expect(header.className).toContain('hover:bg-interactive-gray-faded');
    expect(header.className).toContain(
      'focus-visible:outline-surface-primary-muted'
    );
  });

  it('filled: one raised surface, dividers between items only', () => {
    const { getByTestId } = render(AccordionHarness, {
      props: { variant: 'filled' },
    });
    const item = itemOf(getByTestId('methods-0'));
    expect(item.parentElement?.className).toContain('surface-raised');
    expect(item.parentElement?.className).toContain('rounded-medium');
    expect(item.className).toContain('[&+&]:border-t-thin');
    expect(item.className).not.toContain('border-b-thin');
    expect(getByTestId('methods-3').className).toContain(
      'group-last/item:rounded-bl-medium'
    );
  });

  it('muted chevron that flips, a hairline under the open header, the body box', async () => {
    const { getByTestId } = render(AccordionHarness);
    const header = getByTestId('methods-0');
    const indicator = header.querySelector('[aria-hidden="true"]')
      ?.parentElement as HTMLElement;
    expect(indicator.className).toContain('icon-interactive-gray-muted');
    expect(indicator.className).toContain('h-7');
    expect(header.querySelector('.border-b-thinner')).toBeNull();
    await fireEvent.click(header);
    expect(indicator.firstElementChild?.className).toContain('-rotate-180');
    expect(indicator.className).toContain('icon-interactive-gray-subtle');
    expect(indicator.className).not.toContain('icon-interactive-gray-muted');
    expect(header.querySelector('.border-b-thinner')).not.toBeNull();
    await waitFor(() => {
      const body = getByTestId('content-upi').parentElement as HTMLElement;
      expect(body.className).toContain('mx-4 mb-4 mt-3');
    });
  });

  it('medium size and the number prefix', () => {
    const { getByTestId } = render(AccordionHarness, {
      props: { size: 'medium', showNumberPrefix: true },
    });
    const header = getByTestId('methods-1');
    expect(header.textContent).toContain('2.');
    const prefix = [...header.querySelectorAll('span')].find(
      (node) => node.textContent === '2.'
    ) as HTMLElement;
    expect(prefix.className).toContain('text-100');
    expect(prefix.className).toContain('h-5');
  });

  it('children: a custom body at full width, outside the body box', async () => {
    const { getByTestId } = render(AccordionHarness, {
      props: { body: 'children' },
    });
    const header = getByTestId('methods-0');
    await fireEvent.click(header);
    await waitFor(() => {
      const custom = getByTestId('custom-upi');
      const region = custom.parentElement as HTMLElement;
      expect(region.getAttribute('role')).toBe('region');
      expect(region.id).toBe(header.getAttribute('aria-controls'));
      expect(region.className).toBe('');
    });
  });

  it('content wins over children', async () => {
    const { getByTestId, queryByTestId } = render(AccordionHarness, {
      props: { body: 'both' },
    });
    await fireEvent.click(getByTestId('methods-0'));
    await waitFor(() => expect(getByTestId('content-upi')).toBeTruthy());
    expect(queryByTestId('custom-upi')).toBeNull();
  });

  it('greys a disabled header', () => {
    const { getByTestId } = render(AccordionHarness);
    expect(getByTestId('methods-3').className).toContain(
      'disabled:text-surface-gray-disabled'
    );
  });
});
