import userEvents from '@testing-library/user-event';
import { BottomNavExample } from './BottomNavExample';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

describe('BottomNav', () => {
  test('should render', () => {
    const { container } = renderWithTheme(<BottomNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('should support styled-props', () => {
    const { getByRole } = renderWithTheme(
      // Have to pass display="block" otherwise component ignores media query style and selects base display value which is none
      <BottomNavExample position="absolute" zIndex={1234} display="block" />,
    );
    expect(getByRole('navigation')).toHaveStyle('z-index: 1234; position: absolute');
  });

  test('should keep item selected based on URL', () => {
    const { getByRole } = renderWithTheme(
      <BottomNavExample display="block" initialEntries={['/transactions']} />,
    );

    expect(getByRole('link', { name: 'Transactions' })).toHaveAttribute('aria-current', 'page');
  });

  test('should call onClick when button is clicked', async () => {
    const user = userEvents.setup();
    const mockMoreClick = jest.fn();

    const { getByRole } = renderWithTheme(<BottomNavExample moreClick={mockMoreClick} />);

    await user.click(getByRole('button', { name: 'More' }));

    expect(mockMoreClick).toBeCalledTimes(1);
  });

  test('should pass general a11y', async () => {
    const { container } = renderWithTheme(<BottomNavExample />);

    await assertAccessible(container);
  });
  test('should support data-analytics attributes', () => {
    const { getByRole } = renderWithTheme(<BottomNavExample data-analytics-test="test" />);

    expect(getByRole('navigation')).toHaveAttribute('data-analytics-test', 'test');
  });
});
