import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { TopNavExample } from './TopNavExample';

describe('<TopNav />', () => {
  it('should render TopNav ssr', () => {
    const { container } = renderWithSSR(<TopNavExample />);
    expect(container).toMatchSnapshot();
  });
});
