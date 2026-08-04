import React from 'react';
import { AppBarExample } from './AppBarExample';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<AppBar />', () => {
  it('should render AppBar ssr', () => {
    const { container } = renderWithSSR(<AppBarExample />);
    expect(container).toMatchSnapshot();
  });
});
