/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { Skeleton } from '../Skeleton';
import { Box } from '~components/Box';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Skeleton />', () => {
  it('should render skeleton', () => {
    const { container } = renderWithTheme(<Skeleton width="100%" height="50px" />);
    expect(container).toMatchSnapshot();
  });

  it('should support margin and other layout props', () => {
    const { container } = renderWithTheme(
      <Box display="flex">
        <Skeleton width="100%" height="50px" flex={1} margin="spacing.2" />,
        <Skeleton width="100%" height="50px" flex={1} margin="spacing.2" />,
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not have a11y violation', async () => {
    const { container } = renderWithTheme(<Skeleton width="100%" height="50px" />);
    await assertAccessible(container);
  });
});
