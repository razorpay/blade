import {
  SideNavExample,
  SideNavL4NestingErrorExample,
  SideNavTrailingExample,
} from './SideNavExample';
import { SideNav, SideNavBody, SideNavVisibility } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

// Test cases are limited here since SideNav gets flaky in unit tests with all the complexity
// Major functionality tests are added in Interaction tests

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

  test('should throw error on more than 3 level nesting', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderWithTheme(<SideNavL4NestingErrorExample />)).toThrow(
      '[Blade: SideNavLink]: SideNav only supports nesting upto L3 but L4 nesting was found. Check the nesting of your SideNavLevel items',
    );
    mockConsoleError.mockRestore();
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

  test('should show trailing on hover by default and always with trailingVisibility', () => {
    const { getByRole } = renderWithTheme(<SideNavTrailingExample display="block" />);

    expect(getByRole('button', { name: 'Create' }).closest('.show-on-link-hover')).not.toBeNull();
    expect(getByRole('button', { name: 'Unpin Links' }).closest('.show-on-link-hover')).toBeNull();
  });

  test('should render trailing on item that opens next level', () => {
    const { getByRole } = renderWithTheme(<SideNavTrailingExample display="block" />);
    const l2Trigger = getByRole('link', { name: 'L2 Trigger' });
    const trailing = getByRole('button', { name: 'Unpin L2 Trigger' });

    expect(l2Trigger).toHaveAttribute('data-l2trigger', 'true');
    // trailing is not nested inside the link since interactive elements cannot be nested
    expect(l2Trigger).not.toContainElement(trailing);
    expect(l2Trigger.parentElement).toContainElement(trailing);
  });

  test('should place trailing 12px from the end of the item', () => {
    const { getByRole } = renderWithTheme(<SideNavTrailingExample display="block" />);

    expect(getByRole('button', { name: 'Create' }).parentElement).toHaveStyle('right: 12px');
  });

  test('should keep room for trailing so the title truncates 12px before it', () => {
    const TRAILING_WIDTH = 20;
    const offsetWidth = jest
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(TRAILING_WIDTH);
    const { getByRole } = renderWithTheme(<SideNavTrailingExample display="block" />);

    // 12px padding of the item + width of trailing + 12px gap between the title and trailing
    const expectedPadding = `padding-right: ${12 + TRAILING_WIDTH + 12}px`;
    // trailing visible on hover
    expect(getByRole('link', { name: 'Home' })).toHaveStyle(expectedPadding);
    // trailing always visible
    expect(getByRole('link', { name: 'Links' })).toHaveStyle(expectedPadding);
    // trailing on item that opens next level
    expect(getByRole('link', { name: 'L2 Trigger' })).toHaveStyle(expectedPadding);

    offsetWidth.mockRestore();
  });

  test('should not keep room for trailing while SideNav is collapsed', () => {
    const TRAILING_WIDTH = 20;
    const offsetWidth = jest
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(TRAILING_WIDTH);
    const { getByRole } = renderWithTheme(
      <SideNavTrailingExample display="block" isExpanded={false} />,
    );

    // only the 12px padding of the item, so the item fits the collapsed SideNav
    expect(getByRole('link', { name: 'Home' })).toHaveStyle('padding-right: 12px');
    expect(getByRole('link', { name: 'Links' })).toHaveStyle('padding-right: 12px');

    offsetWidth.mockRestore();
  });

  test('should take trailing out of the tab order while SideNav is collapsed', () => {
    const { getByRole, unmount } = renderWithTheme(
      <SideNavTrailingExample display="block" isExpanded={true} />,
    );
    expect(getByRole('button', { name: 'Unpin Links' })).toBeVisible();
    unmount();

    const collapsed = renderWithTheme(
      <SideNavTrailingExample display="block" isExpanded={false} />,
    );
    // not in the accessibility tree, so it cannot be focused either
    expect(collapsed.queryByRole('button', { name: 'Unpin Links' })).toBeNull();
    expect(
      collapsed.getByRole('button', { name: 'Unpin Links', hidden: true }).parentElement,
    ).toHaveStyle('display: none');
  });

  test('should take SideNavVisibility content of the other state out of layout and tab order', () => {
    const getContent = (
      isExpanded: boolean,
    ): { expandedOnly: HTMLElement; collapsedOnly: HTMLElement; unmount: () => void } => {
      const { getByRole, unmount } = renderWithTheme(
        <SideNavTrailingExample display="block" isExpanded={isExpanded} />,
      );
      return {
        expandedOnly: getByRole('link', { name: '+3 More', hidden: true }).parentElement!,
        collapsedOnly: getByRole('link', { name: '+3', hidden: true }).parentElement!,
        unmount,
      };
    };

    const expanded = getContent(true);
    expect(expanded.expandedOnly).not.toHaveStyle('display: none');
    expect(expanded.collapsedOnly).toHaveStyle('display: none');
    expanded.unmount();

    const collapsed = getContent(false);
    expect(collapsed.expandedOnly).toHaveStyle('display: none');
    expect(collapsed.collapsedOnly).not.toHaveStyle('display: none');
  });

  test('should accept conditional and text content in SideNavVisibility', () => {
    const hasMore = false;
    const { getByText } = renderWithTheme(
      <SideNav display="block">
        <SideNavBody>
          <SideNavVisibility visibleWhen="expanded">
            {hasMore ? <p>+3 More</p> : null}
            All items shown
          </SideNavVisibility>
        </SideNavBody>
      </SideNav>,
    );

    expect(getByText('All items shown')).toHaveClass('hide-when-collapsed');
  });

  test('should throw error when SideNavVisibility is used outside SideNav', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <SideNavVisibility visibleWhen="expanded">
          <p>+3 More</p>
        </SideNavVisibility>,
      ),
    ).toThrow('[Blade: SideNavVisibility]: SideNavVisibility cannot be used outside of SideNav');
    mockConsoleError.mockRestore();
  });

  test('should mark SideNavVisibility content for expanded and collapsed states', () => {
    const { getByRole } = renderWithTheme(<SideNavTrailingExample display="block" />);
    const expandedOnly = getByRole('link', { name: '+3 More' }).parentElement;

    expect(expandedOnly).toHaveClass('hide-when-collapsed');
    expect(expandedOnly).toHaveAttribute('data-analytics-name', 'expanded-only');
    // content for collapsed state is hidden while SideNav is expanded
    expect(getByRole('link', { name: '+3', hidden: true }).parentElement).toHaveClass(
      'show-when-collapsed',
    );
  });

  test('it should support passing data-analytics attribute', () => {
    const { getByRole } = renderWithTheme(<SideNavExample display="block" />);

    expect(getByRole('navigation')).toHaveAttribute('data-analytics-side-nav', 'demo-item');
    expect(getByRole('link', { name: 'Home' })).toHaveAttribute('data-analytics-nav-link', 'home');
  });
});
