import userEvents from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { SideNavExample } from './SideNavExample';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

describe('SideNav', () => {
  test('should render', () => {
    const { container } = renderWithTheme(<SideNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('should supports styled-props', () => {
    const { getByRole } = renderWithTheme(
      // Have to pass display="block" otherwise component ignores media query style and selects base display value which is none
      <SideNavExample position="absolute" zIndex={1234} display="block" />,
    );
    expect(getByRole('navigation')).toHaveStyle('z-index: 1234; position: absolute');
  });

  test('should open L2 and L3', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<SideNavExample display="block" />);

    // Open L2
    await user.click(getByRole('link', { name: 'L2 Trigger' }));
    await waitFor(() => expect(getByRole('link', { name: 'L2 Item' })).toBeVisible());

    // Select L2 Item
    expect(getByRole('link', { name: 'L2 Item' })).toHaveAttribute('aria-current', 'page');
    await user.click(getByRole('link', { name: 'L2 Item 2' }));
    expect(getByRole('link', { name: 'L2 Item 2' })).toHaveAttribute('aria-current', 'page');

    // Open L3
    await user.click(getByRole('button', { name: 'L3 Trigger' }));
    await waitFor(() => expect(getByRole('link', { name: 'L3 Item 2' })).toBeVisible());

    // Select L3 Item
    await user.click(getByRole('link', { name: 'L3 Item 2' }));
    expect(getByRole('link', { name: 'L3 Item 2' })).toHaveAttribute('aria-current', 'page');
  });

  test('should keep L3 Item selected based on URL', () => {
    const { getByRole } = renderWithTheme(
      <SideNavExample display="block" initialEntries={['/l3-item']} />,
    );

    expect(getByRole('link', { name: 'L3 Item' })).toHaveAttribute('aria-current', 'page');
  });

  test('should pass general a11y', async () => {
    const { container } = renderWithTheme(<SideNavExample display="block" />);

    await assertAccessible(container);
  });
});
