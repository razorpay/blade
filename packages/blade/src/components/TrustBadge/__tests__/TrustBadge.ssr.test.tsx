import React from 'react';
import { TrustBadge } from '../TrustBadge';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<TrustBadge />', () => {
  it('should render TrustBadge ssr', () => {
    const { container } = renderWithSSR(<TrustBadge emphasis="intense" />);
    expect(container).toMatchSnapshot();
  });
});
