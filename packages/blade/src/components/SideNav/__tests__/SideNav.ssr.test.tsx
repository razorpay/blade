import React from 'react';
import { SideNavExample } from './SideNavExample';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SideNav />', () => {
  it('should render SideNav ssr', () => {
    const { container } = renderWithSSR(<SideNavExample display="flex" />);
    expect(container).toMatchSnapshot();
  });
});
