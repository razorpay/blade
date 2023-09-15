import { fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import BaseLink from '../BaseLink';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
}));

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseLink />', () => {
  it('should render link with default properties', () => {
    const linkText = 'Learn More';
    const { toJSON, getByText } = renderWithTheme(<BaseLink>{linkText}</BaseLink>);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Learn More')).toBeTruthy();
  });

  it('should render open href URL on press', async () => {
    const linkText = 'Learn More';
    const { getByText } = renderWithTheme(
      <BaseLink href="https://www.google.com/">{linkText}</BaseLink>,
    );
    const button = getByText(linkText);
    fireEvent.press(button);
    await waitFor(() => expect(Linking.canOpenURL).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledTimes(1));
  });

  it('should throw an error when there is no icon or text passed to the link', () => {
    try {
      // @ts-expect-error testing failure case when there is no icon or text passed
      renderWithTheme(<BaseLink />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: BaseLink]: At least one of icon or text is required to render a link.`,
        );
      }
    }
  });

  it('should render icon only link', () => {
    const { toJSON } = renderWithTheme(<BaseLink icon={InfoIcon} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render link with icon with default iconPosition', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(<BaseLink icon={InfoIcon}>{linkText}</BaseLink>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render link with icon with left iconPosition', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink iconPosition="left" icon={InfoIcon}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render link with icon with right iconPosition', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink iconPosition="right" icon={InfoIcon}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should add hitSlop to link', () => {
    const linkText = 'Learn More';
    const hitSlop = { top: 4, right: 2, bottom: 4, left: 2 };
    const { getByRole } = renderWithTheme(<BaseLink hitSlop={hitSlop}>{linkText}</BaseLink>);
    const link = getByRole('link');
    expect(link.findByProps({ hitSlop })).toBeTruthy();
  });

  it('should render button variant of link', () => {
    const linkText = 'Learn More';
    const { toJSON, getByRole } = renderWithTheme(<BaseLink variant="button">{linkText}</BaseLink>);
    expect(getByRole('button')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled button variant of link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink variant="button" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call function on click of button variant of link with event callback ', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <BaseLink variant="button" onClick={onClick}>
        {linkText}
      </BaseLink>,
    );
    const button = getByRole('button');
    const eventData = {
      nativeEvent: {
        locationX: 8,
        locationY: 4.5,
        pageX: 24,
        pageY: 49.5,
      },
    };

    fireEvent.press(button, eventData);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(eventData);
  });

  it('should call function on click of anchor variant of link with event callback ', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <BaseLink variant="anchor" onClick={onClick}>
        {linkText}
      </BaseLink>,
    );
    const link = getByRole('link');
    const eventData = {
      nativeEvent: {
        locationX: 8,
        locationY: 4.5,
        pageX: 24,
        pageY: 49.5,
      },
    };

    fireEvent.press(link, eventData);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(eventData);
  });

  it('should change the link to a visited state after click', () => {
    const linkText = 'Learn More';
    const { toJSON, getByRole } = renderWithTheme(
      <BaseLink
        variant="anchor"
        href="https://github.com/razorpay/blade"
        target="_blank"
        rel="noreferrer noopener"
      >
        {linkText}
      </BaseLink>,
    );
    const link = getByRole('link');
    fireEvent.press(link);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not change the button to a visited state after click', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { toJSON, getByRole } = renderWithTheme(
      <BaseLink variant="button" onClick={onClick}>
        {linkText}
      </BaseLink>,
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="positive" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled positive intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="positive" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="positive" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled positive intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="positive" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="negative" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled negative intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="negative" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="negative" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled negative intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="negative" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="information" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled information intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="information" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="information" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled information intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="information" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render notice intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="notice" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled notice intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="notice" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render notice intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="notice" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled notice intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="notice" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="neutral" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled neutral intent low contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="neutral" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="neutral" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled neutral intent high contrast link', () => {
    const linkText = 'Learn More';
    const { toJSON } = renderWithTheme(
      <BaseLink intent="neutral" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have accessibilityLabel', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <BaseLink accessibilityProps={{ label: 'Info' }} icon={InfoIcon}>
        {linkText}
      </BaseLink>,
    );
    const link = getByRole('link');
    expect(link.findByProps({ accessibilityLabel: 'Info' })).toBeTruthy();
  });

  it('should accept testID', () => {
    const linkText = 'Learn More';
    const { getByTestId } = renderWithTheme(
      <BaseLink testID="base-link-test">{linkText}</BaseLink>,
    );
    expect(getByTestId('base-link-test')).toBeTruthy();
  });
});
