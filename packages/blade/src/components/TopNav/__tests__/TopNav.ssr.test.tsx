import React from 'react';
import { TopNavExample } from './TopNavExample';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<TopNav />', () => {
  it('should render TopNav ssr', () => {
    const { container } = renderWithSSR(<TopNavExample />);
    expect(container).toMatchSnapshot();
  });
});
