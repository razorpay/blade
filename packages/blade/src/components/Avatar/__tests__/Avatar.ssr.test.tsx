import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Avatar } from '../Avatar';

describe('<Avatar />', () => {
  it('should render  avatar', () => {
    const { container } = renderWithSSR(<Avatar name="Nitin Kumar" />);
    expect(container).toMatchSnapshot();
  });
});
