import { fireEvent } from '@testing-library/react';
import assertAccessible from '../../../../_helpers/testing/assertAccessible.web';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.web';
import { InfoIcon } from '../../../Icons';
import Link from '../Link';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Link />', () => {
  it('should render link with default properties', () => {
    const linkText = 'Learn More';
    const { container, getByText, getByRole } = renderWithTheme(<Link>{linkText}</Link>);
    expect(container).toMatchSnapshot();
    expect(getByRole('link')).toBeInTheDocument();
    expect(getByText('Learn More')).toBeInTheDocument();
  });

  it('should render link with an href, target and rel', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <Link href="https://www.google.com/" target="_blank" rel="noreferrer noopener">
        {linkText}
      </Link>,
    );
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
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
});
