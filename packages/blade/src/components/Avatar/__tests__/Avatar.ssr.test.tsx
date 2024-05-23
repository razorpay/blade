import React from 'react';
import { Avatar } from '../Avatar';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Avatar />', () => {
  it('should render  avatar', () => {
    const { container } = renderWithSSR(<Avatar name="Nitin Kumar" />);
    expect(container).toMatchSnapshot();
  });
});
