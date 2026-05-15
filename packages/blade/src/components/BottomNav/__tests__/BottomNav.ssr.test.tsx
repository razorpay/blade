import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { BottomNavExample } from './BottomNavExample';

describe('<BottomNav />', () => {
  it('should render BottomNav ssr', () => {
    const { container } = renderWithSSR(<BottomNavExample />);
    expect(container).toMatchSnapshot();
  });
});
