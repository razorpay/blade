import React from 'react';
import { SideNavExample } from './SideNavExample';
import renderWithSSR from '~utils/testing/renderWithSSR';

describe('<SideNav />', () => {
  it('should render SideNav ssr', () => {
    const { container } = renderWithSSR(<SideNavExample display="block" />);
    expect(container).toMatchSnapshot();
  });
});
