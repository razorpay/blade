import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Switch } from '../Switch';

describe('<Switch />', () => {
  it('should render switch ssr', () => {
    const name = 'Toggle Darkmode';
    const { container, getByRole } = renderWithSSR(<Switch accessibilityLabel={name} />);
    expect(getByRole('switch', { name })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
