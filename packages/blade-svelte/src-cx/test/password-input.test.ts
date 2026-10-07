import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import PasswordInput from '../components/password-input/PasswordInput.svelte';
import { glyphsIn } from './classes';

describe('PasswordInput', () => {
  it('is masked, never autocapitalized, and the button reveals and hides it', async () => {
    const { getByLabelText, getByRole } = render(PasswordInput, {
      props: { label: 'Password' },
    });
    const control = getByLabelText('Password') as HTMLInputElement;
    expect(control.type).toBe('password');
    expect(control.getAttribute('autocapitalize')).toBe('none');

    await fireEvent.click(getByRole('button', { name: 'Show password' }));
    expect(control.type).toBe('text');

    await fireEvent.click(getByRole('button', { name: 'Hide password' }));
    expect(control.type).toBe('password');
  });

  it('passes autoComplete through, and has no reveal button when disabled or turned off', async () => {
    const { getByLabelText, queryByRole, rerender } = render(PasswordInput, {
      props: { label: 'Password', autoComplete: 'new-password', isDisabled: true },
    });
    const control = getByLabelText('Password') as HTMLInputElement;
    expect(control.getAttribute('autocomplete')).toBe('new-password');
    expect(control.type).toBe('password');
    expect(queryByRole('button')).toBeNull();

    await rerender({ label: 'Password', isDisabled: false, showRevealButton: false });
    expect(queryByRole('button')).toBeNull();
  });

  it("takes Figma's prefix and suffix, and sizes the reveal glyph with the field", () => {
    const { getByText, getByRole, container } = render(PasswordInput, {
      props: { label: 'Password', prefix: 'rzp-', suffix: '-x', size: 'large' },
    });
    expect(getByText('rzp-').className).toContain('pl-2');
    expect(getByText('-x').className).toContain('pr-2');
    const reveal = getByRole('button', { name: 'Show password' });
    expect(glyphsIn(reveal)[0]?.className).toContain('w-5 h-5');
    expect(container.querySelector('input')?.parentElement?.className).toContain('min-h-12');
  });
});
