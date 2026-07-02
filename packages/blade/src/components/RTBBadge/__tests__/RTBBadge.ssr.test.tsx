import React from 'react';
import { RTBBadge } from '../RTBBadge';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<RTBBadge />', () => {
  it('should render RTBBadge ssr', () => {
    const { container } = renderWithSSR(<RTBBadge variant="neutral" />);
    expect(container).toMatchSnapshot();
  });
});
