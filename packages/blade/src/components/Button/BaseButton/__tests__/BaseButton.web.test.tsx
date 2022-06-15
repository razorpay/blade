/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.web';
import { CreditCardIcon } from '../../../Icons';
import BaseButton from '../BaseButton';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseButton />', () => {
  it('should render button with default properties', () => {
    const buttonText = 'Pay Now';
    const { container, getByText, getByRole } = renderWithTheme(
      <BaseButton>{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Pay Now')).toBeInTheDocument();
  });

  it('should throw an error when there is no icon or text passed to the button', () => {
    try {
      // @ts-expect-error testing failure case when there is no icon or text passed
      renderWithTheme(<BaseButton />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: BaseButton]: At least one of icon or text is required to render a button.`,
        );
      }
    }
  });

  it('should render xsmall size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="xsmall">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="small">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="medium">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="large">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon without text', () => {
    const { container } = renderWithTheme(<BaseButton icon={CreditCardIcon} />);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton icon={CreditCardIcon}>{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with left iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton iconPosition="left" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with right iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton iconPosition="right" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with full width', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton isFullWidth={true}>{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled button', () => {
    const buttonText = 'Pay Now';
    const { container, getByRole } = renderWithTheme(
      <BaseButton isDisabled={true}>{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeDisabled();
  });

  it('should render button of type "submit"', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(<BaseButton type="submit">{buttonText}</BaseButton>);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should render button of type "reset"', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(<BaseButton type="reset">{buttonText}</BaseButton>);
    expect(getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('should call function on click', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<BaseButton onClick={onClick}>{buttonText}</BaseButton>);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
