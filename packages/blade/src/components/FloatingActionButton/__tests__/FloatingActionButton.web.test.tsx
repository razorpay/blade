import userEvents from '@testing-library/user-event';
import React from 'react';
import { FloatingActionButton } from '../FloatingActionButton';
import { PlusIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';
import { componentZIndices } from '~utils/componentZIndices';

describe('<FloatingActionButton />', () => {
  it('should render with a label', () => {
    const { container } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon}>Create payment</FloatingActionButton>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render as an icon-only button when children is omitted', () => {
    const { container, getByRole } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} accessibilityLabel="Create payment" />,
    );

    expect(getByRole('button', { name: 'Create payment' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it.each(['primary', 'white', 'neutral'] as const)('should render %s color', (color) => {
    const { container } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} color={color}>
        Create payment
      </FloatingActionButton>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should anchor to the bottom end of the viewport by default', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({
      position: 'fixed',
      bottom: '16px',
      right: '16px',
    });
  });

  it('should anchor to the bottom start of the viewport', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} placement="bottom-start" testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ bottom: '16px', left: '16px' });
  });

  it('should center itself when placement is bottom', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} placement="bottom" testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ left: '50%', transform: 'translateX(-50%)' });
  });

  it('should apply the offset to the anchored edges', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} offset="spacing.9" testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ bottom: '40px', right: '40px' });
  });

  it('should default zIndex to the registered fab value', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ zIndex: `${componentZIndices.fab}` });
  });

  it('should let zIndex be overridden', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} zIndex={1234} testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ zIndex: '1234' });
  });

  it('should let styled-props override the placement', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} position="absolute" bottom="spacing.11" testID="fab">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveStyle({ position: 'absolute', bottom: '56px' });
  });

  it('should call onClick when clicked', async () => {
    const user = userEvents.setup();
    const onClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} onClick={onClick}>
        Create payment
      </FloatingActionButton>,
    );

    await user.click(getByRole('button', { name: 'Create payment' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvents.setup();
    const onClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} isDisabled onClick={onClick}>
        Create payment
      </FloatingActionButton>,
    );

    await user.click(getByRole('button', { name: 'Create payment' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should render an anchor when href is passed', () => {
    const { getByRole } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} href="/payments">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByRole('link', { name: 'Create payment' })).toHaveAttribute('href', '/payments');
  });

  it('should forward the ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();

    renderWithTheme(
      <FloatingActionButton ref={ref} icon={PlusIcon}>
        Create payment
      </FloatingActionButton>,
    );

    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('should support data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} testID="fab" data-analytics-name="create-payment">
        Create payment
      </FloatingActionButton>,
    );

    expect(getByTestId('fab')).toHaveAttribute('data-analytics-name', 'create-payment');
  });

  it('should render a loading neutral button with an inverted spinner', () => {
    const { container } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} color="neutral" isLoading>
        Create payment
      </FloatingActionButton>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should pass general a11y with a label', async () => {
    const { container } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon}>Create payment</FloatingActionButton>,
    );

    await assertAccessible(container);
  });

  it('should pass general a11y when icon-only', async () => {
    const { container } = renderWithTheme(
      <FloatingActionButton icon={PlusIcon} accessibilityLabel="Create payment" />,
    );

    await assertAccessible(container);
  });
});
