/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import React from 'react';
import BaseButton from '../BaseButton';
import assertAccessible from '~utils/testing/assertAccessible.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { CloseIcon, CreditCardIcon } from '~components/Icons';

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

  it('should call function on click of button with event callback', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<BaseButton onClick={onClick}>{buttonText}</BaseButton>);
    const button = getByRole('button');
    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        screenX: 20,
        screenY: 20,
      }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toBeCalledWith(
      expect.objectContaining({
        bubbles: true,
        cancelable: true,
        screenX: 20,
        screenY: 20,
      }),
    );
  });

  it('should render secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton variant="secondary">{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton variant="secondary" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton variant="tertiary">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton variant="tertiary" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="positive" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled positive intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="positive" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="negative" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled negative intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="negative" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render neutral intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="neutral" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled neutral intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="neutral" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render notice intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="notice" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled notice intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="notice" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render information intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="information" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled information intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="information" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="positive" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled positive intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="positive" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="negative" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled negative intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="negative" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render neutral intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="neutral" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled neutral intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="neutral" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render notice intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="notice" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled notice intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="notice" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render information intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="information" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render disabled information intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="information" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should have accessibilityLabel', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(
      <BaseButton accessibilityProps={{ label: 'Close' }} icon={CloseIcon}>
        {buttonText}
      </BaseButton>,
    );

    expect(getByRole('button')).toHaveAccessibleName('Close');
  });

  it('should announce button loading accessibilityLabel', async () => {
    const user = userEvents.setup();

    const ButtonLoading = (): React.ReactElement => {
      const [loading, setLoading] = React.useState(false);
      return (
        <>
          <BaseButton onClick={(): void => setLoading(!loading)}>Toggle loading</BaseButton>
          <BaseButton isLoading={loading}>Pay Now</BaseButton>
        </>
      );
    };

    const { getByText, container } = renderWithTheme(<ButtonLoading />);
    const loadingButton = getByText(/toggle loading/i);

    await user.click(loadingButton);
    expect(getByText(/Started loading/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    await user.click(loadingButton);
    expect(getByText(/Stopped loading/i)).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton intent="information" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    await assertAccessible(container);
  });
});
