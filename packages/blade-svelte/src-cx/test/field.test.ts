import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FieldCounter from '../components/shared/FieldCounter.svelte';
import FieldLabel from '../components/shared/FieldLabel.svelte';
import { resolveFieldLabel } from '../components/shared/field';
import RichHintHarness from './fixtures/RichHintHarness.svelte';

describe('FieldLabel, as Blade FormLabel', () => {
  it('labels a control through `for`', () => {
    const { container } = render(FieldLabel, {
      props: { as: 'label', for: 'amount', id: 'amount-label', text: 'Amount' },
    });
    const label = container.querySelector('label')!;
    expect(label.getAttribute('for')).toBe('amount');
    expect(label.id).toBe('amount-label');
    expect(label.textContent?.trim()).toBe('Amount');
  });

  it('reads the necessity once: hidden text, a hidden mark', () => {
    const { container } = render(FieldLabel, {
      props: { text: 'Name', necessityIndicator: 'required' },
    });
    const span = container.querySelector('span')!;
    expect(span.querySelector('.sr-only')?.textContent?.trim()).toBe('required');
    const mark = [...span.querySelectorAll('[aria-hidden="true"]')];
    expect(mark.map((m) => m.textContent)).toEqual(['*']);
    // Figma's _FormGroup-Header: a semibold `*`, 2px after the text.
    expect(mark[0].className).toContain('ms-0.5');
    expect(mark[0].className).toContain('font-semibold');
  });

  it('takes the type, colour and gap per size', () => {
    expect(resolveFieldLabel('small', 'none').text).toContain('text-surface-gray-muted');
    expect(resolveFieldLabel('medium', 'none').text).toContain('text-75');
    const large = resolveFieldLabel('large', 'optional');
    expect(large.text).toContain('text-100');
    expect(large.row).toContain('mb-2');
    expect(large.label).toContain('gap-1');
  });
});

describe('rich hints', () => {
  it('a hint line may be a snippet: it renders, and the control is described by it', () => {
    const { getByTestId } = render(RichHintHarness);
    const control = getByTestId('gstin');
    const hint = document.getElementById(control.getAttribute('aria-describedby')!)!;
    expect(hint.contains(getByTestId('reset'))).toBe(true);
    expect(hint.textContent).toContain('Forgot it?');
  });
});

describe('FieldCounter, as Blade CharacterCounter', () => {
  it('shows current/max as a muted caption', () => {
    const { container } = render(FieldCounter, { props: { current: 3, max: 10 } });
    const counter = container.querySelector('span')!;
    expect(counter.textContent).toBe('3/10');
    expect(counter.className).toContain('text-surface-gray-muted');
  });

  it('keeps the count 11/16 at every size, as Figma', () => {
    for (const size of ['small', 'medium', 'large'] as const) {
      const { container, unmount } = render(FieldCounter, { props: { current: 3, max: 10, size } });
      expect(container.querySelector('span')!.className).toContain('text-50 leading-50');
      unmount();
    }
  });
});
