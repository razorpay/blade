import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TextInput from '../TextInput.svelte';

async function findInput(): Promise<HTMLElement> {
  return screen.findByRole('textbox');
}

describe('<TextInput /> readOnly & spellCheck', () => {
  it('does not render readonly by default', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com' } });
    const input = await findInput();
    expect(input).not.toHaveAttribute('readonly');
  });

  it('renders readonly when readOnly is set', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com', readOnly: true } });
    const input = await findInput();
    expect(input).toHaveAttribute('readonly');
  });

  it('renders spellcheck off when spellCheck is set', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com', spellCheck: false } });
    const input = await findInput();
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('renders spellcheck on when spellCheck is true', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com', spellCheck: true } });
    const input = await findInput();
    expect(input).toHaveAttribute('spellcheck', 'true');
  });
});
