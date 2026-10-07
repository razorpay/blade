import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Counter from '../components/counter/Counter.svelte';
import CounterInputHarness from './fixtures/CounterInputHarness.svelte';
import { expectClass } from './classes';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));

describe('Counter', () => {
  it('shows the value, and max+ past its max', () => {
    const { container, rerender } = render(Counter, { props: { value: 20 } });
    expect(container.textContent).toBe('20');
    void rerender({ value: 120, max: 99 });
    expect(container.textContent).toBe('99+');
  });

  it('pads the pill from two digits, and colours it per colour and emphasis', () => {
    const one = render(Counter, { props: { value: 7 } });
    const content = (root: Element): Element => root.querySelector('span > span > span')!;
    expect(content(one.container).className).not.toContain('px-2');
    one.unmount();
    const two = render(Counter, {
      props: { value: 42, color: 'positive', emphasis: 'intense' },
    });
    expectClass(content(two.container), 'px-2');
    expectClass(two.container.querySelector('span > span'), 'bg-feedback-positive-intense');
  });
});

describe('CounterInput', () => {
  const input = (get: (id: string) => HTMLElement): HTMLInputElement =>
    get('counter').querySelector('input')!;

  it('starts at min, labels its spinbutton and bounds its range', () => {
    const { getByRole, getByLabelText } = render(CounterInputHarness, {
      props: { min: 1, max: 10 },
    });
    const field = getByRole('spinbutton');
    expect(getByLabelText('Quantity')).toBe(field);
    expect((field as HTMLInputElement).value).toBe('1');
    expect(field.getAttribute('aria-valuemin')).toBe('1');
    expect(field.getAttribute('aria-valuemax')).toBe('10');
    expect(getByRole('button', { name: 'Decrement value' })).toHaveProperty('disabled', true);
  });

  it('steps with its buttons, reports and binds, and stops at max', async () => {
    const onChange = vi.fn();
    const { getByRole, getByTestId } = render(CounterInputHarness, {
      props: { value: 4, max: 5, onChange },
    });
    const plus = getByRole('button', { name: 'Increment value' });
    await fireEvent.click(plus);
    expect(onChange).toHaveBeenCalledExactlyOnceWith({ name: 'quantity', value: 5 });
    expect(getByTestId('bound').textContent).toBe('5');
    expect(plus).toHaveProperty('disabled', true);
    // The number slides in from below after a step up.
    expectClass(input(getByTestId).parentElement, 'animate-slide-up');

    await fireEvent.click(getByRole('button', { name: 'Decrement value' }));
    expect(getByTestId('bound').textContent).toBe('4');
  });

  it('clamps a typed number into the range', async () => {
    const { getByTestId } = render(CounterInputHarness, {
      props: { value: 3, min: 1, max: 10 },
    });
    const field = input(getByTestId);
    field.value = '42';
    await fireEvent.input(field);
    expect(getByTestId('bound').textContent).toBe('10');
    expect(field.value).toBe('10');
  });

  it('takes no steps while disabled or loading', () => {
    for (const props of [{ isDisabled: true }, { isLoading: true }]) {
      const { getAllByRole, unmount } = render(CounterInputHarness, {
        props: { value: 3, ...props },
      });
      for (const button of getAllByRole('button')) {
        expect(button).toHaveProperty('disabled', true);
      }
      unmount();
    }
  });

  it('submits its count under its name inside a Form', async () => {
    const onSubmit = vi.fn();
    const { getByRole, getByTestId } = render(CounterInputHarness, {
      props: { inForm: true, value: 2, onSubmit },
    });
    await fireEvent.click(getByRole('button', { name: 'Increment value' }));
    await fireEvent.click(getByTestId('submit'));
    await flush();
    expect(onSubmit.mock.calls[0][0]).toEqual({ quantity: 3 });
  });

  it.each([
    ['xsmall', 'min-w-[76px] h-7', 'w-5 h-5', 'small'],
    ['small', 'min-w-[84px] h-8', 'w-6 h-6', 'medium'],
    ['medium', 'min-w-[92px] h-9', 'w-7 h-7', 'medium'],
    ['large', 'min-w-[120px] h-12', 'w-10 h-10', 'large'],
  ] as const)("%s: Figma's box (border inside), buttons and icon", async (size, box, button, icon) => {
    const { resolveCounterInput } = await import('../components/counter-input/styles');
    const classes = resolveCounterInput({ size });
    expect(classes.box.live).toContain(box);
    expect(classes.button.decrement).toContain(button);
    expect(classes.button.decrement).toContain('[margin:3px_0_3px_3px]');
    expect(classes.button.increment).toContain('[margin:3px_3px_3px_0]');
    expect(classes.iconSize).toBe(icon);
  });
});
