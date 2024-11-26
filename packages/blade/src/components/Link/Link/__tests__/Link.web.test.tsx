import { fireEvent } from '@testing-library/react';
import type { LinkProps } from '../Link';
import Link from '../Link';
import assertAccessible from '~utils/testing/assertAccessible.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const colors: LinkProps['color'][] = ['primary', 'white', 'neutral'];

describe('<Link />', () => {
  it('should render link with default properties', () => {
    const linkText = 'Learn More';
    const { container, getByText, getByRole } = renderWithTheme(<Link>{linkText}</Link>);
    expect(container).toMatchSnapshot();
    expect(getByRole('link')).toBeInTheDocument();
    expect(getByText('Learn More')).toBeInTheDocument();
  });

  it('should render with small size', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <Link icon={InfoIcon} size="small">
        {linkText}
      </Link>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render link with an href, target, rel and title', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <Link
        href="https://www.google.com/"
        target="_blank"
        rel="noreferrer noopener"
        htmlTitle="Google"
      >
        {linkText}
      </Link>,
    );
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
    expect(getByRole('link')).toHaveAttribute('title', 'Google');
  });

  it('should render link with icon without text', () => {
    const { container } = renderWithTheme(<Link icon={InfoIcon} />);
    expect(container).toMatchSnapshot();
  });

  it('should render link with icon with default iconPosition', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(<Link icon={InfoIcon}>{linkText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('should render link with icon with left iconPosition', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <Link iconPosition="left" icon={InfoIcon}>
        {linkText}
      </Link>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render link with icon with right iconPosition', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <Link iconPosition="right" icon={InfoIcon}>
        {linkText}
      </Link>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button variant of link', () => {
    const linkText = 'Learn More';
    const { container, getByRole } = renderWithTheme(<Link variant="button">{linkText}</Link>);
    expect(getByRole('button')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render disabled button variant of link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <Link variant="button" isDisabled={true}>
        {linkText}
      </Link>,
    );
    expect(container).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render ${color} color link`, () => {
      const linkText = 'Learn More';
      const { container } = renderWithTheme(<Link color={color}>{linkText}</Link>);
      expect(container).toMatchSnapshot();
    });

    it(`should render disabled ${color} color link`, () => {
      const linkText = 'Learn More';
      const { container } = renderWithTheme(
        <Link color={color} isDisabled={true}>
          {linkText}
        </Link>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should call function on click of button variant of link', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <Link variant="button" onClick={onClick}>
        {linkText}
      </Link>,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have accessibilityLabel', () => {
    const LinkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <Link accessibilityLabel="Info" icon={InfoIcon}>
        {LinkText}
      </Link>,
    );
    expect(getByRole('link')).toHaveAccessibleName('Info');
  });

  it('should not have accessibility violations with anchor variant', async () => {
    const linkText = 'Learn more';
    const { container } = renderWithTheme(<Link variant="anchor">{linkText}</Link>);
    await assertAccessible(container);
  });

  it('should not have accessibility violations with button variant', async () => {
    const linkText = 'Learn more';
    const { container } = renderWithTheme(<Link variant="button">{linkText}</Link>);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const linkText = 'Learn More';
    const { getByTestId } = renderWithTheme(<Link testID="link-test">{linkText}</Link>);
    expect(getByTestId('link-test')).toBeTruthy();
  });

  it('should accept data-analytics attributes', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(<Link data-analytics-link="learn-more">{linkText}</Link>);
    expect(getByRole('link')).toHaveAttribute('data-analytics-link', 'learn-more');
  });
});
