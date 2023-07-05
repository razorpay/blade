/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Skeleton } from '../Skeleton';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Box } from '~components/Box';

describe('<Skeleton />', () => {
  it('should render skeleton', () => {
    const { toJSON } = renderWithTheme(<Skeleton width="100%" height="50px" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should support margin and other layout props', () => {
    const { toJSON } = renderWithTheme(
      <Box display="flex">
        <Skeleton width="100%" height="50px" flex={1} margin="spacing.2" />,
        <Skeleton width="100%" height="50px" flex={1} margin="spacing.2" />,
      </Box>,
    );
    expect(toJSON).toMatchSnapshot();
  });
});
