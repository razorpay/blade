import React from 'react';

import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Skeleton } from '../Skeleton';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Skeleton />', () => {
  it('should render', () => {
    const { container } = renderWithSSR(
      <Skeleton width="100%" height="50px" flex={1} margin="spacing.2" />,
    );
    expect(container).toMatchSnapshot();
  });
});
