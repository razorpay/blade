import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import SearchInput from '../components/search-input/SearchInput.svelte';

describe('SearchInput', () => {
  it('is a text searchbox with the search key, led by the glyph', () => {
    const { getByRole, container } = render(SearchInput, {
      props: { accessibilityLabel: 'Search banks', testID: 'search' },
    });
    const control = getByRole('searchbox', { name: 'Search banks' });
    // Not `search`: the browser's clear button would sit beside the field's.
    expect(control.getAttribute('type')).toBe('text');
    expect(control.getAttribute('enterkeyhint')).toBe('search');
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('drops the glyph with showSearchIcon off', () => {
    const { container } = render(SearchInput, {
      props: { accessibilityLabel: 'Search banks', showSearchIcon: false },
    });
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('shows the clear button while it holds text, and clearing reports', async () => {
    const onChange = vi.fn();
    const onClearButtonClick = vi.fn();
    const { getByRole, queryByRole } = render(SearchInput, {
      props: {
        accessibilityLabel: 'Search banks',
        name: 'q',
        onChange,
        onClearButtonClick,
      },
    });
    const control = getByRole('searchbox') as HTMLInputElement;
    expect(queryByRole('button', { name: 'Clear Input Content' })).toBeNull();

    await fireEvent.input(control, { target: { value: 'hdfc' } });
    expect(onChange).toHaveBeenLastCalledWith({ name: 'q', value: 'hdfc' });

    await fireEvent.click(getByRole('button', { name: 'Clear Input Content' }));
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'q', value: '' });
    expect(control.value).toBe('');
  });
});
