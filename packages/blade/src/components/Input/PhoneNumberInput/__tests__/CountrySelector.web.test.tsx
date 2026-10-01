/**
 * Tests for CountrySelector search and virtualization behaviour
 *
 * We test CountrySelector through <PhoneNumberInput allowedCountries={…}> so we
 * can keep the dataset small and predictable.
 */
import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor, within } from '@testing-library/react';
import { PhoneNumberInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

// A small, deterministic set of countries used across all tests
const ALLOWED = ['IN', 'US', 'GB', 'AU', 'DE'] as const;
// Corresponding expected display names (derived from Intl.DisplayNames)
const COUNTRY_NAMES: Record<typeof ALLOWED[number], string> = {
  IN: 'India',
  US: 'United States',
  GB: 'United Kingdom',
  AU: 'Australia',
  DE: 'Germany',
};

/**
 * Opens the country-selector dropdown and returns the search <input> element.
 */
const openAndGetSearchInput = async (
  user: ReturnType<typeof userEvent.setup>,
  getByRole: ReturnType<typeof renderWithTheme>['getByRole'],
): Promise<HTMLElement> => {
  const trigger = getByRole('button', { name: /select country/i });
  await user.click(trigger);
  // The search box is labelled via accessibilityLabel
  await waitFor(() => {
    expect(getByRole('textbox', { name: /search countries/i })).toBeVisible();
  });
  return getByRole('textbox', { name: /search countries/i });
};

describe('<CountrySelector /> search', () => {
  it('renders search input when dropdown is opened', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    await openAndGetSearchInput(user, getByRole);
  });

  it('filters countries by name (case-insensitive)', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    await user.type(searchInput, 'india');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();
    });

    // Other countries should no longer be visible
    expect(queryByRole('menuitem', { name: /australia/i })).not.toBeInTheDocument();
    expect(queryByRole('menuitem', { name: /germany/i })).not.toBeInTheDocument();
  });

  it('filters countries by ISO country code', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // "AU" should surface only Australia
    await user.type(searchInput, 'AU');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /australia/i })).toBeInTheDocument();
    });

    expect(queryByRole('menuitem', { name: /india/i })).not.toBeInTheDocument();
  });

  it('filters countries by dial code without leading plus', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // India's dial code is +91 — searching "91" should show India only
    await user.type(searchInput, '91');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();
    });

    expect(queryByRole('menuitem', { name: /united states/i })).not.toBeInTheDocument();
    expect(queryByRole('menuitem', { name: /australia/i })).not.toBeInTheDocument();
  });

  it('filters countries by dial code with leading plus', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // Germany's dial code is +49
    await user.type(searchInput, '+49');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /germany/i })).toBeInTheDocument();
    });

    expect(queryByRole('menuitem', { name: /india/i })).not.toBeInTheDocument();
  });

  it('shows all countries when search query is cleared', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // Type something to narrow down
    await user.type(searchInput, 'india');
    await waitFor(() => {
      expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();
    });

    // Clear the input
    await user.clear(searchInput);

    // All countries should be visible again
    await waitFor(() => {
      for (const name of Object.values(COUNTRY_NAMES)) {
        expect(getByRole('menuitem', { name: new RegExp(name, 'i') })).toBeInTheDocument();
      }
    });
  });

  // ── Bug 3 regression: empty state ───────────────────────────────────────────
  it('shows a "No Search Result Found" message when search does not match any country', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole, getByText } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    await user.type(searchInput, 'zzzzzzzznotacountry');

    await waitFor(() => {
      // All country items should be gone
      for (const name of Object.values(COUNTRY_NAMES)) {
        expect(queryByRole('menuitem', { name: new RegExp(name, 'i') })).not.toBeInTheDocument();
      }
      // A meaningful empty-state message should appear
      expect(getByText(/no search result found/i)).toBeInTheDocument();
    });
  });

  // ── Bug 4 regression: dropdown must stay visible when there are no results ──
  it('keeps the dropdown overlay open (does not close it) when search has no results', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // Type something that won't match
    await user.type(searchInput, 'zzzznotacountry');

    // The search textbox should still be visible — the overlay is still open
    await waitFor(() => {
      expect(queryByRole('textbox', { name: /search countries/i })).toBeInTheDocument();
    });
  });

  it('resets search query when dropdown is closed and reopened', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    // Open and type a query
    let searchInput = await openAndGetSearchInput(user, getByRole);
    await user.type(searchInput, 'india');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /india/i })).toBeInTheDocument();
    });

    // Close by pressing Escape
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(getByRole('button', { name: /select country/i })).toBeInTheDocument();
    });

    // Reopen the dropdown
    searchInput = await openAndGetSearchInput(user, getByRole);

    // Search input should be empty and all countries visible again
    expect(searchInput).toHaveValue('');

    await waitFor(() => {
      for (const name of Object.values(COUNTRY_NAMES)) {
        expect(getByRole('menuitem', { name: new RegExp(name, 'i') })).toBeInTheDocument();
      }
    });
  });

  it('auto-focuses search input when dropdown opens', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });
  });

  it('selecting a filtered country closes the dropdown and updates the trigger', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput
        label="Phone"
        allowedCountries={[...ALLOWED]}
        onCountryChange={onCountryChange}
      />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    await user.type(searchInput, 'germany');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /germany/i })).toBeInTheDocument();
    });

    await user.click(getByRole('menuitem', { name: /germany/i }));

    // Dropdown should be closed after selection
    await waitFor(() => {
      expect(queryByRole('textbox', { name: /search countries/i })).not.toBeInTheDocument();
    });

    // Callback should have been called with the selected country code
    expect(onCountryChange).toHaveBeenCalledWith({ country: 'DE' });
  });

  // ── Bug 2 regression: TypeAhead state-desync ────────────────────────────────
  it('does not change the selected country while typing in the search box (no typeahead desync)', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <PhoneNumberInput
        label="Phone"
        allowedCountries={[...ALLOWED]}
        onCountryChange={onCountryChange}
        // Default country is India (IN), which is in ALLOWED
      />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // Type a query that also matches other countries but NOT "India"
    // e.g. "au" matches Australia and United States but not India
    await user.type(searchInput, 'au');

    await waitFor(() => {
      expect(getByRole('menuitem', { name: /australia/i })).toBeInTheDocument();
    });

    // onCountryChange should NOT have been called — merely searching must not
    // select a country
    expect(onCountryChange).not.toHaveBeenCalled();

    // The trigger button's accessible name should still reference India (the
    // initial selection), not Australia or any other visible result
    const trigger = getByRole('button', { name: /select country/i });
    expect(trigger).toHaveAccessibleName(/india - select country/i);
  });

  // ── Bug 1 regression: arrow-key navigation from the search input ─────────────
  it('navigates the filtered list with ArrowDown / ArrowUp and selects with Enter', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput
        label="Phone"
        // Use a fixed 2-item subset so navigation is predictable
        allowedCountries={['AU', 'DE']}
        onCountryChange={onCountryChange}
      />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    // Both countries should be visible initially
    await waitFor(() => {
      expect(getByRole('menuitem', { name: /australia/i })).toBeInTheDocument();
      expect(getByRole('menuitem', { name: /germany/i })).toBeInTheDocument();
    });

    // Arrow down twice to move focus to the first item, then second item
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    // Press Enter to select the currently focused item (Germany, the second item)
    await user.keyboard('{Enter}');

    // Dropdown should close after selection
    await waitFor(() => {
      expect(queryByRole('textbox', { name: /search countries/i })).not.toBeInTheDocument();
    });

    // Germany should be selected
    expect(onCountryChange).toHaveBeenCalledWith({ country: 'DE' });
  });
});
