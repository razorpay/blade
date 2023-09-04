import React from 'react';
import { Display } from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Switch />', () => {
  it('should render switch ssr', () => {
    const displayText = 'Displaying Landing Page Display';
    const { container, getByRole, getByText } = renderWithSSR(<Display>{displayText}</Display>);
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Display')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
