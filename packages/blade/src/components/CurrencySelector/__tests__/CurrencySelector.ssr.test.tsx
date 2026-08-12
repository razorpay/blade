import React from 'react';
import { CurrencySelector } from '../CurrencySelector';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<CurrencySelector />', () => {
  it('should render in SSR', () => {
    const { container, getByRole } = renderWithSSR(
      <CurrencySelector
        currencies={[
          { code: 'USD', emoji: '🇺🇸' },
          { code: 'INR', emoji: '🇮🇳' },
        ]}
        defaultValue="USD"
        accessibilityLabel="Select currency"
      />,
    );
    expect(getByRole('radiogroup', { name: 'Select currency' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
