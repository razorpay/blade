/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.native';
import { CreditCardIcon } from '../../../Icons';
import Button from '../Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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
});
