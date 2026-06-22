import React from 'react';
import { BottomBar } from '../BottomBar';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';
import { Button } from '~components/Button';

const BottomBarExample = (
  props: Omit<React.ComponentProps<typeof BottomBar>, 'children'> = {},
): React.ReactElement => {
  return (
    <BottomBar {...props}>
      <Button variant="secondary" isFullWidth>
        Cancel
      </Button>
      <Button isFullWidth>Continue</Button>
    </BottomBar>
  );
};

describe('BottomBar', () => {
  test('should render', () => {
    const { container } = renderWithTheme(<BottomBarExample />);
    expect(container).toMatchSnapshot();
  });

  test('should support styled-props', () => {
    const { getByRole } = renderWithTheme(
      <BottomBarExample position="absolute" zIndex={1234} display="block" />,
    );
    expect(getByRole('group')).toHaveStyle('z-index: 1234; position: absolute');
  });

  test('should pass general a11y', async () => {
    const { container } = renderWithTheme(<BottomBarExample />);

    await assertAccessible(container);
  });

  test('should support data-analytics attributes', () => {
    const { getByRole } = renderWithTheme(<BottomBarExample data-analytics-test="test" />);

    expect(getByRole('group')).toHaveAttribute('data-analytics-test', 'test');
  });
});
