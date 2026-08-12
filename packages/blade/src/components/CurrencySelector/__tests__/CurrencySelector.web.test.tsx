import userEvents from '@testing-library/user-event';
import React from 'react';
import { CurrencySelector } from '../CurrencySelector';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const defaultCurrencies = [
  { code: 'USD', emoji: '🇺🇸' },
  { code: 'INR', emoji: '🇮🇳' },
];

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CurrencySelector />', () => {
  it('should render with default snapshot', () => {
    const { container } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        accessibilityLabel="Select currency"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render all currency options', () => {
    const { getByText } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        accessibilityLabel="Select currency"
      />,
    );
    expect(getByText('🇺🇸 USD')).toBeInTheDocument();
    expect(getByText('🇮🇳 INR')).toBeInTheDocument();
  });

  it('should have correct aria-label on the group', () => {
    const { getByRole } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        accessibilityLabel="Select currency"
      />,
    );
    expect(getByRole('radiogroup', { name: 'Select currency' })).toBeInTheDocument();
  });

  it('should select first currency by default when no defaultValue provided', () => {
    const { getAllByRole } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        accessibilityLabel="Select currency"
      />,
    );
    const radios = getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
  });

  it('should select the currency matching defaultValue', () => {
    const { getAllByRole } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="INR"
        accessibilityLabel="Select currency"
      />,
    );
    const radios = getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange and update selection on click', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        onChange={onChange}
        accessibilityLabel="Select currency"
      />,
    );
    await user.click(getByText('🇮🇳 INR'));
    expect(onChange).toHaveBeenCalledWith('INR');
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        onChange={onChange}
        isDisabled
        accessibilityLabel="Select currency"
      />,
    );
    await user.click(getByText('🇮🇳 INR'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should support controlled usage', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getAllByRole, rerender } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        value="USD"
        onChange={onChange}
        accessibilityLabel="Select currency"
      />,
    );
    let radios = getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');

    rerender(
      <CurrencySelector
        currencies={defaultCurrencies}
        value="INR"
        onChange={onChange}
        accessibilityLabel="Select currency"
      />,
    );
    radios = getAllByRole('radio');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('should select currency on keyboard Enter key', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        onChange={onChange}
        accessibilityLabel="Select currency"
      />,
    );
    const radios = getAllByRole('radio');
    radios[1].focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('INR');
  });

  it('should select currency on keyboard Space key', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CurrencySelector
        currencies={defaultCurrencies}
        defaultValue="USD"
        onChange={onChange}
        accessibilityLabel="Select currency"
      />,
    );
    const radios = getAllByRole('radio');
    radios[1].focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith('INR');
  });

  it('should support more than 2 currencies', () => {
    const currencies = [
      { code: 'USD', emoji: '🇺🇸' },
      { code: 'INR', emoji: '🇮🇳' },
      { code: 'EUR', emoji: '🇪🇺' },
      { code: 'GBP', emoji: '🇬🇧' },
    ];
    const { getAllByRole } = renderWithTheme(
      <CurrencySelector
        currencies={currencies}
        defaultValue="USD"
        accessibilityLabel="Select currency"
      />,
    );
    expect(getAllByRole('radio')).toHaveLength(4);
  });
});
