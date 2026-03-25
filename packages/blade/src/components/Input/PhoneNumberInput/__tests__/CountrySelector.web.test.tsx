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
const COUNTRY_NAMES: Record<(typeof ALLOWED)[number], string> = {
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
      expect(getByRole('option', { name: /india/i })).toBeInTheDocument();
    });

    // Other countries should no longer be visible
    expect(queryByRole('option', { name: /australia/i })).not.toBeInTheDocument();
    expect(queryByRole('option', { name: /germany/i })).not.toBeInTheDocument();
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
      expect(getByRole('option', { name: /australia/i })).toBeInTheDocument();
    });

    expect(queryByRole('option', { name: /india/i })).not.toBeInTheDocument();
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
      expect(getByRole('option', { name: /india/i })).toBeInTheDocument();
    });

    expect(queryByRole('option', { name: /united states/i })).not.toBeInTheDocument();
    expect(queryByRole('option', { name: /australia/i })).not.toBeInTheDocument();
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
      expect(getByRole('option', { name: /germany/i })).toBeInTheDocument();
    });

    expect(queryByRole('option', { name: /india/i })).not.toBeInTheDocument();
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
      expect(getByRole('option', { name: /india/i })).toBeInTheDocument();
    });

    // Clear the input
    await user.clear(searchInput);

    // All countries should be visible again
    await waitFor(() => {
      for (const name of Object.values(COUNTRY_NAMES)) {
        expect(getByRole('option', { name: new RegExp(name, 'i') })).toBeInTheDocument();
      }
    });
  });

  it('shows no results when search does not match any country', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <PhoneNumberInput label="Phone" allowedCountries={[...ALLOWED]} />,
    );

    const searchInput = await openAndGetSearchInput(user, getByRole);

    await user.type(searchInput, 'zzzzzzzznotacountry');

    await waitFor(() => {
      for (const name of Object.values(COUNTRY_NAMES)) {
        expect(queryByRole('option', { name: new RegExp(name, 'i') })).not.toBeInTheDocument();
      }
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
      expect(getByRole('option', { name: /india/i })).toBeInTheDocument();
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
        expect(getByRole('option', { name: new RegExp(name, 'i') })).toBeInTheDocument();
      }
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
      expect(getByRole('option', { name: /germany/i })).toBeInTheDocument();
    });

    await user.click(getByRole('option', { name: /germany/i }));

    // Dropdown should be closed after selection
    await waitFor(() => {
      expect(queryByRole('textbox', { name: /search countries/i })).not.toBeInTheDocument();
    });

    // Callback should have been called with the selected country code
    expect(onCountryChange).toHaveBeenCalledWith({ country: 'DE' });
  });
});
