import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import SwitchHarness from './fixtures/SwitchHarness.svelte';
import { expectClass } from './classes';

describe('Switch', () => {
  it('is a labelled switch whose track and thumb follow the state', () => {
    const onChange = vi.fn();
    const { getByRole } = render(SwitchHarness, { props: { onChange } });
    const control = getByRole('switch', { name: 'Save this card' });
    const track = control.nextElementSibling;
    expect((control as HTMLInputElement).checked).toBe(false);
    expectClass(track, 'bg-interactive-gray-default');
    expectClass(track?.firstElementChild, 'translate-x-0');
    expect(control.parentElement?.className.endsWith('mt-1')).toBe(true);

    return fireEvent.click(control).then(() => {
      expect(onChange).toHaveBeenCalledWith({ isChecked: true });
      expectClass(track, 'bg-interactive-primary-default');
      expectClass(track?.firstElementChild, 'translate-x-full');
    });
  });

  it('follows a value the host keeps driving', () => {
    const { getByRole, rerender } = render(SwitchHarness);
    const control = getByRole('switch') as HTMLInputElement;
    return rerender({ isChecked: true }).then(() => {
      expect(control.checked).toBe(true);
    });
  });

  it('while loading it says so and refuses toggles, but stays focusable', () => {
    const onChange = vi.fn();
    const { getByRole } = render(SwitchHarness, {
      props: { isLoading: true, onChange },
    });
    const control = getByRole('switch') as HTMLInputElement;
    expect(control.getAttribute('aria-busy')).toBe('true');
    expect(control.disabled).toBe(false);
    expectClass(
      control.nextElementSibling?.firstElementChild?.firstElementChild,
      'animate-spin'
    );
    return fireEvent.click(control).then(() => {
      expect(onChange).not.toHaveBeenCalled();
      expect(control.checked).toBe(false);
    });
  });

  it('disabled: the control is disabled and the row says so', () => {
    const { getByRole } = render(SwitchHarness, {
      props: { isDisabled: true },
    });
    const control = getByRole('switch') as HTMLInputElement;
    expect(control.disabled).toBe(true);
    expectClass(control.parentElement, 'pointer-events-none');
    expect(control.parentElement?.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('Switch sizes, as Blade', () => {
  it('is bigger on phones and takes the desktop size from m', async () => {
    const { resolveSwitch } = await import('../components/switch/styles');
    const medium = resolveSwitch({});
    expect(medium.track.off).toContain('h-6 w-11');
    expect(medium.track.off).toContain('m:h-5 m:w-9');
    expect(medium.thumb.on).toContain('w-5 h-5 m:w-4 m:h-4');
    expect(medium.icon.on).toContain('!w-[10px]');
    const small = resolveSwitch({ size: 'small' });
    expect(small.track.on).toContain('h-5 w-9 m:h-4 m:w-7');
  });
});
