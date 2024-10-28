import React from 'react';
import { BottomNavExample } from './BottomNavExample';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<BottomNav />', () => {
  it('should render BottomNav ssr', () => {
    const { container } = renderWithSSR(<BottomNavExample />);
    expect(container).toMatchSnapshot();
  });
});
