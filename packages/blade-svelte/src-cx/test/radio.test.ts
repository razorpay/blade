import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import RadioHarness from './fixtures/RadioHarness.svelte';
import { expectClass, expectNoClass } from './classes';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));
const input = (element: HTMLElement): HTMLInputElement => element as HTMLInputElement;
const indicator = (control: HTMLElement): HTMLElement => control.nextElementSibling as HTMLElement;
const dot = (indicatorEl: HTMLElement): HTMLElement => indicatorEl.firstElementChild as HTMLElement;

describe('RadioGroup + Radio', () => {
  it('is a radiogroup named by its label, with radios named by theirs', () => {
    const { getByRole, getByLabelText, getByTestId } = render(RadioHarness);
    const group = getByRole('radiogroup', { name: 'Pay via' });
    expect(group).toBe(getByTestId('group'));
    expect(group.className.endsWith('mt-2')).toBe(true);
    expect(getByLabelText('QR code')).toBe(getByTestId('qr'));
  });

  it('radios share one name: the prop, or a generated one', () => {
    const named = render(RadioHarness, { props: { name: 'flow' } });
    expect(input(named.getByTestId('qr')).name).toBe('flow');
    named.unmount();

    const { getByTestId } = render(RadioHarness);
    const generated = input(getByTestId('qr')).name;
    expect(generated).not.toBe('');
    expect(input(getByTestId('web')).name).toBe(generated);
  });

  it('a pick reports onChange and updates the bound value', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(RadioHarness, { props: { onChange } });
    await fireEvent.click(getByTestId('web'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ value: 'web' }));
    expect(getByTestId('bound').textContent).toBe('web');
    expect(input(getByTestId('web')).checked).toBe(true);
    expect(input(getByTestId('qr')).checked).toBe(false);
  });

  it('follows a value set from the outside', async () => {
    const { getByTestId, rerender } = render(RadioHarness, {
      props: { value: 'qr' },
    });
    expect(input(getByTestId('qr')).checked).toBe(true);
    await rerender({ value: 'web' });
    expect(input(getByTestId('web')).checked).toBe(true);
    expect(input(getByTestId('qr')).checked).toBe(false);
  });

  it('a disabled group refuses a synthetic pick and writes it back', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(RadioHarness, {
      props: { value: 'qr', isDisabled: true, onChange },
    });
    const web = input(getByTestId('web'));
    expect(web.disabled).toBe(true);
    web.checked = true;
    await fireEvent.change(web);
    expect(onChange).not.toHaveBeenCalled();
    expect(web.checked).toBe(false);
  });

  it('one radio can be disabled on its own', () => {
    const { getByTestId } = render(RadioHarness, {
      props: { webDisabled: true },
    });
    expect(input(getByTestId('web')).disabled).toBe(true);
    expect(input(getByTestId('qr')).disabled).toBe(false);
  });

  it('every radio gets its parts from the group', () => {
    const { getByTestId } = render(RadioHarness);
    expectClass(getByTestId('qr'), 'sr-only');
    expectClass(indicator(getByTestId('web')), 'w-4');
  });

  it('hides the input and draws the pick on the indicator', async () => {
    const { getByTestId } = render(RadioHarness, { props: { value: 'qr' } });
    const qr = indicator(getByTestId('qr'));
    const web = indicator(getByTestId('web'));
    expect(qr.getAttribute('aria-hidden')).toBe('true');
    expectClass(qr, 'bg-interactive-primary-default');
    expectClass(web, 'border-interactive-gray-highlighted');
    expectClass(qr, 'border-interactive-primary-default');
    expectClass(dot(qr), 'opacity-1300');
    expectNoClass(dot(web), 'opacity-1300');

    await fireEvent.click(getByTestId('web'));
    expectClass(web, 'bg-interactive-primary-default');
    expectClass(dot(web), 'opacity-1300');
    expectNoClass(qr, 'bg-interactive-primary-default');
    expectNoClass(dot(qr), 'opacity-1300');
  });

  it('is radios only: no pill, no thumb — that look is SegmentedControl', () => {
    const { getByTestId } = render(RadioHarness, { props: { value: 'qr' } });
    const box = getByTestId('qr').parentElement!.parentElement!;
    expect(box.className).not.toContain('bg-interactive-gray-faded');
    expect(box.querySelector(':scope > [aria-hidden="true"]')).toBeNull();
    expect(box.children).toHaveLength(2);
  });

  it('inside a Form a required group blocks submit, then submits the pick', async () => {
    const onSubmit = vi.fn();
    const { getByTestId, getByText, queryByText } = render(RadioHarness, {
      props: { inForm: true, name: 'flow', helpText: 'Choose one', onSubmit },
    });

    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    const line = getByText('msg:required');
    expect(queryByText('Choose one')).toBeNull();
    const group = getByTestId('group');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(line.closest('[id]')?.id);
    expectClass(indicator(getByTestId('qr')), 'border-interactive-negative-default');

    await fireEvent.click(getByTestId('qr'));
    await flush();
    expect(queryByText('msg:required')).toBeNull();

    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ flow: 'qr' });
  });
});

describe('Radio, as Blade', () => {
  it('describes a radio by its help text, inside its label', () => {
    const { getByTestId, getByText } = render(RadioHarness);
    const help = getByText('Scan with any UPI app');
    expect(getByTestId('qr').getAttribute('aria-describedby')).toBe(help.id);
    expect(help.closest('label')).toBe(getByTestId('qr').closest('label'));
  });

  it('sizes the circle, the dot, the title and the gap per group size', async () => {
    const { resolveRadioGroup } = await import('../components/radio/styles');
    const large = resolveRadioGroup({ size: 'large' });
    expect(large.options).toContain('gap-3');
    expect(large.radio.indicator?.root).toContain('w-5');
    expect(large.radio.indicator?.dot.picked).toContain('w-2');
    expect(large.radio.label).toContain('text-200');
    expect(resolveRadioGroup({ size: 'small' }).options).toContain('gap-1');
  });
});
