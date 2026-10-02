import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import FieldWiringHarness from './fixtures/FieldWiringHarness.svelte';

// Every choice group is a form field through the one field shell: a pick
// lets the Form validate on input, and the Form can reveal the group.
describe('choice groups in a Form', () => {
  it('a CardGroup pick reaches the form as an input (B1)', async () => {
    const onInput = vi.fn();
    const { getByTestId } = render(FieldWiringHarness, {
      props: { which: 'cards', onInput },
    });
    await fireEvent.click(getByTestId('plans-0'));
    await waitFor(() =>
      expect(onInput).toHaveBeenCalledWith(expect.objectContaining({ plan: 'monthly' }))
    );
  });

  type Queries = {
    getByTestId: (id: string) => HTMLElement;
    getAllByRole: (role: string) => HTMLElement[];
  };
  it.each([
    ['cards', 'plan', (q: Queries) => q.getByTestId('plans-0')],
    ['chips', 'tip', (q: Queries) => q.getByTestId('tip-10').querySelector('input')],
    ['options', 'bank', (q: Queries) => q.getAllByRole('radio')[0]],
  ] as const)(
    'a missing %s pick is revealed at its first enabled control (B2)',
    async (which, name, first) => {
      const revealField = vi.fn();
      const queries = render(FieldWiringHarness, {
        props: { which, revealField },
      });
      await fireEvent.submit(queries.getByTestId('submit').closest('form')!);
      await waitFor(() => expect(revealField).toHaveBeenCalled());
      expect(revealField).toHaveBeenCalledWith(first(queries), name);
    }
  );
});
