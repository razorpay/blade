import userEvent from '@testing-library/user-event';
import { Breadcrumb, BreadcrumbItem } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Breadcrumb />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(container).toMatchSnapshot();
  });

  test('current item should have aria-current', () => {
    const { container, getByText } = renderWithTheme(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact" isCurrentPage>
          Contact
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(container).toMatchSnapshot();
    expect(getByText('Contact').closest('li')).toHaveAttribute('aria-current', 'page');
  });

  test('should work with showLastSeparator', () => {
    const { container } = renderWithTheme(
      <Breadcrumb showLastSeparator>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should work with onClick', async () => {
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(
      <Breadcrumb showLastSeparator>
        <BreadcrumbItem onClick={onClick} href="/home">
          Home
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    const link = getByText('Home');
    await userEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should pass a11y render', async () => {
    const { container } = renderWithTheme(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
      </Breadcrumb>,
    );

    await assertAccessible(container);
  });
  it('should support data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <Breadcrumb data-analytics-breadcrumb="basicRoutes">
        <BreadcrumbItem href="/" data-analytics-breadcrumb-item="home">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(
      container.querySelector('[data-analytics-breadcrumb="basicRoutes"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-analytics-breadcrumb-item="home"]')).toBeInTheDocument();
  });
});
