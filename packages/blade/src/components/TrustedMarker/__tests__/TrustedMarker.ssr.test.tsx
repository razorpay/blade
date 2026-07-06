import React from 'react';
import { TrustedMarker } from '../TrustedMarker';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<TrustedMarker />', () => {
  it('should render TrustedMarker ssr', () => {
    const { container } = renderWithSSR(<TrustedMarker variant="neutral" />);
    expect(container).toMatchSnapshot();
  });
});
