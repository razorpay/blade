import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { SideNavExample } from './SideNavExample';

describe('<SideNav />', () => {
  it('should render SideNav ssr', () => {
    const { container } = renderWithSSR(<SideNavExample display="flex" />);
    expect(container).toMatchSnapshot();
  });
});
