/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';
import Button from '../Button';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { CreditCardIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn((href) => Promise.resolve(href)),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
}));

describe('<Button />', () => {
  it('should render button with default properties', () => {
    const buttonText = 'Pay Now';
    const { toJSON, getByText } = renderWithTheme(<Button>{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Pay Now')).toBeTruthy();
  });

  it('should render xsmall size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button size="xsmall">{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button size="small">{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button size="medium">{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button size="large">{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button icon={CreditCardIcon}>{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with icon with right iconPosition', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <Button iconPosition="right" icon={CreditCardIcon}>
        {buttonText}
      </Button>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with full width', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button isFullWidth={true}>{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled button', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { toJSON, getByText } = renderWithTheme(
      <Button isDisabled={true} onClick={onClick}>
        {buttonText}
      </Button>,
    );
    const button = getByText(buttonText);
    fireEvent.press(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button variant="secondary">{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <Button variant="secondary" isDisabled={true}>
        {buttonText}
      </Button>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<Button variant="tertiary">{buttonText}</Button>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <Button variant="tertiary" isDisabled={true}>
        {buttonText}
      </Button>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call function on click', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(<Button onClick={onClick}>{buttonText}</Button>);
    const button = getByText(buttonText);
    fireEvent.press(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <Button
          ref={(value) => {
            // @ts-expect-error
            ref.current = value;
            refValue = value;
          }}
        >
          Pay now
        </Button>
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toHaveProperty('focus');
  });

  it('should open URL when Button is pressed with href', async () => {
    const { getByRole } = renderWithTheme(
      <Button href="https://youtu.be/iPaBUhIsslA">Learn More</Button>,
    );
    const button = getByRole('link');
    fireEvent.press(button);
    await waitFor(() =>
      expect(Linking.openURL).toHaveBeenCalledWith('https://youtu.be/iPaBUhIsslA'),
    );
  });

  it('should accept testID', () => {
    const buttonText = 'Pay Now';
    const { getByTestId } = renderWithTheme(<Button testID="button-test">{buttonText}</Button>);
    expect(getByTestId('button-test')).toBeTruthy();
  });
});
