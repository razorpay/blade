/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import Button from '../Button';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { CreditCardIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Button />', () => {
  it('should render button with default properties', () => {
    const buttonText = 'Pay Now';
    const { container, getByText, getByRole } = renderWithTheme(<Button>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Pay Now')).toBeInTheDocument();
  });

  it('should render xsmall size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="xsmall">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="small">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="medium">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="large">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button icon={CreditCardIcon}>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with right iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <Button icon={CreditCardIcon} iconPosition="right">
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with full width', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button isFullWidth={true}>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled button', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { container, getByRole } = renderWithTheme(
      <Button isDisabled={true} onClick={onClick}>
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button).toBeDisabled();
  });

  it('should render secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button variant="secondary">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <Button variant="secondary" isDisabled={true}>
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button variant="tertiary">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <Button variant="tertiary" isDisabled={true}>
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should call function on click', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<Button onClick={onClick}>{buttonText}</Button>);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it(`should expose native element methods via ref`, () => {
    const label = 'Hello';
    const focusButtonLabel = 'Focus';

    const Example = (): React.ReactElement => {
      const ref = useRef<HTMLInputElement>(null);

      return (
        <>
          <Button ref={ref}>{label}</Button>
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            {focusButtonLabel}
          </Button>
        </>
      );
    };
    const { getByRole } = renderWithTheme(<Example />);

    const button = getByRole('button', { name: label });
    const buttonTrigger = getByRole('button', { name: focusButtonLabel });

    expect(button).not.toHaveFocus();

    fireEvent.click(buttonTrigger);
    expect(button).toHaveFocus();
  });

  it('should accept testID', () => {
    const buttonText = 'Pay Now';
    const { getByTestId } = renderWithTheme(<Button testID="button-test">{buttonText}</Button>);
    expect(getByTestId('button-test')).toBeInTheDocument();
  });
});
