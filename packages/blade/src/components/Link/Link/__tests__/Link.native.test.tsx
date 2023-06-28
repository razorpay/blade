import { fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import Link from '../Link';
import { InfoIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
}));

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Link />', () => {
  it('should render link with default properties', () => {
    const linkText = 'Learn More';
    const { toJSON, getByText } = renderWithTheme(<Link>{linkText}</Link>);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Learn More')).toBeTruthy();
  });

  it('should render with small size', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <Link icon={InfoIcon} size="small">
        {linkText}
      </Link>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render open href URL on press', async () => {
    const linkText = 'Learn More';
    const { getByText } = renderWithTheme(<Link href="https://www.google.com/">{linkText}</Link>);
    const button = getByText(linkText);
    fireEvent.press(button);
    await waitFor(() => expect(Linking.canOpenURL).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledTimes(1));
  });

  it('should render link with icon without text', () => {
    const { toJSON } = renderWithTheme(<Link icon={InfoIcon} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render link with icon with default iconPosition', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(<Link icon={InfoIcon}>{linkText}</Link>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render link with icon with left iconPosition', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <Link iconPosition="left" icon={InfoIcon}>
        {linkText}
      </Link>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render link with icon with right iconPosition', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <Link iconPosition="right" icon={InfoIcon}>
        {linkText}
      </Link>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button variant of link', () => {
    const linkText = 'Learn More';
    const { toJSON, getByRole } = renderWithTheme(<Link variant="button">{linkText}</Link>);
    expect(getByRole('button')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled button variant of link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <Link variant="button" isDisabled={true}>
        {linkText}
      </Link>,
    );
    expect(toJSON()).toMatchSnapshot();
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
    fireEvent.press(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have accessibilityLabel', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <Link accessibilityLabel="Info" icon={InfoIcon}>
        {linkText}
      </Link>,
    );
    const link = getByRole('link');
    expect(link.findByProps({ accessibilityLabel: 'Info' })).toBeTruthy();
  });

  it('should accept testID', () => {
    const linkText = 'Learn More';
    const { getByTestId } = renderWithTheme(<Link testID="link-test">{linkText}</Link>);
    expect(getByTestId('link-test')).toBeTruthy();
  });
});
